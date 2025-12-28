import React from "react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Simple testimonial carousel:
 * - auto-rotates every 5s
 * - supports prev/next buttons and keyboard arrows
 * - accessible (aria-live for announcing changes)
 */

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex M.",
    role: "Individual Investor",
    quote:
      "The investment approach is clear and disciplined. I finally understand how my portfolio is structured and why each decision is made.",
    avatar: "/assets/testi-1.png",
  },
  {
    id: 2,
    name: "Sarah K.",
    role: "Long-Term Client",
    quote:
      "During market volatility, the guidance and regular insights helped me stay focused on my long-term goals.",
    avatar: "/assets/testi-2.png",
  },
  {
    id: 3,
    name: "Daniel R.",
    role: "Retail Investor",
    quote:
      "Professional, transparent, and educational. The focus on risk management gives me confidence in the investment process.",
    avatar: "/assets/testi-3.png",
  },
];

const variants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction > 0 ? -300 : 300, opacity: 0 }),
};

export default function TestimonialCarousel({
  autoPlay = true,
  interval = 5000,
}) {
  const [[index, direction], setIndex] = useState([0, 0]);
  const timeoutRef = useRef(null);
  const total = TESTIMONIALS.length;

  useEffect(() => {
    // auto-advance
    if (!autoPlay) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      paginate(1);
    }, interval);
    return () => clearTimeout(timeoutRef.current);
  }, [index, autoPlay, interval]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") paginate(-1);
      if (e.key === "ArrowRight") paginate(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function paginate(newDirection) {
    setIndex(([i]) => {
      const next = (i + newDirection + total) % total;
      return [next, newDirection];
    });
  }

  const item = TESTIMONIALS[index];

  return (
    <section id="testimonials" className="py-12 bg-slate-800 text-white">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold">What families say</h2>
        <p className="text-gray-300 mt-2 max-w-2xl">
          Real experiences from investors who value clarity, discipline, and a
          long-term approach to investing.
        </p>

        <div className="mt-8 relative">
          <div className="overflow-hidden rounded-lg bg-slate-900 p-6">
            <AnimatePresence custom={direction}>
              <motion.article
                key={item.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center"
                aria-live="polite"
              >
                <img
                  src={item.avatar}
                  alt={`${item.name} photo`}
                  className="w-20 h-20 rounded-full object-cover shadow-sm"
                  loading="lazy"
                />

                <div>
                  <p className="text-gray-200 italic">“{item.quote}”</p>
                  <div className="mt-3 text-sm text-gray-400">
                    <div className="font-semibold text-yellow-500">
                      {item.name}
                    </div>
                    <div>{item.role}</div>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => paginate(-1)}
                aria-label="Previous testimonial"
                className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600"
              >
                Prev
              </button>
              <button
                onClick={() => paginate(1)}
                aria-label="Next testimonial"
                className="px-3 py-2 bg-slate-700 rounded hover:bg-slate-600"
              >
                Next
              </button>
            </div>

            <div className="text-sm text-gray-400">
              {index + 1} / {total}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
