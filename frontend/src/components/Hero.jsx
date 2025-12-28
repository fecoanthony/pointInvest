import React from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "../utils/motionVariants";
import { HashLink } from "react-router-hash-link";

export default function Hero() {
  return (
    <section id="home" className="pt-24 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-28 flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight"
          >
            Invest with Confidence. Grow at Your Own Pace
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 text-gray-300 max-w-lg"
          >
            Clear strategies, professional management, and transparent
            reporting—so you always know where your money is working.
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex items-center gap-3"
          >
            <HashLink
              smooth
              to="/#home"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700"
            >
              Get Started
            </HashLink>
            <HashLink
              smooth
              to="/#home"
              className="px-4 py-2 border rounded-md text-gray-200 hover:text-white"
            >
              Our Services
            </HashLink>
          </motion.div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-400">
            <div>✓ 2000+ Clients</div>
            <div>✓ Professional Brokers</div>
            <div>✓ Coverage across Multiple Countries</div>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center">
          <motion.img
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src="/assets/bitcoin.png"
            alt="Caregiver assisting an older person"
            className="rounded-xl shadow-xl w-full max-w-md object-cover h-72 md:h-96"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
