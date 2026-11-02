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
  /** Every status line the mod set, undefined for a cleared one. */
  statuses: (string | undefined)[]
  /** Commands the mod registered, by name. */
  registered: string[]
  /** The questions the dialog asked, with their option labels. */
  asked: { question: string; options: string[] }[]
  /** What the person answers, in order; with none left the dialog is dismissed. */
  answers: string[]
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
  const w: World = {
    configSets: [],
    thresholds: [],
    pushes: [],
    toasts: [],
    statuses: [],
    registered: [],
    asked: [],
    answers: [],
    compactions: 0,
    commands: [],
    setUsage: () => {},
    stepGate: null,
    transcriptTail: null,
    envDeny: null,
    configDeny: null,
    setIdleRow: () => {},
  }
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
  on('tool.call', { tool: 'AskUserQuestion' }, (_$, e) => {
    const [q] = (e as unknown as { questions: { question: string; options: { label: string }[] }[] }).questions
    const question = q?.question ?? ''
    w.asked.push({ question, options: (q?.options ?? []).map(o => o.label) })
    const answer = w.answers.shift()

    if (answer === undefined) {
      return { deny: 'dismissed' } as never
    }

    return { result: { questions: [q], answers: { [question]: answer } } } as never
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
  on('ui.status', (_$, e) => {
    w.statuses.push(e.text)

    return { value: undefined }
  })
  on('command.register', (_$, e) => {
    w.registered.push(e.name)

    return { value: { command: e.name } } as never
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

/** The status line the mod shows now; `—` when it shows none. */
const shown = (w: World) => w.statuses.at(-1) ?? '—'

/** Runs `/cache-timer` with the queued answers and returns its output line. */
const changeSetting = async ($: Engine, w: World, ...answers: string[]) => {
  w.asked = []
  w.answers = answers
  const ran = await $.command.run({ command: 'cache-timer', args: '' } as never)

  return ran.text
}

test('a 1h cache counts down in the status line and the mod never compacts', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(shown(w)).toBe('59:59 · 600k')

  await clock.advance(61 * MIN)
  expect(shown(w)).toBe('0:00 · 600k')
  expect(w.compactions).toBe(0)
  expect(w.commands).toEqual([])
})

test('the status line shows nothing before the first request', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  await clock.advance(5_000)
  expect(w.statuses).toEqual([undefined])
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
  expect(w.registered).toEqual(['cache-timer'])
})

test('the threshold option sets the minimum', { options: { threshold_k: 300 } }, async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(w.thresholds).toEqual(['300000'])
  await changeSetting($, w)
  expect(w.asked[0]?.options).toContain('Threshold (300k)')
})

for (const k of [50, 0]) {
  test(`a threshold of ${k}k is raised to Claude Code’s floor`, { options: { threshold_k: k } }, async ($, on) => {
    mock.clock(on, { now: 1_000_000 })
    const w = world(on)
    await start($)

    expect(w.thresholds).toEqual(['100000'])
    await changeSetting($, w)
    expect(w.asked[0]?.options).toContain('Threshold (100k)')
  })
}

test('a refused threshold is reported, and /cache-timer shows the one Claude Code uses', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  w.envDeny = 'held by policy'
  await start($)

  expect(w.toasts).toContain('cache-timer: idle-compaction threshold not set (held by policy)')
  await changeSetting($, w)
  expect(w.asked[0]?.options).toContain('Threshold (200k)')
})

test('a refused /config change leaves the threshold as it was', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.configDeny = 'locked'

  expect(await changeSetting($, w, 'Threshold (500k)', '700k')).toBe('No change')
  expect(w.toasts).toContain('cache-timer: threshold_k not changed (locked)')
  expect(w.thresholds).toEqual(['500000'])
})

test('a miss after a 10-minute gap switches to a 5m cache', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)
  await clock.advance(10 * MIN)
  w.setUsage(usageOf(600_000, 0))
  await step($, 2)

  await clock.advance(1_000)
  expect(shown(w)).toBe('4:59 · 600k')
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
  expect(shown(w)).toBe('59:59 · 300k')
})

test('a pinned 5m lifetime ignores inference', { options: { cache_ttl: '5m' } }, async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await clock.advance(1_000)
  expect(shown(w)).toBe('4:59 · 600k')
  await clock.advance(5 * MIN)
  expect(shown(w)).toBe('0:00 · 600k')
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
  expect(shown(w)).toBe('3:29 · 600k')
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
  expect(shown(w)).toBe('49:59 · 300k')
})

test('a compaction clears the countdown; a precompute does not', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(600_000, 598_000))
  await step($, 1)

  await $.session.compact({ trigger: 'precompute', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(shown(w)).toBe('59:59 · 600k')

  // Claude Code's idle compaction, like any other, replaces the cached prefix.
  await $.session.compact({ trigger: 'auto', messages: [{ role: 'user', text: 'hi', toolUses: [] }] })
  await clock.advance(1_000)
  expect(shown(w)).toBe('—')
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
  expect(shown(w)).toBe('—')
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
  expect(shown(w)).toBe('4:59 · 300k')

  // A hit after 10 minutes would read as 1h to inference; the transcript wins.
  await clock.advance(10 * MIN)
  await step($, 2)
  await clock.advance(1_000)
  expect(shown(w)).toBe('4:59 · 300k')
})

