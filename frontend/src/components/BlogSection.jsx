// src/components/BlogSection.jsx
import React, { useRef, useEffect, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // safe to import even if you don't use routing

const containerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12";

/* Animation variants */
const columnContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      when: "beforeChildren",
    },
  },
};

const columnVariants = (direction = "left") => ({
  hidden: { x: direction === "left" ? "-30vw" : "30vw", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18,
      duration: 0.7,
      delay: direction === "right" ? 0.2 : 0,
    },
  },
});

const itemVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function PostCard({ post }) {
  return (
    <article className="flex flex-col md:flex-row gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:shadow-lg transition">
      {post.image ? (
        <img
          src={post.image}
          alt={post.title}
          className="w-full md:w-36 h-28 object-cover rounded-md shrink-0"
          loading="lazy"
        />
      ) : (
        <div className="w-full md:w-36 h-28 bg-slate-800 rounded-md shrink-0" />
      )}

      <div className="flex-1">
        <h3 className="text-lg font-semibold leading-snug text-yellow-500">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-gray-300 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="mt-3 text-xs text-slate-400">{post.date}</div>
      </div>
    </article>
  );
}

/**
 * Export sample posts array so App can import allPosts for routed detail page
 * (This keeps demo wiring simple — you can replace with real data later.)
 */
export const allPosts = [
  {
    id: "i1",
    title: "How Long-Term Investing Builds Wealth Over Time",
    excerpt:
      "Consistent investing and patience play a bigger role in wealth creation than market timing.",
    date: "Nov 18, 2025",
    image: "/assets/blog-1.png",
    content: `<p>Long-term investing focuses on staying invested through market cycles rather than reacting to short-term volatility. By maintaining a disciplined approach, investors benefit from compound growth and reduced emotional decision-making.</p>
       <p>Historically, markets have rewarded patience, especially for diversified portfolios aligned with long-term objectives.</p>
       <h3>Key Principles</h3>
       <ul>
         <li>Stay invested through market cycles</li>
         <li>Focus on fundamentals, not headlines</li>
         <li>Allow compounding to work over time</li>
       </ul>
       <p>This approach helps investors manage risk while pursuing sustainable growth.</p>`,
  },
  {
    id: "i2",
    title: "Understanding Risk vs Return in Investing",
    excerpt:
      "Every investment involves trade-offs. Learn how risk and return work together in portfolio decisions.",
    date: "Oct 02, 2025",
    image: "/assets/blog-2.png",
    content: `<p>Risk and return are closely linked. Higher potential returns often come with increased volatility, while lower-risk assets typically offer more stable but modest outcomes.</p>
       <p>Understanding your risk tolerance is essential when building a portfolio that aligns with your financial goals and time horizon.</p>
       <h3>What to Consider</h3>
       <ul>
         <li>Investment time horizon</li>
         <li>Market volatility</li>
         <li>Personal comfort with fluctuations</li>
       </ul>
       <p>A balanced approach helps manage uncertainty while pursuing long-term objectives.</p>`,
  },
  {
    id: "i3",
    title: "Why Diversification Matters More Than Timing the Market",
    excerpt:
      "Trying to predict market highs and lows is difficult. Diversification helps reduce risk instead.",
    date: "Sep 10, 2025",
    image: "/assets/blog-3.png",
    content: `<p>Diversification spreads investments across asset classes, sectors, and regions to reduce the impact of individual market events.</p>
       <p>Rather than attempting to time the market, diversified portfolios aim to deliver more consistent outcomes over time.</p>
       <h3>Diversification Benefits</h3>
       <ul>
         <li>Reduces concentration risk</li>
         <li>Smooths portfolio volatility</li>
         <li>Supports long-term consistency</li>
       </ul>
       <p>This strategy is a cornerstone of disciplined investing.</p>`,
  },
  {
    id: "i4",
    title: "How to Invest During Market Volatility",
    excerpt:
      "Market swings are normal. Learn how disciplined investors respond during uncertain periods.",
    date: "Aug 22, 2025",
    image: "/assets/blog-4.png",
    content: `<p>Volatility is a natural part of financial markets. While short-term movements can be unsettling, long-term investors focus on fundamentals and portfolio alignment.</p>
       <p>Reacting emotionally often leads to poor outcomes. Maintaining a clear strategy helps investors stay on track.</p>
       <h3>Practical Actions</h3>
       <ul>
         <li>Review long-term goals</li>
         <li>Rebalance portfolios when appropriate</li>
         <li>Avoid emotional decision-making</li>
       </ul>
       <p>Staying disciplined during volatility can strengthen long-term results.</p>`,
  },
];

