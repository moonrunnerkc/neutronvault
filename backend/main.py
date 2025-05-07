from fastapi import FastAPI, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from backend.keygen import generate_key_from_entropy
from backend.pulsar.utils.streamer import pulsar_stream
from typing import List
from backend.models import KeyResponse  # Make sure this exists
import sqlite3

app = FastAPI()
IS_DEMO = True

# ✅ CORS middleware must come immediately after app creation
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/generate-key")
def generate_key(pulsar_id: str = Query(...)):
    if IS_DEMO:
        # Fake a slower response + return fixed mock key
        import time
        time.sleep(1)
        return {
            "pulsar_id": pulsar_id,
            "timestamp": "2025-05-07T00:00:00.000000",
            "aes_key": "DEMO_KEY_BASE64==",
            "entropy_hash": "00000000000000000000000000000000"
        }

    # Real generation
    try:
        stream = pulsar_stream(pulsar_id, speed=50.0)
        entropy_event = next(stream)
        entropy = entropy_event["entropy"]
        timestamp = entropy_event["timestamp"]
        return generate_key_from_entropy(entropy, pulsar_id, timestamp)
    except Exception as e:
        return {"error": str(e)}


@app.get("/keys", response_model=List[KeyResponse])
def get_all_keys():
    conn = sqlite3.connect("backend/storage/keys.db")
    cursor = conn.cursor()
    cursor.execute("SELECT pulsar_id, timestamp, aes_key, entropy_hash FROM keys")
    rows = cursor.fetchall()
    conn.close()
    return [
        KeyResponse(
            pulsar_id=row[0],
            timestamp=row[1],
            aes_key=row[2],
            entropy_hash=row[3]
        )
        for row in rows
    ]

@app.post("/verify-key")
def verify_key(entropy_hash: str = Body(...), aes_key: str = Body(...)):
    conn = sqlite3.connect("backend/storage/keys.db")
    cursor = conn.cursor()
    cursor.execute("SELECT aes_key FROM keys WHERE entropy_hash = ?", (entropy_hash,))
    row = cursor.fetchone()
    conn.close()

    if row and row[0] == aes_key:
        return {"status": "valid", "message": "Key is authentic and matches entropy hash."}
    else:
        return {"status": "invalid", "message": "Key does not match or does not exist."}

@app.get("/keys/search", response_model=List[KeyResponse])
def search_keys(pulsar_id: str = "", timestamp: str = ""):
    conn = sqlite3.connect("backend/storage/keys.db")
    cursor = conn.cursor()
    query = "SELECT pulsar_id, timestamp, aes_key, entropy_hash FROM keys WHERE 1=1"
    params = []
    if pulsar_id:
        query += " AND pulsar_id = ?"
        params.append(pulsar_id)
    if timestamp:
        query += " AND timestamp LIKE ?"
        params.append(f"%{timestamp}%")
    cursor.execute(query, tuple(params))
    rows = cursor.fetchall()
    conn.close()
    return [
        KeyResponse(
            pulsar_id=row[0],
            timestamp=row[1],
            aes_key=row[2],
            entropy_hash=row[3]
        )
        for row in rows
    ]
