import { kv } from '@vercel/kv'

const TIMEOUT_MS = 5 * 60 * 1000 // 5 menit dianggap mati
const HEARTBEAT_FILE = 'bots:heartbeat'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { botId, name, status, message } = req.body

  if (!botId || !name) {
    return res.status(400).json({ error: 'botId and name are required' })
  }

  const now = Date.now()
  const entry = {
    botId,
    name,
    status: status || 'running',
    message: message || '',
    lastPing: now,
  }

  await kv.hset(HEARTBEAT_FILE, { [botId]: JSON.stringify(entry) })

  res.json({ ok: true, timestamp: now })
}
