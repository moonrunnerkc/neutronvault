import React from "react";
import { motion } from "framer-motion";
import { SatelliteDish } from "lucide-react";
import KeyManager from "./components/KeyManager";



export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      ><div className="absolute top-4 right-4 text-xs bg-yellow-600 px-3 py-1 rounded shadow text-black font-bold">
      DEMO
    </div>
        <div className="flex justify-center items-center gap-3">
          
          <img src="/logo.png" alt="NeutronVault Logo" className="h-10" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-cyan-400">
            NeutronVault™ <br />System Dashboard
          </h1><hr />
        </div>
        <p className="text-gray-400 text-lg mt-3 max-w-2xl mx-auto">
          Encryption keys, verified by pulsars. Secure. <br /> Solo-deployable. Post-quantum ready.
        </p>
      </motion.div>

      {/* 🔐 Drop your KeyManager here once it's ready */}
      <div className="text-center mt-20 opacity-60 italic">
        <KeyManager />

      </div>
    </div>
  );
  
}
