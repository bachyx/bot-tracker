import { kv } from '@vercel/kv'

const TIMEOUT_MS = 5 * 60 * 1000
const KEY = 'bots:list'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const bots = await kv.get(KEY) || []
  const now = Date.now()

  for (const bot of bots) {
    bot.alive = (now - bot.lastPing) < TIMEOUT_MS
  }

  bots.sort((a, b) => b.lastPing - a.lastPing)

  res.json({ bots, count: bots.length })
}
