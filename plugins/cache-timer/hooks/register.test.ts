import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On, TurnUsage } from 'claude-code'

const MIN = 60_000

type World = {
  statuses: (string | undefined)[]
  toasts: string[]
  compactions: number
  setUsage: (u: TurnUsage) => void
  /** When set, the next compaction is vetoed with this reason. */
  skipWith: string | null
  /** When set, a model step waits for it before answering. */
  stepGate: Promise<void> | null
}

const world = (on: On): World => {
  const w: World = { statuses: [], toasts: [], compactions: 0, setUsage: () => {}, skipWith: null, stepGate: null }
  let usage: TurnUsage | null = null
  w.setUsage = u => {
    usage = u
  }

  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.end', (_$, e) => ({ sessionId: e.sessionId }))
  on('ui.status', (_$, e) => {
    w.statuses.push(e.text)

    return { value: undefined }
  })
  on('ui.toast', (_$, e) => {
    w.toasts.push(e.text)

    return { value: undefined }
  })
  on('turn.step', async function* (_$, e) {
    if (w.stepGate !== null) {
      await w.stepGate
    }

    return { turnId: e.turnId, index: e.index, answer: '', toolUses: [], stopReason: 'end_turn' as const, usage }
  })
  on('session.compact', () => {
    w.compactions += 1

    if (w.skipWith !== null) {
      return { skip: w.skipWith }
    }

    return { messages: [{ role: 'user' as const, text: 'summary', toolUses: [] }], tokensBefore: 600_000, tokensAfter: 40_000 }
  })

  return w
}

const usageOf = (total: number, cacheRead: number): TurnUsage => ({
  model: 'm',
  input_tokens: 1_000,
  output_tokens: 1_000,
  cache_read_input_tokens: cacheRead,
  cache_creation_input_tokens: total - 2_000 - cacheRead,
})

const step = async ($: Engine, n: number, agentId?: string) => {
  const s = $.turn.step({ turnId: `t${n}`, index: 0, model: 'm', messageCount: 10, ...(agentId === undefined ? {} : { agentId }) })
  for await (const _ of s) {
    // drain
  }
  await s.result
}

const start = ($: Engine) => $.session.start({ cwd: '/', surface: 'terminal', isInteractive: true })

const last = (w: World) => w.statuses[w.statuses.length - 1]

test('assumed 1h cache: counts down and compacts 5 minutes before expiry', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 59:59 (1h?) · 600k/500k · 剩 5:00 时压缩')

  await clock.advance(55 * MIN - 3_000)
  expect(w.compactions).toBe(0)

  await clock.advance(3_000)
  expect(w.compactions).toBe(1)
  expect(w.toasts).toContain('缓存过期前已自动压缩：600k → 40k')

  await clock.advance(2_000)
  expect(last(w)).toBe('缓存 — · 40k')
  expect(w.compactions).toBe(1)
})

test('a miss after a 10-minute gap switches to a 5m cache and compacts 60s before expiry', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  // Below threshold briefly would be another test; here the user returns after 10 min.
  await clock.advance(4 * MIN)
  expect(w.compactions).toBe(0)
  await clock.advance(6 * MIN)
  w.setUsage(usageOf(600_000, 0))
  await step($, 2)

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 4:59 (5m) · 600k/500k · 剩 1:00 时压缩')

  await clock.advance(3 * MIN + 57_000)
  expect(w.compactions).toBe(0)
  await clock.advance(3_000)
  expect(w.compactions).toBe(1)
})

test('a hit after a 10-minute gap confirms a 1h cache', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await clock.advance(10 * MIN)
  await step($, 2)

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 59:59 (1h) · 300k/500k')
})

test('below the threshold nothing is compacted and expiry is shown', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)

  await clock.advance(61 * MIN)
  expect(w.compactions).toBe(0)
  expect(last(w)).toBe('缓存已过期 (1h?) · 300k')
})

test('the threshold option lowers the trigger', { options: { threshold_k: 200 } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)

  await clock.advance(56 * MIN)
  expect(w.compactions).toBe(1)
})

test('a pinned 5m lifetime ignores inference', { options: { cache_ttl: '5m' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 4:59 (5m) · 600k/500k · 剩 1:00 时压缩')
  await clock.advance(4 * MIN)
  expect(w.compactions).toBe(1)
})

test('the countdown starts when the request is sent, not when a long response ends', { options: { cache_ttl: '5m' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  let release: () => void = () => {}
  w.stepGate = new Promise<void>(r => {
    release = r
  })
  const running = step($, 1)
  await clock.advance(90_000)
  release()
  await running
  w.stepGate = null

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 3:29 (5m) · 600k/500k · 剩 1:00 时压缩')
  await clock.advance(2 * MIN + 27_000)
  expect(w.compactions).toBe(0)
  await clock.advance(3_000)
  expect(w.compactions).toBe(1)
})

test('a subagent step does not restart the main countdown', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await clock.advance(10 * MIN)
  w.setUsage(usageOf(50_000, 0))
  await step($, 2, 'agent-1')

  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 49:59 (1h?) · 300k/500k')
})

test('a vetoed compaction is not retried in the same idle period', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  w.skipWith = 'vetoed'
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(56 * MIN)
  expect(w.compactions).toBe(1)
  expect(w.toasts).toContain('缓存计时：自动压缩被跳过（vetoed）')
  await clock.advance(3 * MIN)
  expect(w.compactions).toBe(1)
})

test('a manual /compact resets the countdown; a precompute does not', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await $.session.compact({ trigger: 'precompute', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 59:59 (1h?) · 600k/500k · 剩 5:00 时压缩')

  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(last(w)).toBe('缓存 — · 40k')
  await clock.advance(60 * MIN)
  expect(w.compactions).toBe(2)
})

test('a /clear drops the old conversation and its countdown', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await $.session.end({ reason: 'clear', sessionId: 's1', resume: { id: 's1' } } as never)
  await clock.advance(1_000)
  expect(last(w)).toBeUndefined()
  await clock.advance(60 * MIN)
  expect(w.compactions).toBe(0)
})
