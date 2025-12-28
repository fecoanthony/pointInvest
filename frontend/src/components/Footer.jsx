import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const copyrightVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.18 } },
};

export default function footer() {
  const reduce = useReducedMotion();

  // If user prefers reduced motion, render static footer with same layout
  if (reduce) {
    return (
      <footer className="bg-base-200 dark:bg-slate-900 text-base-content dark:text-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 footer sm:footer-horizontal">
            <nav>
              <h6 className="footer-title">Services</h6>
              <a className="link link-hover block">Branding</a>
              <a className="link link-hover block">Design</a>
              <a className="link link-hover block">Marketing</a>
              <a className="link link-hover block">Advertisement</a>
            </nav>

            <nav>
              <h6 className="footer-title">Company</h6>
              <a className="link link-hover block">About us</a>
              <a className="link link-hover block">Contact</a>
              <a className="link link-hover block">Jobs</a>
              <a className="link link-hover block">Press kit</a>
            </nav>

            <nav>
              <h6 className="footer-title">Legal</h6>
              <a className="link link-hover block">Terms of use</a>
              <a className="link link-hover block">Privacy policy</a>
              <a className="link link-hover block">Cookie policy</a>
            </nav>

            <form aria-label="Newsletter signup">
              <h6 className="footer-title">Newsletter</h6>
              <fieldset className="w-full">
                <label className="mb-2 block text-sm">
                  Enter your email address
                </label>
                <div className="join flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="username@site.com"
                    className="input input-bordered join-item w-full"
                    aria-label="Email address"
                  />
                  <button className="btn btn-primary join-item">
                    Subscribe
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <a href="#" className="p-2 rounded-full hover:bg-slate-100/6">
                    <FaFacebookF className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-slate-100/6">
                    <FaTwitter className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-slate-100/6">
                    <FaInstagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-slate-100/6">
                    <FaLinkedinIn className="w-5 h-5" />
                  </a>
                </div>
              </fieldset>
            </form>
          </div>

          <div className="mt-8 border-t border-slate-200/10 pt-6 text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Wellcare Aged Care. All rights
            reserved.
          </div>
        </div>
      </footer>
    );
  }

  return (
    <motion.footer
      className="bg-base-200 dark:bg-slate-900 text-base-content dark:text-slate-200"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 footer sm:footer-horizontal">
          <motion.nav variants={itemVariants} aria-label="Services">
            <h6 className="footer-title">Services</h6>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Branding
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Design
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Marketing
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Advertisement
            </motion.a>
          </motion.nav>

          <motion.nav variants={itemVariants} aria-label="Company">
            <h6 className="footer-title">Company</h6>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              About us
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Contact
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Jobs
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Press kit
            </motion.a>
          </motion.nav>

          <motion.nav variants={itemVariants} aria-label="Legal">
            <h6 className="footer-title">Legal</h6>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Terms of use
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Privacy policy
            </motion.a>
            <motion.a
              variants={itemVariants}
              whileHover={{ y: -3, scale: 1.02 }}
              className="link link-hover block"
              href="#"
            >
              Cookie policy
            </motion.a>
          </motion.nav>

          <motion.form
            variants={itemVariants}
            aria-label="Newsletter signup"
            onSubmit={(e) => e.preventDefault()}
          >
            <h6 className="footer-title">Newsletter</h6>
            <fieldset className="w-full">
              <label className="mb-2 block text-sm">
                Enter your email address
              </label>

              <motion.div
                className="join flex items-center gap-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.45 }}
              >
                <motion.input
                  type="email"
                  placeholder="username@site.com"
                  className="input input-bordered join-item w-full bg-gray-300 p-3 text-gray-600"
                  whileFocus={{ scale: 1.01 }}
                  aria-label="Email address"
                />
                <motion.button
                  className="btn bg-blue-700 p-3 hover:bg-blue-400 text-whiteHow do you handle medication administration join-item"
                  whileHover={{ y: -3, scale: 1.02 }}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </motion.button>
              </motion.div>

              <div className="mt-4 flex items-center gap-3">
                <motion.a
                  href="#"
                  aria-label="Follow on Facebook"
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="p-2 rounded-full hover:bg-slate-100/6"
                >
                  <FaFacebookF className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="#"
                  aria-label="Follow on Twitter"
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="p-2 rounded-full hover:bg-slate-100/6"
                >
                  <FaTwitter className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="#"
                  aria-label="Follow on Instagram"
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="p-2 rounded-full hover:bg-slate-100/6"
                >
                  <FaInstagram className="w-5 h-5" />
                </motion.a>

                <motion.a
                  href="#"
                  aria-label="Follow on LinkedIn"
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="p-2 rounded-full hover:bg-slate-100/6"
                >
                  <FaLinkedinIn className="w-5 h-5" />
                </motion.a>
              </div>
            </fieldset>
          </motion.form>
        </div>

        <motion.div
          className="mt-8 border-t border-slate-200/8 pt-6 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between"
          variants={copyrightVariants}
        >
          <div>
            © {new Date().getFullYear()} Ifeanyi Anthony(Digifex). All rights
            reserved.
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-500">
            Designed with care · FECOANTHONY
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
