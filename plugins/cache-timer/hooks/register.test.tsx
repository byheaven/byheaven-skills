import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On, TurnUsage } from 'claude-code'

import { ttlFromTranscriptTail } from './register'

const MIN = 60_000
const SESSION_ID = 's1'

type World = {
  configSets: { key: string; value: unknown }[]
  toasts: string[]
  compactions: number
  setUsage: (u: TurnUsage) => void
  /** When set, the next compaction is vetoed with this reason. */
  skipWith: string | null
  /** When set, a model step waits for it before answering. */
  stepGate: Promise<void> | null
  /** What `tail` prints for the transcript; null makes the command fail. */
  transcriptTail: string | null
}

const world = (on: On, stored: Record<string, unknown> = {}): World => {
  const w: World = { configSets: [], toasts: [], compactions: 0, setUsage: () => {}, skipWith: null, stepGate: null, transcriptTail: null }
  let usage: TurnUsage | null = null
  w.setUsage = u => {
    usage = u
  }

  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.end', (_$, e) => ({ sessionId: e.sessionId }))
  on('classic.Stop', () => ({}))
  on('process.run', () => ({
    value:
      w.transcriptTail === null
        ? { exitCode: 1, stdout: '', stderr: 'no such file', isStdoutTruncated: false }
        : { exitCode: 0, stdout: w.transcriptTail, stderr: '', isStdoutTruncated: false },
  }))
  mock.store(on, stored)
  on('session.id', () => ({ value: SESSION_ID }))
  // As an installed plugin's rows are named; another plugin's field of the same name is ignored.
  on('config.list', () => ({
    value: ['other.threshold_k', 'cache-timer@market.auto_compact', 'cache-timer@market.threshold_k'].map(key => ({ key }) as never),
  }))
  on('config.set', (_$, e) => {
    w.configSets.push({ key: e.key, value: e.value })

    return { value: e.value }
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

const BAND = {
  component: 'AbovePrompt' as const,
  props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100, scroll: { offset: 0, bodyRows: 10 }, view: {} },
}

/** The countdown text the band draws now. */
const shown = async ($: Engine) => {
  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  const text = (await ui.find({ type: 'Text' }))?.text
  await ui.unmount()

  return text
}

test('assumed 1h cache: counts down and compacts 5 minutes before expiry', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 59:59 (1h?) · 600k · compacts at 5:00 left')

  await clock.advance(55 * MIN - 3_000)
  expect(w.compactions).toBe(0)

  await clock.advance(3_000)
  expect(w.compactions).toBe(1)
  expect(w.toasts).toContain('compacted before cache expiry: 600k → 40k')

  await clock.advance(2_000)
  expect(await shown($)).toBe('cache — · 40k')
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
  expect(await shown($)).toBe('cache 4:59 (5m) · 600k · compacts at 1:00 left')

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
  expect(await shown($)).toBe('cache 59:59 (1h) · 300k')
})

test('below the threshold nothing is compacted and expiry is shown', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)

  await clock.advance(61 * MIN)
  expect(w.compactions).toBe(0)
  expect(await shown($)).toBe('cache expired (1h?) · 300k')
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
  expect(await shown($)).toBe('cache 4:59 (5m) · 600k · compacts at 1:00 left')
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
  expect(await shown($)).toBe('cache 3:29 (5m) · 600k · compacts at 1:00 left')
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
  expect(await shown($)).toBe('cache 49:59 (1h?) · 300k')
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
  expect(w.toasts).toContain('cache-timer: auto-compaction skipped (vetoed)')
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
  expect(await shown($)).toBe('cache 59:59 (1h?) · 600k · compacts at 5:00 left')

  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(await shown($)).toBe('cache — · 40k')
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
  expect(await shown($)).toBe('cache —')
  await clock.advance(60 * MIN)
  expect(w.compactions).toBe(0)
})

const row = (o: object) => JSON.stringify(o)
const write = (h1: number, m5: number, isSidechain = false) =>
  row({ type: 'assistant', isSidechain, message: { usage: { cache_creation: { ephemeral_1h_input_tokens: h1, ephemeral_5m_input_tokens: m5 } } } })

test('the transcript tail names the lifetime of the last main cache write', () => {
  expect(ttlFromTranscriptTail([write(900, 0), write(0, 0), '{"type":"user"}'].join('\n'))).toBe('1h')
  expect(ttlFromTranscriptTail([write(900, 0), write(0, 400)].join('\n'))).toBe('5m')
  expect(ttlFromTranscriptTail([write(0, 400), write(900, 0, true)].join('\n'))).toBe('5m')
  expect(ttlFromTranscriptTail('{"type":"assist')).toBeNull()
  expect(ttlFromTranscriptTail([write(0, 0)].join('\n'))).toBeNull()
})

test('an exact 5m lifetime from the transcript is not overturned by inference', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  w.transcriptTail = write(0, 2_000)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/t.jsonl' })

  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 4:59 (5m) · 300k')

  // A hit after 10 minutes would read as 1h to inference; the transcript wins.
  await clock.advance(10 * MIN)
  await step($, 2)
  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 4:59 (5m) · 300k')
})

test('without a readable transcript the lifetime stays an estimate', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })

  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 59:59 (1h?) · 300k')
})

test('with auto-compaction off the countdown runs and nothing is compacted', { options: { auto_compact: false } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 59:59 (1h?) · 600k')
  await clock.advance(58 * MIN)
  expect(w.compactions).toBe(0)
})

test('the band switch and threshold picker write the settings', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'cache-timer', surface, ...BAND })
    expect((await ui.find({ key: 'auto' }))?.text).toBe('on')
    await ui.press({ key: 'auto' })
    await ui.select({ key: 'threshold', value: '700' })
    await ui.unmount()
  }

  expect(w.configSets).toEqual([
    { key: 'cache-timer@market.auto_compact', value: false },
    { key: 'cache-timer@market.threshold_k', value: 700 },
    { key: 'cache-timer@market.auto_compact', value: false },
    { key: 'cache-timer@market.threshold_k', value: 700 },
  ])
})

test('a reload picks the countdown up from the store', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const saved = { lastAt: 1_000_000 - 10 * MIN, tokens: 600_000, model: 'm', ttl: '1h', isTtlObserved: true, isTtlExact: true, handledAt: null }
  world(on, { [`clock:${SESSION_ID}`]: saved })
  await start($)

  await clock.advance(1_000)
  expect(await shown($)).toBe('cache 49:59 (1h) · 600k · compacts at 5:00 left')
})
