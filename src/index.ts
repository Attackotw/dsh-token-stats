/**
 * @dsh-external/dsh-token-stats — Token 用量统计面板（host 侧）。
 * 聚合全部会话日志中的 usage 事件（日/周/月/按模型/按天×模型），
 * 经 webServer 路由 /dsh-token-stats/api 以 JSON 提供给 client 面板。
 */
// cordis 的 d.ts 在 NodeNext 下 export * 无扩展名会静默失效，故 host 侧以
// 最小自定义 Context 类型声明 apply 签名，运行时仍由 cordis loader 注入。
interface HostContext {
  effect(setup: () => () => void, label?: string): void
  [key: string]: unknown
}

interface UsageLike {
  inputTokens?: number
  outputTokens?: number
  cacheReadTokens?: number
  cacheWriteTokens?: number
}
interface SessionEventLike { type?: string; time?: number; data?: any }
interface SessionRecordLike { header?: { id?: string } }
interface SessionQueryLike {
  listSessions(): Promise<SessionRecordLike[]>
  readSession(id: string): Promise<{ events?: SessionEventLike[] }>
}
interface WebServerLike { register(route: any): () => void }

export const name = '@dsh-external/dsh-token-stats'
export const inject = ['sessionQuery', 'webServer']

function pad(n: number): string { return String(n).padStart(2, '0') }

