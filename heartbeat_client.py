"""Example: bot heartbeat client

Cara pakai di bot Python Anda:
  1. Copy file ini ke folder bot
  2. Import: from heartbeat import heartbeat
  3. Panggil tiap 1-5 menit di loop utama

Contoh:
  from heartbeat import heartbeat
  import time

  while True:
      heartbeat("bot-1", "Uniswap Swapper", status="running", message="Sesi ke-3")
      time.sleep(120)
"""

import requests
import time

TRACKER_URL = "https://NAMA_PROJECT.vercel.app/api/heartbeat"

def heartbeat(bot_id, name, status="running", message=""):
    try:
        r = requests.post(TRACKER_URL, json={
            "botId": bot_id,
            "name": name,
            "status": status,
            "message": message,
        }, timeout=10)
        return r.ok
    except Exception as e:
        print(f"Heartbeat failed: {e}")
        return False

if __name__ == "__main__":
    # test
    heartbeat("test-bot", "Test Bot", message="Percobaan")
    print("Heartbeat sent")
