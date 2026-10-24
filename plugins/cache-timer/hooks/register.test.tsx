import { expect, mock, test } from 'claude-code/testing'
import type { Engine } from 'claude-code/testing'
import type { On, TurnUsage } from 'claude-code'

import { questionOf, ttlFromTranscriptTail } from './register'

const MIN = 60_000
const SESSION_ID = 's1'

type World = {
  configSets: { key: string; value: unknown }[]
  /** Values the mod gave Claude Code's idle-compaction minimum. */
  thresholds: string[]
  pushes: string[]
  toasts: string[]
  compactions: number
  /** Commands the mod queued, by name. */
  commands: string[]
  setUsage: (u: TurnUsage) => void
  /** When set, a model step waits for it before answering. */
  stepGate: Promise<void> | null
  /** What `tail` prints for the transcript; null makes the command fail. */
  transcriptTail: string | null
  /** When set, setting an environment variable is refused with this reason. */
  envDeny: string | null
  /** When set, a /config write is refused with this reason. */
  configDeny: string | null
  /** Changes Claude Code's idle-compaction row, as a flag the engine fetched would. */
  setIdleRow: (value: boolean | 'absent') => void
}

type Setup = {
  stored?: Record<string, unknown>
  /** Whether /config lists the mod's fields; a desktop-app session does not. */
  pluginRows?: boolean
  /** Claude Code's idle-compaction row: its value, or absent where it does not run. */
  idle?: boolean | 'absent'
}

const world = (on: On, { stored = {}, pluginRows = true, idle = true }: Setup = {}): World => {
  const w: World = { configSets: [], thresholds: [], pushes: [], toasts: [], compactions: 0, commands: [], setUsage: () => {}, stepGate: null, transcriptTail: null, envDeny: null, configDeny: null, setIdleRow: () => {} }
  let usage: TurnUsage | null = null
  w.setUsage = u => {
    usage = u
  }
  let idleValue = idle
  const env: Record<string, string | undefined> = {}
  w.setIdleRow = value => {
    idleValue = value
  }

  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('session.end', (_$, e) => ({ sessionId: e.sessionId }))
  on('classic.Stop', () => ({}))
  on('classic.UserPromptSubmit', () => ({}))
  on('process.run', () => ({
    value:
      w.transcriptTail === null
        ? { exitCode: 1, stdout: '', stderr: 'no such file', isStdoutTruncated: false, isStderrTruncated: false }
        : { exitCode: 0, stdout: w.transcriptTail, stderr: '', isStdoutTruncated: false, isStderrTruncated: false },
  }))
  mock.store(on, stored)
  on('session.id', () => ({ value: SESSION_ID }))
  // As an installed plugin's rows are named; another plugin's field of the same name is ignored.
  on('config.list', () => {
    const fields = pluginRows ? ['other.threshold_k', 'threshold_k', 'notify', 'notify_lead_minutes'] : []
    const rows = [
      { key: 'autoCompact', value: true },
      ...(idleValue === 'absent' ? [] : [{ key: 'idleCompaction', value: idleValue }]),
      ...fields.map(f => ({ key: f.includes('.') ? f : `cache-timer@market.${f}`, value: null })),
    ]

    return { value: rows as never }
  })
  on('tool.call', { tool: 'PushNotification' }, (_$, e) => {
    w.pushes.push((e as unknown as { message: string }).message)

    return { result: 'sent' } as never
  })
  on('config.set', (_$, e) => {
    if (w.configDeny !== null) {
      return { deny: w.configDeny }
    }
    w.configSets.push({ key: e.key, value: e.value })
    if (e.key === 'idleCompaction') {
      idleValue = e.value as boolean
    }

    return { value: e.value }
  })
  on('env.set', (_$, e) => {
    if (w.envDeny !== null) {
      return { value: { deny: w.envDeny } }
    }
    if (e.name === 'CLAUDE_CODE_IDLE_COMPACT_MIN_TOKENS') {
      w.thresholds.push(e.value ?? '')
    }
    env[e.name] = e.value

    return { value: {} }
  })
  on('env.get', (_$, e) => ({ value: env[e.name] }))
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
  on('command.run', (_$, e) => {
    w.commands.push(e.command)

    return { text: '' }
  })
  on('session.compact', () => {
    w.compactions += 1

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

const TIME = /^(\d+:\d\d|expired|—)$/

/** The countdown the band draws now: the time, then the detail line. */
const shown = async ($: Engine) => {
  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text ?? '')
  await ui.unmount()
  const at = texts.findIndex(t => TIME.test(t))
  const detail = texts.slice(at + 1).find(t => /\dk\b/.test(t)) ?? ''

  return `${texts[at]} ${detail}`.trim()
}

/** Every text the terminal band draws, the settings row opened when asked. */
const textsOf = async ($: Engine, isExpanded = false) => {
  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  if (isExpanded) {
    await ui.press({ key: 'settings' })
  }
  const texts = (await ui.findAll({ type: 'Text' })).map(t => t.text ?? '')
  const hasSwitch = (await ui.find({ key: 'idle' })) !== undefined
  await ui.unmount()

  return { texts, hasSwitch }
}

test('a 1h cache counts down against the idle-compaction threshold and the mod never compacts', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k/500k')

  await clock.advance(61 * MIN)
  expect(await shown($)).toBe('expired 1h · 600k/500k')
  expect(w.compactions).toBe(0)
  expect(w.commands).toEqual([])
})

test('a headless session does not compact either', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await $.session.start({ cwd: '/', surface: null, isInteractive: false })
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(61 * MIN)
  expect(w.compactions).toBe(0)
  expect(w.commands).toEqual([])
})

