import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Mail, KeyRound, SatelliteDish, ShieldCheck } from "lucide-react";

const API = "http://127.0.0.1:8000";

export default function DemoPage() {
  const [keys, setKeys] = useState([]);
  const [form, setForm] = useState({ entropy_hash: "", aes_key: "" });
  const [verify, setVerify] = useState(null);

  const fetchKeys = async () => {
    const res = await axios.get(`${API}/keys`);
    setKeys(res.data.reverse());
  };

  const generateKey = async () => {
    await axios.get(`${API}/generate-key?pulsar_id=PSR%20B1937+21`);
    fetchKeys();
  };

  const verifyKey = async () => {
    try {
      const res = await axios.post(`${API}/verify-key`, form);
      setVerify(res.data);
    } catch {
      setVerify({ status: "error", message: "Invalid or unmatched" });
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 text-black px-6 py-16 font-sans flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: -30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black drop-shadow-xl">
          NeutronVault
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Quantum-Resistant Encryption, Pulsar-Timed Authentication
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <SatelliteDish className="text-blue-600" />
            <h2 className="text-2xl font-semibold">Pulsar Key Generator</h2>
          </div>
          <button 
            onClick={generateKey} 
            className="bg-blue-600 hover:bg-blue-800 transition px-4 py-2 rounded text-white w-full"
          >
            Generate from PSR B1937+21
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <KeyRound className="text-green-600" />
            <h2 className="text-2xl font-semibold">Verify Key</h2>
          </div>
          <input
            type="text"
            placeholder="Entropy Hash"
            value={form.entropy_hash}
            onChange={(e) => setForm({ ...form, entropy_hash: e.target.value })}
            className="w-full max-w-lg mx-auto block p-2 mb-3 rounded bg-gray-50 border border-gray-300 text-black placeholder-gray-500"
          />
          <textarea
            placeholder="AES Key"
            value={form.aes_key}
            onChange={(e) => setForm({ ...form, aes_key: e.target.value })}
            className="w-full max-w-lg mx-auto block p-2 mb-3 rounded bg-gray-50 border border-gray-300 text-black placeholder-gray-500 h-24"
          />
          <button 
            onClick={verifyKey} 
            className="bg-green-600 hover:bg-green-800 transition px-4 py-2 rounded w-full text-white"
          >
            Verify
          </button>
          {verify && (
            <div className={`mt-3 text-sm ${verify.status === "valid" ? "text-green-600" : "text-red-600"}`}>
              {verify.message}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7 }}
        className="mt-20 max-w-6xl w-full"
      >
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="text-yellow-600" /> Key History
        </h2>
        <div className="overflow-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium text-gray-700">Timestamp</th>
                <th className="p-3 text-left font-medium text-gray-700">Pulsar</th>
                <th className="p-3 text-left font-medium text-gray-700">AES Key</th>
                <th className="p-3 text-left font-medium text-gray-700">Entropy Hash</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="p-2 whitespace-nowrap text-gray-600">{k.timestamp}</td>
                  <td className="p-2 text-blue-600">{k.pulsar_id}</td>
                  <td className="p-2 text-xs font-mono truncate text-green-700">{k.aes_key}</td>
                  <td className="p-2 text-xs font-mono truncate text-yellow-700">{k.entropy_hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.6 }}
        className="text-center mt-20 border-t border-gray-300 pt-8"
      >
        <Mail className="mx-auto mb-2 text-blue-600" />
        <p className="text-gray-700">Interested in a partnership, federal deployment, or custom variant?</p>
        <a href="mailto:brad@aftermathtech.com" className="text-blue-700 underline">brad@aftermathtech.com</a>
      </motion.div>
    </div>
  );
}
