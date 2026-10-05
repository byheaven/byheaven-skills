import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On, TurnUsage } from 'claude-code'

import { questionOf, ttlFromTranscriptTail } from './register'

const MIN = 60_000
const SESSION_ID = 's1'

type World = {
  configSets: { key: string; value: unknown }[]
  pushes: string[]
  toasts: string[]
  compactions: number
  /** Commands the mod queued, by name. */
  commands: string[]
  setUsage: (u: TurnUsage) => void
  /** When set, the next compaction is vetoed with this reason. */
  skipWith: string | null
  /** When set, a model step waits for it before answering. */
  stepGate: Promise<void> | null
  /** What `tail` prints for the transcript; null makes the command fail. */
  transcriptTail: string | null
}

const world = (on: On, stored: Record<string, unknown> = {}, hasConfigRows = true): World => {
  const w: World = { configSets: [], pushes: [], toasts: [], compactions: 0, commands: [], setUsage: () => {}, skipWith: null, stepGate: null, transcriptTail: null }
  let usage: TurnUsage | null = null
  w.setUsage = u => {
    usage = u
  }

  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.end', (_$, e) => ({ sessionId: e.sessionId }))
  on('classic.Stop', () => ({}))
  on('classic.UserPromptSubmit', () => ({}))
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
    value: (hasConfigRows ? ['other.threshold_k', 'auto_compact', 'threshold_k', 'notify', 'notify_lead_minutes'] : ['autoCompact']).map(f => ({ key: f.includes('.') ? f : `cache-timer@market.${f}` }) as never),
  }))
  on('tool.call', { tool: 'PushNotification' }, (_$, e) => {
    w.pushes.push((e as unknown as { message: string }).message)

    return { text: 'sent' } as never
  })
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
  on('command.run', { command: 'compact' }, (_$, e) => {
    w.commands.push(e.command)

    return { text: '' }
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

const TIME = /^(\d+:\d\d|expired|—|compacting…)$/

/** The countdown the band draws now: the time, then the detail line. */
const shown = async ($: Engine) => {
  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text ?? '')
  await ui.unmount()
  const at = texts.findIndex(t => TIME.test(t))
  const detail = texts.slice(at + 1).find(t => /\dk\b/.test(t)) ?? ''

  return `${texts[at]} ${detail}`.trim()
}

test('assumed 1h cache: counts down and compacts 5 minutes before expiry', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k/500k')

  await clock.advance(55 * MIN - 3_000)
  expect(w.compactions).toBe(0)

  await clock.advance(3_000)
  expect(w.compactions).toBe(1)
  expect(w.toasts).toContain('compacted before cache expiry: 600k → 40k')

  await clock.advance(2_000)
  expect(await shown($)).toBe('— 40k/500k')
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
  expect(await shown($)).toBe('4:59 5m · 600k/500k')

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
  expect(await shown($)).toBe('59:59 1h · 300k/500k')
})

test('below the threshold nothing is compacted and expiry is shown', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)

  await clock.advance(61 * MIN)
  expect(w.compactions).toBe(0)
  expect(await shown($)).toBe('expired 1h · 300k/500k')
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
  expect(await shown($)).toBe('4:59 5m · 600k/500k')
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
  expect(await shown($)).toBe('3:29 5m · 600k/500k')
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
  expect(await shown($)).toBe('49:59 1h · 300k/500k')
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
  expect(await shown($)).toBe('59:59 1h · 600k/500k')

  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(await shown($)).toBe('— 40k/500k')
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
  expect(await shown($)).toBe('—')
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
  expect(await shown($)).toBe('4:59 5m · 300k/500k')

  // A hit after 10 minutes would read as 1h to inference; the transcript wins.
  await clock.advance(10 * MIN)
  await step($, 2)
  await clock.advance(1_000)
  expect(await shown($)).toBe('4:59 5m · 300k/500k')
})

test('without a readable transcript the lifetime stays an estimate', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 300k/500k')
})

test('with auto-compaction off the countdown runs and nothing is compacted', { options: { auto_compact: false } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k')
  await clock.advance(58 * MIN)
  expect(w.compactions).toBe(0)
})

test('the gear opens the settings row, whose controls write the settings', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'cache-timer', surface, ...BAND })
    expect(await ui.find({ key: 'auto' })).toBeUndefined()
    await ui.press({ key: 'settings' })
    await ui.press({ key: 'auto' })
    await ui.select({ key: 'threshold', value: '700' })
    await ui.press({ key: 'notify' })
    await ui.select({ key: 'notify_lead', value: '15' })
    await ui.press({ key: 'settings' })
    expect(await ui.find({ key: 'auto' })).toBeUndefined()
    await ui.unmount()
  }

  const once = [
    { key: 'cache-timer@market.auto_compact', value: false },
    { key: 'cache-timer@market.threshold_k', value: 700 },
    { key: 'cache-timer@market.notify', value: false },
    { key: 'cache-timer@market.notify_lead_minutes', value: 15 },
  ]
  expect(w.configSets).toEqual([...once, ...once])
})