export default function BlogSection({ postsLeft = [], postsRight = [] }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.12 });
  const navigate = useNavigate();

  const [selectedPost, setSelectedPost] = useState(null);
  const closeButtonRef = useRef(null);

  // Build left/right lists from allPosts if none provided (keeps simple)
  const left = postsLeft.length ? postsLeft : [allPosts[0], allPosts[1]];
  const right = postsRight.length ? postsRight : [allPosts[2], allPosts[3]];

  useEffect(() => {
    if (selectedPost) {
      setTimeout(() => closeButtonRef.current?.focus(), 40);
    }
  }, [selectedPost]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setSelectedPost(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // render static for reduced motion
  if (reduceMotion) {
    return (
      <section id="blog" className="bg-slate-950 text-white">
        <div className={containerClass}>
          <h2 className="text-2xl font-bold mb-6">From our blog</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {left.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(p)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedPost(p)}
                  className="cursor-pointer"
                >
                  <PostCard post={p} />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {right.map((p) => (
                <div
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(p)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedPost(p)}
                  className="cursor-pointer"
                >
                  <PostCard post={p} />
                </div>
              ))}
            </div>
          </div>

          {/* Modal (static) */}
          {selectedPost && (
            <div
              className="fixed inset-0 z-9999 flex items-center justify-center p-4"
              aria-modal="true"
              role="dialog"
            >
              <div
                className="absolute inset-0 bg-black/60"
                onClick={() => setSelectedPost(null)}
              />
              <div className="relative bg-slate-900 max-w-3xl w-full p-6 rounded-lg border border-slate-700 z-10 overflow-auto max-h-[80vh]">
                <h2 className="text-xl font-bold mb-4">{selectedPost.title}</h2>
                {selectedPost.image && (
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.title}
                    className="rounded mb-4 w-full object-cover"
                  />
                )}
                <div
                  className="prose max-w-none text-gray-300 mb-4"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
                <div className="flex justify-between items-center gap-4">
                  <div className="text-xs text-slate-400">
                    Published: {selectedPost.date}
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      ref={closeButtonRef}
                      onClick={() => setSelectedPost(null)}
                      className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded"
                    >
                      Close
                    </button>

                    {/* Read full article: navigate if router is present */}
                    <button
                      onClick={() => {
                        setSelectedPost(null);
                        navigate(`/blog/${selectedPost.id}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                    >
                      Read full article
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Animated path
  return (
    <section id="blog" className="bg-slate-950 text-white">
      <div ref={ref} className={containerClass}>
        <h2 className="text-2xl font-bold mb-6">From our blog</h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={columnContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="space-y-4" variants={columnVariants("left")}>
            {left.map((p) => (
              <motion.div key={p.id} variants={itemVariant}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelectedPost(p);
                  }}
                  className="cursor-pointer"
                >
                  <PostCard post={p} />
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="space-y-4" variants={columnVariants("right")}>
            {right.map((p) => (
              <motion.div key={p.id} variants={itemVariant}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPost(p)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelectedPost(p);
                  }}
                  className="cursor-pointer"
                >
                  <PostCard post={p} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Modal: fixed overlay so it sits above everything */}
      {selectedPost && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelectedPost(null)}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ y: 12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative bg-slate-900 max-w-3xl w-full p-6 rounded-lg border border-slate-700 z-10 overflow-auto max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">{selectedPost.title}</h2>

            {selectedPost.image && (
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="rounded mb-4 w-full object-cover"
              />
            )}

            {/* Rich content (HTML string from sample content) */}
            <div
              className="prose max-w-none text-gray-300 mb-4"
              dangerouslySetInnerHTML={{ __html: selectedPost.content }}
            />

            <div className="flex justify-between items-center gap-4">
              <div className="text-xs text-slate-400">
                Published: {selectedPost.date}
              </div>

              <div className="flex items-center gap-3">
                <button
                  ref={closeButtonRef}
                  onClick={() => setSelectedPost(null)}
                  className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    setSelectedPost(null);
                    navigate(`/blog/${selectedPost.id}`);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  Read full article
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
