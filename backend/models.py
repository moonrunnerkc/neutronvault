# backend/models.py

from pydantic import BaseModel

class KeyResponse(BaseModel):
    pulsar_id: str
    timestamp: str
    aes_key: str
    entropy_hash: str
