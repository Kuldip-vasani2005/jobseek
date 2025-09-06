import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const UniqueAlert = ({ message, type = "success", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const colors = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className={`fixed top-5 right-5 z-50 flex items-center justify-between p-4 border rounded-lg shadow-lg ${colors[type]} max-w-xs w-full`}
      >
        <div className="flex items-center gap-2">
          {type === "success" && <span className="text-xl">✅</span>}
          {type === "error" && <span className="text-xl">❌</span>}
          {type === "info" && <span className="text-xl">ℹ️</span>}
          {type === "warning" && <span className="text-xl">⚠️</span>}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-3 text-lg font-bold hover:scale-110 transition-transform"
        >
          ×
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default UniqueAlert;