test('the session gets the threshold as Claude Code’s idle-compaction minimum', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(w.thresholds).toEqual(['500000'])
})

test('the threshold option sets the minimum and the band', { options: { threshold_k: 300 } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(w.thresholds).toEqual(['300000'])
  expect(await shown($)).toBe('59:59 1h · 600k/300k')
})

for (const k of [50, 0]) {
  test(`a threshold of ${k}k is raised to Claude Code’s floor`, { options: { threshold_k: k } }, async ($, on) => {
    const clock = mock.clock(on, { now: 1_000_000 })
    const w = world(on)
    await start($)
    w.setUsage(usageOf(600_000, 598_000))
    await step($, 1)

    await clock.advance(1_000)
    expect(w.thresholds).toEqual(['100000'])
    expect(await shown($)).toBe('59:59 1h · 600k/100k')
  })
}

test('a refused threshold is reported, and the band shows the one Claude Code uses', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  w.envDeny = 'held by policy'
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(w.toasts).toContain('cache-timer: idle-compaction threshold not set (held by policy)')
  expect(await shown($)).toBe('59:59 1h · 600k/200k')
})

test('a refused /config change leaves the threshold as it was', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  w.configDeny = 'locked'

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  await ui.press({ key: 'settings' })
  await ui.select({ key: 'threshold', value: '700' })
  await ui.unmount()

  await clock.advance(1_000)
  expect(w.toasts).toContain('cache-timer: threshold_k not changed (locked)')
  expect(w.thresholds).toEqual(['500000'])
  expect(await shown($)).toBe('59:59 1h · 600k/500k')
})

