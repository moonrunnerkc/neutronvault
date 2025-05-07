
import time
import csv
import os
from typing import Generator, Dict
from hashlib import sha256
from datetime import datetime


DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

def load_pulsar_data(pulsar_id: str) -> list:
    """Loads timing data from CSV. Each row must include 'toa' (Time of Arrival in ISO 8601)."""
    filepath = os.path.join(DATA_DIR, f"{pulsar_id}.csv")
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"No data file for {pulsar_id} at {filepath}")
    
    with open(filepath, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]


def pulsar_stream(pulsar_id: str, speed: float = 1.0) -> Generator[Dict, None, None]:
    """Simulates live pulsar timing stream. Use 'speed' > 1 to accelerate time."""
    data = load_pulsar_data(pulsar_id)
    prev_time = None

    for row in data:
        timestamp = datetime.fromisoformat(row['toa'])
        if prev_time:
            delta = (timestamp - prev_time).total_seconds() / speed
            time.sleep(max(delta, 0))
        prev_time = timestamp

        entropy_input = f"{pulsar_id}-{timestamp.isoformat()}"
        entropy = sha256(entropy_input.encode()).hexdigest()

        yield {
            "pulsar_id": pulsar_id,
            "timestamp": timestamp.isoformat(),
            "entropy": entropy
        }
