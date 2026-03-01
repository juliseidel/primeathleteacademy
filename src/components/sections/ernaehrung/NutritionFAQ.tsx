"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { nutritionFaq } from "@/lib/constants";

export default function NutritionFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {nutritionFaq.map((item, i) => (
        <div
          key={i}
          className="border border-gray-800/50 rounded-xl bg-gray-900/30 backdrop-blur-sm overflow-hidden transition-colors duration-300 hover:border-gold/20"
        >
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between gap-4 p-6 text-left cursor-pointer"
          >
            <span className="text-lg font-semibold text-white">
              {item.question}
            </span>
            <motion.div
              animate={{ rotate: openIndex === i ? 180 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-gold" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="px-6 pb-6">
                  <p className="text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
