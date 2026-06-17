import { kv } from '@vercel/kv'

const TIMEOUT_MS = 5 * 60 * 1000
const HEARTBEAT_FILE = 'bots:heartbeat'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const raw = await kv.hgetall(HEARTBEAT_FILE)
  const now = Date.now()

  const bots = []
  if (raw) {
    for (const [key, val] of Object.entries(raw)) {
      try {
        const bot = JSON.parse(val)
        bots.push({
          ...bot,
          alive: (now - bot.lastPing) < TIMEOUT_MS,
        })
      } catch {}
    }
  }

  bots.sort((a, b) => b.lastPing - a.lastPing)
  res.json({ bots, count: bots.length })
}
