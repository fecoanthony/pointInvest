import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "../utils/motionVariants";

const SERVICES = [
  {
    title: "Smart Portfolio Allocation",
    desc: "Diversified strategies optimized through data, research, and continuous monitoring.",
  },
  {
    title: "Goal-Based Investing",
    desc: "Investment solutions tailored to life goals—retirement, growth, income, or capital preservation.",
  },
  {
    title: "Transparent Reporting",
    desc: "Clear performance metrics, risk exposure, and portfolio breakdowns—no hidden complexity.",
  },
  {
    title: "Expert Support",
    desc: "Access to experienced professionals when strategic decisions matter most.",
  },
];

export default function ServicesGrid() {
  return (
    <section id="services" className="py-12 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-2xl font-bold"
        >
          Our Services
        </motion.h2>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {SERVICES.map((s, i) => (
            <motion.article
              key={s.title}
              variants={fadeInUp}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="bg-slate-800 p-6 rounded-lg shadow-sm hover:shadow-md"
            >
              <h3 className="font-semibold text-lg text-yellow-400">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-gray-300">{s.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
