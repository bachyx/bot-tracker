import { kv } from '@vercel/kv'

const TIMEOUT_MS = 5 * 60 * 1000
const KEY = 'bots:list'

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

  const current = await kv.get(KEY) || []
  const idx = current.findIndex(b => b.botId === botId)
  if (idx >= 0) {
    current[idx] = entry
  } else {
    current.push(entry)
  }
  await kv.set(KEY, current.slice(-50))

  res.json({ ok: true, timestamp: now })
}
