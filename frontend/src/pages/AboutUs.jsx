// src/pages/AboutUs.jsx
import React from "react";
import { HashLink } from "react-router-hash-link";
import { motion, useReducedMotion } from "framer-motion";

/**
 * AboutUs page
 * - Uses Tailwind utility classes
 * - Uses framer-motion with reduced-motion fallback
 * - Replace images in /public/assets/ as needed
 */

const container = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

const heroVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function AboutUs() {
  const reduce = useReducedMotion();

  // Replace these stats with your real figures
  const stats = [
    { label: "Active investors", value: "5,000+" },
    { label: "Portfolios monitored", value: "8,500+" },
    { label: "Founded", value: "2018" },
    { label: "Markets covered", value: "Global" },
  ];

  const values = [
    {
      title: "Long-term thinking",
      desc: "We focus on sustainable strategies designed to perform across market cycles, not short-term speculation.",
    },
    {
      title: "Risk-aware approach",
      desc: "Capital preservation and disciplined risk management guide every investment decision.",
    },
    {
      title: "Education first",
      desc: "We empower investors with clarity, insights, and explanations — not hype or guarantees.",
    },
  ];

  const team = [
    {
      name: "Michael Anderson",
      role: "Founder & Investment Lead",
      image: "/assets/team-1.jpg",
    },
    {
      name: "Sophia Chen",
      role: "Head of Research",
      image: "/assets/team-2.jpg",
    },
    {
      name: "Daniel Roberts",
      role: "Portfolio Strategist",
      image: "/assets/team-3.jpg",
    },
  ];

  // Reduced-motion: render static layout without framer wrappers
  if (reduce) {
    return (
      <main className="bg-slate-950 text-white min-h-screen">
        <header className="py-16">
          <div className={container}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl font-bold">
                  About Our Investment Platform
                </h1>
                <p className="mt-4 text-gray-300 max-w-2xl">
                  We help investors navigate markets with clarity, discipline,
                  and long-term focus. Our approach prioritizes education,
                  diversification, and risk awareness.
                </p>
              </div>
              <div>
                <img
                  src="/assets/about-hero.jpg"
                  alt="Caregiver assisting client"
                  className="rounded-lg shadow-lg w-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <section className="py-8 border-t border-slate-800">
          <div className={container}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm text-gray-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className={container}>
            <h2 className="text-2xl font-semibold mb-4">
              Our Mission & Vision
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 p-6 rounded-lg">
                <h3 className="font-semibold">Mission</h3>
                <p className="text-gray-300 mt-2">
                  To help investors make informed, disciplined decisions through
                  clear strategies and professional insight.
                </p>
              </div>
              <div className="bg-slate-900/60 p-6 rounded-lg">
                <h3 className="font-semibold">Vision</h3>
                <p className="text-gray-300 mt-2">
                  To be a trusted, education-driven investment platform for
                  long-term wealth building.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-800">
          <div className={container}>
            <h2 className="text-2xl font-semibold mb-6">What we stand for</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((v) => (
                <div key={v.title} className="bg-slate-900/60 p-6 rounded-lg">
                  <h4 className="font-semibold">{v.title}</h4>
                  <p className="text-gray-300 mt-2">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className={container}>
            <h2 className="text-2xl font-semibold mb-6">Leadership</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {team.map((t) => (
                <div
                  key={t.name}
                  className="bg-slate-900/60 p-4 rounded-lg text-center"
                >
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-28 h-28 rounded-full mx-auto object-cover"
                  />
                  <div className="mt-3 font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-400">{t.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 border-t border-slate-800">
          <div className={container}>
            <h2 className="text-2xl font-semibold mb-4">
              Ready to invest with clarity?
            </h2>
            <p className="text-gray-300">
              Explore our investment approach and educational resources.
            </p>
            <div className="mt-6">
              <HashLink
                smooth
                to="/#home"
                className="inline-block px-6 py-3 bg-blue-600 rounded text-white font-semibold"
              >
                Get started
              </HashLink>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Animated version
  return (
    <main className="bg-slate-950 text-white min-h-screen pt-10">
      <header className="py-16">
        <div className={container}>
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={heroVariants}>
              <h1 className="text-4xl font-bold">
                About Our Investment Platform
              </h1>
              <p className="mt-4 text-gray-300 max-w-2xl">
                We help investors navigate markets with clarity, discipline, and
                long-term focus. Our approach prioritizes education,
                diversification, and risk awareness.
              </p>
              <motion.div variants={fadeUp} className="mt-6">
                <HashLink
                  smooth
                  to="/#home"
                  className="inline-block px-6 py-3 bg-blue-600 rounded text-white font-semibold"
                >
                  Get Started
                </HashLink>
              </motion.div>
            </motion.div>

            <motion.div variants={heroVariants}>
              <img
                src="/assets/about-hero.jpg"
                alt="Caregiver assisting client"
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </header>

      <section className="py-8 border-t border-slate-800">
        <div className={container}>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="text-center"
              >
                <div className="text-2xl font-bold">{s.value}</div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className={container}>
          <motion.h2
            className="text-2xl font-semibold mb-4"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Our Mission & Vision
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            <motion.div
              variants={fadeUp}
              className="bg-slate-900/60 p-6 rounded-lg"
            >
              <h3 className="font-semibold">Mission</h3>
              <p className="text-gray-300 mt-2">
                To help investors make informed, disciplined decisions through
                clear strategies and professional insight.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="bg-slate-900/60 p-6 rounded-lg"
            >
              <h3 className="font-semibold">Vision</h3>
              <p className="text-gray-300 mt-2">
                To be a trusted, education-driven investment platform for
                long-term wealth building.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-t border-slate-800">
        <div className={container}>
          <motion.h2
            className="text-2xl font-semibold mb-6"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            What we stand for
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                className="bg-slate-900/60 p-6 rounded-lg hover:shadow-md transition"
              >
                <h4 className="font-semibold">{v.title}</h4>
                <p className="text-gray-300 mt-2">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className={container}>
          <motion.h2
            className="text-2xl font-semibold mb-6"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Leadership
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            variants={stagger}
            viewport={{ once: true }}
          >
            {team.map((t) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                className="bg-slate-900/60 p-4 rounded-lg text-center hover:scale-[1.02] transition-transform"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-28 h-28 rounded-full mx-auto object-cover"
                />
                <div className="mt-3 font-semibold">{t.name}</div>
                <div className="text-sm text-gray-400">{t.role}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 border-t border-slate-800">
        <div className={container}>
          <motion.h2
            className="text-2xl font-semibold mb-4"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Ready to invest with clarity?
          </motion.h2>
          <motion.p
            className="text-gray-300 mb-6"
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            Explore our investment approach and educational resources.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <HashLink
              smooth
              href="#contact"
              className="inline-block px-6 py-3 bg-blue-600 rounded text-white font-semibold"
            >
              Get started
            </HashLink>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
