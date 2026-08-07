import React from "react";
import { motion } from "framer-motion";

export const Card = ({ children, className = "", onClick, hover = true }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`bg-brand-card2 border border-brand-taupe/20 rounded-2xl p-5 shadow-lg backdrop-blur-md ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};