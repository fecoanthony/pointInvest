// src/pages/Contact.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Contact page – Investment Platform
 * - Tailwind CSS
 * - Posts JSON to /api/leads
 * - Accessible & keyboard-friendly
 */

const container = "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16";

const pageVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Contact() {
  const reduce = useReducedMotion();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    service: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [serverMessage, setServerMessage] = useState("");
  const firstInvalidRef = useRef(null);

  useEffect(() => {
    if (firstInvalidRef.current) {
      firstInvalidRef.current.focus();
    }
  }, [errors]);

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim() && !form.email.trim())
      e.phone = "Provide phone or email";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.service) e.service = "Please select a service";
    if (form.message && form.message.length > 1000)
      e.message = "Message should be under 1000 characters";
    return e;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerMessage("");
    const validation = validate();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      const order = ["name", "phone", "email", "service", "message"];
      for (const k of order) {
        if (validation[k]) {
          firstInvalidRef.current = document.getElementById(`contact-${k}`);
          break;
        }
      }
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: "contact_page" }),
      });

      if (!res.ok) throw new Error("Server error");

      setStatus("success");
      setServerMessage(
        "Thanks — your message has been received. A member of our team will contact you shortly."
      );
      setForm({
        name: "",
        phone: "",
        email: "",
        location: "",
        service: "",
        message: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus("error");
      setServerMessage(
        "Sorry — we couldn’t send your message. Please try again later."
      );
    } finally {
      setTimeout(() => {
        if (status !== "loading") setStatus(null);
      }, 3000);
    }
  }

  const root = (
    <div className="bg-slate-950 text-white min-h-screen mt-20">
      <div className={container}>
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Contact us</h1>
          <p className="text-gray-300 mt-2">
            Have a question or want to learn more about our investment approach?
            Send us a message and we’ll get back to you.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* left: contact details */}
          <aside className="md:col-span-1">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 space-y-4">
              <h2 className="font-semibold text-lg">Contact details</h2>

              <div className="text-sm text-gray-300 space-y-1">
                <div>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:support@yourdomain.com"
                    className="text-blue-400"
                  >
                    support@yourdomain.com
                  </a>
                </div>
                <div>
                  <strong>Phone:</strong>{" "}
                  <a href="tel:+1234567890" className="text-blue-400">
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="mt-3">
                  <strong>Office:</strong> Global / Remote
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-sm text-gray-300">
                <div className="font-semibold">Support hours</div>
                <div>Mon–Fri: 9:00 – 17:00</div>
                <div>Sat–Sun: Closed</div>
              </div>

              <div className="pt-4 border-t border-slate-800 text-sm">
                <div className="font-semibold mb-2">Investor support</div>
                <a
                  href="mailto:support@yourdomain.com"
                  className="inline-block px-3 py-2 bg-blue-600 rounded text-white text-sm"
                >
                  Email support
                </a>
              </div>
            </div>
          </aside>

          {/* right: form */}
          <div className="md:col-span-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-6">
              <form onSubmit={onSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm text-gray-300">Full name</span>
                    <input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, name: e.target.value }))
                      }
                      className={`mt-1 p-3 rounded bg-slate-800 border ${
                        errors.name ? "border-rose-500" : "border-slate-800"
                      } w-full`}
                      type="text"
                      placeholder="Jane Doe"
                    />
                    {errors.name && (
                      <div className="text-rose-400 text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </label>

                  <label className="block">
                    <span className="text-sm text-gray-300">Phone</span>
                    <input
                      id="contact-phone"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, phone: e.target.value }))
                      }
                      className={`mt-1 p-3 rounded bg-slate-800 border ${
                        errors.phone ? "border-rose-500" : "border-slate-800"
                      } w-full`}
                      type="tel"
                      placeholder="+1 234 567 890"
                    />
                    {errors.phone && (
                      <div className="text-rose-400 text-sm mt-1">
                        {errors.phone}
                      </div>
                    )}
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-300">Email</span>
                    <input
                      id="contact-email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, email: e.target.value }))
                      }
                      className={`mt-1 p-3 rounded bg-slate-800 border ${
                        errors.email ? "border-rose-500" : "border-slate-800"
                      } w-full`}
                      type="email"
                      placeholder="name@example.com"
                    />
                    {errors.email && (
                      <div className="text-rose-400 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-300">
                      Location (optional)
                    </span>
                    <input
                      id="contact-location"
                      value={form.location}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, location: e.target.value }))
                      }
                      className="mt-1 p-3 rounded bg-slate-800 border border-slate-800 w-full"
                      placeholder="City, Country"
                    />
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-300">
                      What can we help you with?
                    </span>
                    <select
                      id="contact-service"
                      value={form.service}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, service: e.target.value }))
                      }
                      className={`mt-1 p-3 rounded bg-slate-800 border ${
                        errors.service ? "border-rose-500" : "border-slate-800"
                      } w-full`}
                    >
                      <option value="">Select an option</option>
                      <option value="portfolio">Portfolio strategy</option>
                      <option value="education">Investment education</option>
                      <option value="advisory">Advisory services</option>
                      <option value="general">General enquiry</option>
                    </select>
                    {errors.service && (
                      <div className="text-rose-400 text-sm mt-1">
                        {errors.service}
                      </div>
                    )}
                  </label>

                  <label className="block md:col-span-2">
                    <span className="text-sm text-gray-300">
                      Message (optional)
                    </span>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={(e) =>
                        setForm((s) => ({ ...s, message: e.target.value }))
                      }
                      className="mt-1 p-3 rounded bg-slate-800 border border-slate-800 w-full min-h-[120px]"
                      placeholder="Tell us a bit about your question or goals…"
                      maxLength={1000}
                    />
                    <div className="text-xs text-slate-400 mt-1">
                      {form.message.length}/1000
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center gap-3 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold disabled:opacity-60"
                  >
                    {status === "loading" ? "Sending..." : "Send message"}
                  </button>

                  {status === "success" && (
                    <div className="text-green-400 text-sm">
                      {serverMessage}
                    </div>
                  )}

                  {status === "error" && (
                    <div className="text-rose-400 text-sm">{serverMessage}</div>
                  )}
                </div>

                <div className="mt-6 text-xs text-slate-400">
                  Information submitted is used solely to respond to your
                  enquiry. This does not constitute investment advice.
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (reduce) return root;

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariant}>
      {root}
    </motion.div>
  );
}
