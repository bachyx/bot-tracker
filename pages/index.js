import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)

  async function fetchBots() {
    try {
      const res = await fetch('/api/bots')
      const data = await res.json()
      setBots(data.bots || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBots()
    const interval = setInterval(fetchBots, 10000)
    return () => clearInterval(interval)
  }, [])

  const aliveCount = bots.filter(b => b.alive).length
  const deadCount = bots.filter(b => !b.alive).length

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#0f0f0f', minHeight: '100vh', color: '#e0e0e0' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Bot Tracker</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1a1a', padding: '1rem 1.5rem', borderRadius: 8, border: '1px solid #333' }}>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>Running</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4ade80' }}>{aliveCount}</div>
        </div>
        <div style={{ background: '#1a1a1a', padding: '1rem 1.5rem', borderRadius: 8, border: '1px solid #333' }}>
          <div style={{ fontSize: '0.8rem', color: '#888' }}>Dead</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#f87171' }}>{deadCount}</div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : bots.length === 0 ? (
        <div style={{ color: '#888' }}>Belum ada bot yang terdaftar. Integrasikan heartbeat ke bot Anda.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {bots.map(bot => (
            <div key={bot.botId} style={{
              background: '#1a1a1a',
              border: `1px solid ${bot.alive ? '#4ade80' : '#f87171'}`,
              borderRadius: 8,
              padding: '1rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: 600 }}>{bot.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  ID: {bot.botId} &middot; Last ping: {new Date(bot.lastPing).toLocaleString('id-ID')}
                </div>
                {bot.message && (
                  <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.25rem' }}>
                    {bot.message}
                  </div>
                )}
              </div>
              <div style={{
                padding: '0.25rem 0.75rem',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 600,
                background: bot.alive ? '#166534' : '#7f1d1d',
                color: bot.alive ? '#86efac' : '#fca5a5',
              }}>
                {bot.alive ? 'RUNNING' : 'DEAD'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
