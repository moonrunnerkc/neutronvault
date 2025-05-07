import React, { useState, useEffect } from "react";
import axios from "axios";

const IS_DEMO = true;

export default function KeyManager() {
  const [keys, setKeys] = useState([]);
  const [query, setQuery] = useState({ pulsar_id: "", timestamp: "" });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [lastKeyHash, setLastKeyHash] = useState(null);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/keys");
      setKeys(res.data);
    } catch (err) {
      console.error("Error fetching keys", err);
    }
    setLoading(false);
  };

  const searchKeys = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/keys/search", {
        params: {
          pulsar_id: query.pulsar_id,
          timestamp: query.timestamp,
        },
      });
      setKeys(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
    setLoading(false);
  };

  const generateKey = async () => {
    setGenerating(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/generate-key", {
        params: { pulsar_id: "PSR_B1937+21" },
      });
      if (res.data && !res.data.error) {
        setKeys([res.data, ...keys]);
        setLastKeyHash(res.data.entropy_hash);
      } else {
        console.warn("Demo mode or backend error", res.data);
      }
    } catch (err) {
      console.error("Key generation failed", err);
    }
    setGenerating(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative">
      {IS_DEMO && (
        <div className="absolute top-4 right-4 text-xs bg-yellow-600 px-3 py-1 rounded shadow text-black font-bold">
          DEMO
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <div className="grid md:grid-cols-2 gap-4 w-full">
          <input
            type="text"
            placeholder="Search by Pulsar ID"
            className="bg-black/30 border border-cyan-600 text-white placeholder-cyan-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={query.pulsar_id}
            onChange={(e) => setQuery({ ...query, pulsar_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Search by Timestamp"
            className="bg-black/30 border border-cyan-600 text-white placeholder-cyan-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            value={query.timestamp}
            onChange={(e) => setQuery({ ...query, timestamp: e.target.value })}
          />
        </div>
        <div className="flex gap-3 self-end">
          <button
            onClick={searchKeys}
            className="bg-cyan-600 hover:bg-cyan-700 transition px-5 py-2 rounded text-white font-semibold shadow-md"
          >
            🔍 Search
          </button>
          <button
            onClick={generateKey}
            disabled={generating}
            className={`${
              generating ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
            } transition px-5 py-2 rounded text-white font-semibold shadow-md`}
          >
            {generating ? "Generating..." : "⚡ Generate Key"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-cyan-300 text-center">Loading...</p>
      ) : (
        <div className="overflow-auto border border-cyan-800 rounded-lg max-w-6xl mx-auto">
          <table className="w-full text-sm bg-black/40">
            <thead className="bg-cyan-900/30">
              <tr>
                <th className="text-left p-3 text-cyan-300">Pulsar ID</th>
                <th className="text-left p-3 text-cyan-300">Timestamp</th>
                <th className="text-left p-3 text-cyan-300">AES Key</th>
                <th className="text-left p-3 text-cyan-300">Entropy Hash</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((key, i) => (
                <tr
                  key={i}
                  className={`border-t border-cyan-800 hover:bg-cyan-800/10 transition ${
                    lastKeyHash === key.entropy_hash ? "animate-pulse bg-cyan-950/40" : ""
                  }`}
                >
                  <td className="p-3 font-semibold text-cyan-100">{key.pulsar_id}</td>
                  <td className="p-3 text-cyan-200">{key.timestamp}</td>
                  <td className="p-3 text-xs truncate font-mono text-green-300">{key.aes_key}</td>
                  <td className="p-3 text-xs truncate font-mono text-yellow-300">{key.entropy_hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
