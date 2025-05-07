# backend/keygen.py

from cryptography.hazmat.primitives.ciphers import algorithms
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import os
import base64
from datetime import datetime
from datetime import datetime
import base64

def generate_key_from_entropy(entropy_hex: str, pulsar_id: str):
    # Convert hex to bytes
    entropy_bytes = bytes.fromhex(entropy_hex)

    # Derive a 256-bit AES key using PBKDF2
    salt = os.urandom(16)
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend()
    )
    key = kdf.derive(entropy_bytes)

    # Add this missing timestamp line:
    timestamp = datetime.utcnow().isoformat()

    # Convert key to base64 for storage
    aes_key_b64 = base64.urlsafe_b64encode(key).decode()

    # Save to DB
    save_key_to_db(pulsar_id, timestamp, aes_key_b64, entropy_hex)

    return {
        "pulsar_id": pulsar_id,
        "timestamp": timestamp,
        "aes_key": aes_key_b64,
        "entropy_hash": entropy_hex
    }
import sqlite3

def save_key_to_db(pulsar_id, timestamp, aes_key, entropy_hash):
    conn = sqlite3.connect("backend/storage/keys.db")
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pulsar_id TEXT,
            timestamp TEXT,
            aes_key TEXT,
            entropy_hash TEXT
        )
    ''')

    # Insert new key
    cursor.execute('''
        INSERT INTO keys (pulsar_id, timestamp, aes_key, entropy_hash)
        VALUES (?, ?, ?, ?)
    ''', (pulsar_id, timestamp, aes_key, entropy_hash))

    conn.commit()
    conn.close()
