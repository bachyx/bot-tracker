# Setup Deploy ke Vercel

## 1. Push ke GitHub
```bash
cd /tmp/bot-tracker
git init
git add .
git commit -m "init"
gh repo create bot-tracker --public --push
```

## 2. Setup Vercel KV (Redis)
- Buka https://vercel.com → dashboard
- Pilih project → **Storage** → **Create KV Database**
- Pilih region terdekat → **Create**
- Copy **KV_URL** / **KV_REST_API_URL** dan tokennya

## 3. Deploy dari Vercel Dashboard
- **Add New** → **Project** → Import repo GitHub `bot-tracker`
- **Environment Variables** → tambahkan dari KV:
  - `KV_URL`
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`
- **Deploy**

## 4. Integrasi ke Bot
- Ganti `TRACKER_URL` di `heartbeat_client.py` dengan URL Vercel Anda
- Panggil `heartbeat()` tiap 1-5 menit di bot Anda
- Buka dashboard di `https://NAMA_PROJECT.vercel.app`

## Contoh panggilan dari bot:
```python
from heartbeat import heartbeat

# Di loop utama bot:
heartbeat("bot-solana-1", "Solana Swapper", status="running", message="Tx: 0x123...")
```