test('a miss after a 10-minute gap switches to a 5m cache, which idle compaction leaves alone', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  await clock.advance(10 * MIN)
  w.setUsage(usageOf(600_000, 0))
  await step($, 2)

  await clock.advance(1_000)
  expect(await shown($)).toBe('4:59 5m · 600k')
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

test('a pinned 5m lifetime ignores inference', { options: { cache_ttl: '5m' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('4:59 5m · 600k')
  await clock.advance(5 * MIN)
  expect(await shown($)).toBe('expired 5m · 600k')
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
  expect(await shown($)).toBe('3:29 5m · 600k')
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

test('a compaction resets the countdown; a precompute does not', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await $.session.compact({ trigger: 'precompute', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k/500k')

  // Claude Code's idle compaction, like any other, replaces the cached prefix.
  await $.session.compact({ trigger: 'auto', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
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
  expect(await shown($)).toBe('4:59 5m · 300k')

  // A hit after 10 minutes would read as 1h to inference; the transcript wins.
  await clock.advance(10 * MIN)
  await step($, 2)
  await clock.advance(1_000)
  expect(await shown($)).toBe('4:59 5m · 300k')
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

test('with idle compaction off the band says so and leaves the threshold out', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, { idle: false })
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k')
  const { texts, hasSwitch } = await textsOf($, true)
  expect(texts).toContain('idle')
  expect(hasSwitch).toBe(true)
})

/** How the band marks idle compaction: the terminal word's color, the desktop icon's alt text. */
const idleMark = async ($: Engine) => {
  const terminal = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  const word = (await terminal.findAll({ type: 'Text' })).find(t => t.text === 'idle')
  await terminal.unmount()
  const desktop = await $.ui.mount({ plugin: 'cache-timer', surface: 'desktop', ...BAND })
  const icon = (await desktop.findAll({ type: 'Svg' })).find(t => String(t.props.alt).startsWith('idle compaction'))
  await desktop.unmount()

  return { color: word?.props.color, alt: icon?.props.alt }
}

test('the band marks idle compaction on and off apart', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  expect(await idleMark($)).toEqual({ color: 'success', alt: 'idle compaction on' })

  w.setIdleRow(false)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })
  expect(await idleMark($)).toEqual({ color: 'inactive', alt: 'idle compaction off' })
})

test('where Claude Code does not run idle compaction the band says n/a and offers no switch', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, { idle: 'absent' })
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k')
  const { texts, hasSwitch } = await textsOf($, true)
  expect(texts).toContain('idle n/a')
  expect(texts).toContain('idle compaction n/a')
  expect(hasSwitch).toBe(false)
})

test('idle compaction that starts running mid-session shows after the next turn', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, { idle: 'absent' })
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k')

  w.setIdleRow(true)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })
  await clock.advance(1_000)
  expect(await shown($)).toBe('59:58 1h · 600k/500k')
})

test('a /config change to idle compaction shows in the band', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await $.config.set({ key: 'idleCompaction', value: false } as never)
  await clock.advance(1_000)
  expect(await shown($)).toBe('59:59 1h · 600k')
})

test('the gear opens the settings row, whose controls write the settings', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ plugin: 'cache-timer', surface, ...BAND })
    expect(await ui.find({ key: 'idle' })).toBeUndefined()
    await ui.press({ key: 'settings' })
    await ui.press({ key: 'idle' })
    await ui.select({ key: 'threshold', value: '700' })
    await ui.press({ key: 'notify' })
    await ui.select({ key: 'notify_lead', value: '15' })
    await ui.press({ key: 'settings' })
    expect(await ui.find({ key: 'idle' })).toBeUndefined()
    await ui.unmount()
  }

  const rest = [
    { key: 'cache-timer@market.threshold_k', value: 700 },
    { key: 'cache-timer@market.notify', value: false },
    { key: 'cache-timer@market.notify_lead_minutes', value: 15 },
  ]
  // The switch flips Claude Code's own setting: off, then back on.
  expect(w.configSets).toEqual([{ key: 'idleCompaction', value: false }, ...rest, { key: 'idleCompaction', value: true }, ...rest])
  expect(w.thresholds).toEqual(['500000', '700000', '700000'])
})

test('the threshold picker offers 300k, 500k, and 700k', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  world(on)
  await start($)

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'terminal', ...BAND })
  await ui.press({ key: 'settings' })
  const picker = (await ui.find({ key: 'threshold' })) as unknown as { props: { options: { value: string }[]; value: string } }
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
  const picker = (await ui.find({ key: 'threshold' })) as unknown as { props: { options: { value: string }[]; value: string } }
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
  const saved = { lastAt: 1_000_000 - 10 * MIN, tokens: 600_000, model: 'm', ttl: '1h', isTtlObserved: true, isTtlExact: true }
  world(on, { stored: { [`clock:${SESSION_ID}`]: saved } })
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
  const w = world(on, { pluginRows: false })
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  const ui = await $.ui.mount({ plugin: 'cache-timer', surface: 'desktop', ...BAND })
  await ui.press({ key: 'settings' })
  await ui.select({ key: 'threshold', value: '700' })
  expect(w.configSets).toEqual([])
  expect(w.toasts).toEqual([])
  await ui.unmount()

  await clock.advance(1_000)
  expect(w.thresholds).toEqual(['500000', '700000'])
  expect(await shown($)).toBe('59:59 1h · 600k/700k')
})

test('saved band settings apply in the next session', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on, { stored: { settings: { threshold_k: 300 } }, pluginRows: false })
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(w.thresholds).toEqual(['300000'])
  expect(await shown($)).toBe('59:59 1h · 600k/300k')
})