test('the threshold picker offers 300k, 500k, and 700k', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  world(on)
  await start($)

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  await ui.press({ key: 'settings' })
  const picker = (await ui.find({ key: 'threshold' })) as { props: { options: { value: string }[]; value: string } }
  expect(picker.props.options.map(o => o.value)).toEqual(['300', '500', '700'])
  expect(picker.props.value).toBe('500')
  await ui.unmount()
})

test('a threshold outside the presets stays selectable', { options: { threshold_k: 800 } }, async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  world(on)
  await start($)

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  await ui.press({ key: 'settings' })
  const picker = (await ui.find({ key: 'threshold' })) as { props: { options: { value: string }[]; value: string } }
  expect(picker.props.options.map(o => o.value)).toEqual(['300', '500', '700', '800'])
  expect(picker.props.value).toBe('800')
  await ui.unmount()
})

test('a 1h cache sends one push notification 10 minutes before it expires', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  await $.classic.UserPromptSubmit({ prompt: 'go', session_title: 'Mod check' })
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl', last_assistant_message: 'Tests pass.\n\nShall I release **0.2.0**?' })

  await clock.advance(49 * MIN + 58_000)
  expect(w.pushes).toEqual([])
  await clock.advance(3_000)
  expect(w.pushes).toEqual(['Mod check\n「Shall I release 0.2.0?」\n— cache expires in 10 min'])
  await clock.advance(3 * MIN)
  expect(w.pushes).toHaveLength(1)
})

test('the notification lead time is honored', { options: { notify_lead_minutes: 20 } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(100_000, 98_000))
  await step($, 1)

  await clock.advance(40 * MIN + 1_000)
  expect(w.pushes).toEqual(['— cache expires in 20 min'])
})

test('with notifications off nothing is pushed', { options: { notify: false } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(100_000, 98_000))
  await step($, 1)

  await clock.advance(59 * MIN)
  expect(w.pushes).toEqual([])
})

test('a 5m cache never notifies', { options: { cache_ttl: '5m' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(100_000, 98_000))
  await step($, 1)

  await clock.advance(5 * MIN)
  expect(w.pushes).toEqual([])
})

test('a reload picks the countdown up from the store', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const saved = { lastAt: 1_000_000 - 10 * MIN, tokens: 600_000, model: 'm', ttl: '1h', isTtlObserved: true, isTtlExact: true, handledAt: null }
  world(on, { [`clock:${SESSION_ID}`]: saved })
  await start($)

  await clock.advance(1_000)
  expect(await shown($)).toBe('49:59 1h · 600k/500k')
})

test('the question is the last sentence that asks one, else the last paragraph', () => {
  expect(questionOf('Done. Want me to merge it? I can also tag it.')).toBe('Want me to merge it?')
  expect(questionOf('Built v0.2.0 in src/a.ts. Ship it?')).toBe('Ship it?')
  expect(questionOf('改好了。要合并吗？\n\n```\ncode?\n```')).toBe('要合并吗？')
  expect(questionOf('First part.\n\nAll checks are green.')).toBe('All checks are green.')
  expect(questionOf('x'.repeat(300))?.length).toBe(140)
  expect(questionOf('')).toBeNull()
})

test('without /config rows (a desktop-app session) the band keeps its changes in the store', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, {}, false)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'desktop', ...BAND })
  await ui.press({ key: 'settings' })
  await ui.select({ key: 'threshold', value: '700' })
  expect(w.configSets).toEqual([])
  expect(w.toasts).toEqual([])
  await ui.unmount()

  // 600k is now below the 700k threshold: no compaction, no plan in the band.
  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k/700k')
  await clock.advance(56 * MIN)
  expect(w.compactions).toBe(0)
})

test('saved band settings apply in the next session', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, { settings: { auto_compact: false } }, false)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(58 * MIN)
  expect(w.compactions).toBe(0)
})

test('a headless session runs /compact once per idle period instead', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(55 * MIN + 1_000)
  expect(w.compactions).toBe(0)
  expect(w.commands).toEqual(['compact'])
  expect(w.toasts).toContain('cache-timer: ran /compact before cache expiry (600k)')
  await clock.advance(3 * MIN)
  expect(w.commands).toEqual(['compact'])

  // The /compact runs as a manual compaction and resets the countdown.
  await $.session.compact({ trigger: 'manual', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(await shown($)).toBe('— 40k/500k')

  // The next idle period runs /compact again.
  w.setUsage(usageOf(600_000, 0))
  await step($, 2)
  await clock.advance(55 * MIN + 1_000)
  expect(w.commands).toEqual(['compact', 'compact'])
})