test('without a readable transcript the lifetime stays an estimate', async ($, on) => {
  const clock = mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)
  w.setUsage(usageOf(300_000, 298_000))
  await step($, 1)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })

  await clock.advance(1_000)
  expect(shown(w)).toBe('59:59 · 300k')
})

test('/cache-timer offers each setting with its current value', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(await changeSetting($, w)).toBe('No change')
  expect(w.asked).toEqual([
    { question: 'Which setting?', options: ['Idle compaction (on)', 'Threshold (500k)', 'Notification (10 min before)'] },
  ])
})

test('where Claude Code does not run idle compaction /cache-timer leaves it out', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on, { idle: 'absent' })
  await start($)

  await changeSetting($, w)
  expect(w.asked[0]?.options).toEqual(['Threshold (500k)', 'Notification (10 min before)'])
})

test('idle compaction that starts running mid-session shows after the next turn', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on, { idle: 'absent' })
  await start($)

  w.setIdleRow(true)
  await $.classic.Stop({ stop_hook_active: false, transcript_path: '/missing.jsonl' })
  await changeSetting($, w)
  expect(w.asked[0]?.options[0]).toBe('Idle compaction (on)')
})

test('a /config change to idle compaction shows in /cache-timer', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  await $.config.set({ key: 'idleCompaction', value: false } as never)
  await changeSetting($, w)
  expect(w.asked[0]?.options[0]).toBe('Idle compaction (off)')
})

test('/cache-timer switches idle compaction', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(await changeSetting($, w, 'Idle compaction (on)', 'Off')).toBe('Idle compaction off')
  expect(w.asked.map(a => a.question)).toEqual(['Which setting?', 'Idle compaction?'])
  expect(await changeSetting($, w, 'Idle compaction (off)', 'On')).toBe('Idle compaction on')
  expect(w.configSets).toEqual([
    { key: 'idleCompaction', value: false },
    { key: 'idleCompaction', value: true },
  ])
})

test('/cache-timer sets the threshold from a preset or a typed number', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(await changeSetting($, w, 'Threshold (500k)', '700k')).toBe('Threshold 700k')
  expect(w.asked[1]?.options).toEqual(['300k', '500k', '700k'])
  // Typed under Other.
  expect(await changeSetting($, w, 'Threshold (700k)', '800')).toBe('Threshold 800k')
  expect(await changeSetting($, w, 'Threshold (800k)', 'lots')).toBe('No change')
  expect(w.configSets).toEqual([
    { key: 'cache-timer@market.threshold_k', value: 700 },
    { key: 'cache-timer@market.threshold_k', value: 800 },
  ])
  expect(w.thresholds).toEqual(['500000', '700000', '800000'])
})

test('/cache-timer sets the notification', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(await changeSetting($, w, 'Notification (10 min before)', '15 min before')).toBe('Notification 15 min before')
  expect(w.asked[1]?.options).toEqual(['Off', '10 min before', '15 min before', '20 min before'])
  expect(await changeSetting($, w, 'Notification (10 min before)', 'Off')).toBe('Notification off')
  expect(w.configSets).toEqual([
    { key: 'cache-timer@market.notify_lead_minutes', value: 15 },
    { key: 'cache-timer@market.notify', value: false },
  ])
})

test('a dismissed /cache-timer changes nothing', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on)
  await start($)

  expect(await changeSetting($, w, 'Threshold (500k)')).toBe('No change')
  expect(w.configSets).toEqual([])
  expect(w.thresholds).toEqual(['500000'])
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
  const w = world(on, { stored: { [`clock:${SESSION_ID}`]: saved } })
  await start($)

  await clock.advance(1_000)
  expect(shown(w)).toBe('49:59 · 600k')
})

test('the question is the last sentence that asks one, else the last paragraph', () => {
  expect(questionOf('Done. Want me to merge it? I can also tag it.')).toBe('Want me to merge it?')
  expect(questionOf('Built v0.2.0 in src/a.ts. Ship it?')).toBe('Ship it?')
  expect(questionOf('改好了。要合并吗？\n\n```\ncode?\n```')).toBe('要合并吗？')
  expect(questionOf('First part.\n\nAll checks are green.')).toBe('All checks are green.')
  expect(questionOf('x'.repeat(300))?.length).toBe(140)
  expect(questionOf('')).toBeNull()
})

test('without /config rows (a desktop-app session) /cache-timer keeps its changes in the store', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on, { pluginRows: false })
  await start($)

  expect(await changeSetting($, w, 'Threshold (500k)', '700k')).toBe('Threshold 700k')
  expect(w.configSets).toEqual([])
  expect(w.toasts).toEqual([])
  expect(w.thresholds).toEqual(['500000', '700000'])
})

test('saved settings apply in the next session', async ($, on) => {
  mock.clock(on, { now: 1_000_000 })
  const w = world(on, { stored: { settings: { threshold_k: 300, notify: false } }, pluginRows: false })
  await start($)

  expect(w.thresholds).toEqual(['300000'])
  await changeSetting($, w)
  expect(w.asked[0]?.options).toEqual(['Idle compaction (on)', 'Threshold (300k)', 'Notification (off)'])
})
