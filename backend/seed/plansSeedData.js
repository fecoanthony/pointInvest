// seeds/plansSeedData.js

export const plansSeedData = [
  {
    // 1. Starter Plan (small, fast-testing)
    name: "Starter Plan",
    slug: "starter-plan",
    description: "2.5% per period, 4 payouts",
    rate: 2.5, // percent per period
    rateUnit: "day",
    periodCount: 4,
    payoutFrequencySeconds: 60, // 1 minute (good for local testing)
    minAmountCents: 5000, // $10.00
    maxAmountCents: 10000, // $10,000.00
    capitalBack: true,
    autoRenew: false,
    active: true,
    metadata: {},
  },

  {
    // 2. Velocity Plan
    name: "Velocity Plan",
    slug: "velocity-plan",
    description: "Accelerate your capital growth.",
    rate: 3.8,
    rateUnit: "day",
    periodCount: 22,
    payoutFrequencySeconds: 86400, // 1 day
    minAmountCents: 10000, // $25,000.00
    maxAmountCents: 50000, // $50,000.00
    capitalBack: false,
    autoRenew: false,
    active: true,
    metadata: {},
  },

  {
    // 3. Prestige Plan
    name: "Prestige Plan",
    slug: "prestige-plan",
    description: "Invest smart. Earn with class.",
    rate: 5,
    rateUnit: "day",
    periodCount: 30,
    payoutFrequencySeconds: 86400, // 1 day
    minAmountCents: 50000, // $50,000.00
    maxAmountCents: 200000, // $200,000.00
    capitalBack: true,
    autoRenew: false,
    active: true,
    metadata: {},
  },

  {
    // 4. Sovereign Plan (top tier)
    name: "Sovereign Plan",
    slug: "sovereign-plan",
    description: "Command your wealth with confidence.",
    rate: 7,
    rateUnit: "lifetime", // fits your enum
    periodCount: 45,
    payoutFrequencySeconds: 86400, // 1 day
    minAmountCents: 200000, // $200,000.00
    maxAmountCents: 100000, // $1,000,000.00
    capitalBack: false,
    autoRenew: false,
    active: true,
    metadata: {},
  },
];
