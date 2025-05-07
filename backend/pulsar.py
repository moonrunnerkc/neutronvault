# backend/pulsar.py

import time
import random
import hashlib

# Simulate a mapping of pulsar IDs to known base pulse periods (in microseconds)
PULSAR_DATABASE = {
    "PSR B1937+21": 1.5578,  # ms
    "PSR J0437−4715": 5.757, # ms
    "PSR B0833−45": 89.33    # ms (Vela Pulsar)
}

def get_pulsar_timing(pulsar_id: str) -> str:
    # Get the base period for the given pulsar
    base_period = PULSAR_DATABASE.get(pulsar_id, 10.0)

    # Simulate variation in pulse arrival due to interstellar conditions (add random micro jitter)
    simulated_arrival = base_period + random.uniform(-0.0005, 0.0005)

    # Create high entropy input by combining time, pulsar ID, and simulated pulse time
    raw_string = f"{pulsar_id}-{time.time_ns()}-{simulated_arrival}"
    
    # SHA-256 hash gives strong entropy source
    entropy = hashlib.sha256(raw_string.encode()).hexdigest()

    return entropy