function toDateKey(ts: number): string {
  const d = new Date(ts)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

function toMonthKey(ts: number): string {
  const d = new Date(ts)
  return d.getFullYear() + '-' + pad(d.getMonth() + 1)
}

function toWeekKey(ts: number): string {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return d.getFullYear() + '-W' + pad(weekNo)
}

function extractUsage(event: SessionEventLike): UsageLike | undefined {
  if (!event || !event.data) return undefined
  if (event.type === 'assistant/message') {
    return event.data.usage
  }
  if (event.type === 'assistant/chunk') {
    const chunk = event.data.chunk
    if (chunk && chunk.type === 'usage') return chunk.usage
  }
  return undefined
}

interface UsageSample {
  sessionId: string
  turn: number
  step: number
  usage: UsageLike
  provider: string
  model: string
  modelKey: string
  time: number
  date: string
  week: string
  month: string
}

interface Bucket {
  key: string
  total: number
  input: number
  output: number
  cacheRead: number
  cacheWrite: number
  messages: number
  sessions: Set<string> | number
}

async function collectStats(sessionQuery: SessionQueryLike): Promise<any> {
  try {
    const sessions = await sessionQuery.listSessions()
    const usageMap: Record<string, UsageSample> = {}
    const eventTypeCounts: Record<string, number> = {}
    let sampleUsage: any = null
    let sampleModel: any = null
    const readErrors: string[] = []

    for (const rec of sessions) {
      const sessionId = rec && rec.header && rec.header.id
      if (!sessionId) {
        readErrors.push('missing session id in record')
        continue
      }
      try {
        const snap = await sessionQuery.readSession(sessionId)
        const events = snap.events || []
        if (events.length === 0) {
          eventTypeCounts['_empty:' + sessionId] = 1
        }
        let provider = 'unknown'
        let model = 'unknown'
        for (const ev of events) {
          if (!ev || !ev.type) continue
          eventTypeCounts[ev.type] = (eventTypeCounts[ev.type] || 0) + 1

          if (ev.type === 'request/context') {
            const data = ev.data || {}
            if (data.provider) provider = String(data.provider)
            if (data.model) model = String(data.model)
            if (!sampleModel) sampleModel = { source: 'request/context', provider, model }
          } else if (ev.type === 'request/header') {
            const config = ev.data && ev.data.header && ev.data.header.config
            if (config) {
              if (config.provider) provider = String(config.provider)
              if (config.model) model = String(config.model)
              if (!sampleModel) sampleModel = { source: 'request/header', provider, model }
            }
          }

          const usage = extractUsage(ev)
          if (usage && ev.data && typeof ev.data.turn === 'number' && typeof ev.data.step === 'number') {
            if (!sampleUsage) sampleUsage = { type: ev.type, usage, provider, model }
            const key = sessionId + ':' + ev.data.turn + ':' + ev.data.step
            const time = typeof ev.time === 'number' ? ev.time : Date.now()
            usageMap[key] = {
              sessionId,
              turn: ev.data.turn,
              step: ev.data.step,
              usage,
              provider,
              model,
              modelKey: provider + '/' + model,
              time,
              date: toDateKey(time),
              week: toWeekKey(time),
              month: toMonthKey(time),
            }
          }
        }
      } catch (err: any) {
        readErrors.push(String(sessionId).slice(0, 8) + ': ' + String(err && err.message))
        console.error('[token-dashboard] read session failed:', sessionId, err && err.message)
      }
    }

    const samples = Object.values(usageMap)
    const dailyMap: Record<string, Bucket> = {}
    const weeklyMap: Record<string, Bucket> = {}
    const monthlyMap: Record<string, Bucket> = {}
    const modelMap: Record<string, any> = {}
    const dailyModelMap: Record<string, Record<string, number>> = {}
    let totalTokens = 0
    let totalMessages = 0
    let minTime = Infinity
    let maxTime = -Infinity

    function ensureBucket(map: Record<string, Bucket>, key: string): Bucket {
      if (!map[key]) {
        map[key] = { key, total: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, messages: 0, sessions: new Set<string>() }
      }
      return map[key]
    }

    for (const r of samples) {
      const u = r.usage
      const input = u.inputTokens || 0
      const output = u.outputTokens || 0
      const cacheRead = u.cacheReadTokens || 0
      const cacheWrite = u.cacheWriteTokens || 0
      const total = input + output + cacheRead + cacheWrite
      totalTokens += total
      totalMessages += 1
      if (r.time < minTime) minTime = r.time
      if (r.time > maxTime) maxTime = r.time

      const d = ensureBucket(dailyMap, r.date)
      d.total += total; d.input += input; d.output += output
      d.cacheRead += cacheRead; d.cacheWrite += cacheWrite
      d.messages += 1; (d.sessions as Set<string>).add(r.sessionId)

      const w = ensureBucket(weeklyMap, r.week)
      w.total += total; w.input += input; w.output += output
      w.cacheRead += cacheRead; w.cacheWrite += cacheWrite
      w.messages += 1; (w.sessions as Set<string>).add(r.sessionId)

      const m = ensureBucket(monthlyMap, r.month)
      m.total += total; m.input += input; m.output += output
      m.cacheRead += cacheRead; m.cacheWrite += cacheWrite
      m.messages += 1; (m.sessions as Set<string>).add(r.sessionId)

      if (!modelMap[r.modelKey]) {
        modelMap[r.modelKey] = { key: r.modelKey, provider: r.provider, model: r.model, total: 0, input: 0, output: 0, cacheRead: 0, cacheWrite: 0, messages: 0 }
      }
      const mo = modelMap[r.modelKey]
      mo.total += total; mo.input += input; mo.output += output
      mo.cacheRead += cacheRead; mo.cacheWrite += cacheWrite
      mo.messages += 1

      if (!dailyModelMap[r.date]) dailyModelMap[r.date] = {}
      dailyModelMap[r.date][r.modelKey] = (dailyModelMap[r.date][r.modelKey] || 0) + total
    }

    function finalize(map: Record<string, Bucket>): Bucket[] {
      const arr: Bucket[] = []
      for (const key in map) {
        if (Object.prototype.hasOwnProperty.call(map, key)) {
          const b = map[key]
          b.sessions = (b.sessions as Set<string>).size
          arr.push(b)
        }
      }
      return arr.sort((a, b) => a.key.localeCompare(b.key))
    }

    return {
      ok: true,
      daily: finalize(dailyMap),
      weekly: finalize(weeklyMap),
      monthly: finalize(monthlyMap),
      byModel: Object.values(modelMap).sort((a: any, b: any) => b.total - a.total),
      stacked: Object.keys(dailyModelMap).sort().map((date) => ({ date, models: dailyModelMap[date] })),
      summary: {
        totalTokens,
        totalMessages,
        totalSessions: sessions.length,
        totalModels: Object.keys(modelMap).length,
        firstDate: minTime === Infinity ? null : toDateKey(minTime),
        lastDate: maxTime === -Infinity ? null : toDateKey(maxTime),
      },
      _diagnostics: {
        eventTypeCounts,
        sampleUsage,
        sampleModel,
        usageSamples: samples.length,
        readErrors: readErrors.slice(0, 10),
      },
    }
  } catch (err: any) {
    console.error('[token-dashboard] loadTokenStats failed:', err && err.message)
    return { ok: false, error: err && err.message ? String(err.message) : String(err) }
  }
}

export function apply(ctx: HostContext): void {
  const sessionQuery = (ctx as any).sessionQuery as SessionQueryLike | undefined
  const webServer = (ctx as any).webServer as WebServerLike | undefined
  if (!sessionQuery || !webServer) return

  ctx.effect(() => webServer.register({
    kind: 'prefix',
    path: '/dsh-token-stats/api',
    handler: async (_req: any, res: any) => {
      const payload = await collectStats(sessionQuery)
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(payload))
    },
  }), '@dsh-external/dsh-token-stats: api')
}
