// // services/userApi.js
// import api from "../lib/axios";

// // Backend route: GET /api/auth/me
// export const getCurrentUser = () => api.get("/auth/me");

// // Backend route: GET /api/wallet/me
// export const getWallet = () => api.get("/wallet/me");

// // Backend route: GET /api/user/transaction  (assuming this is how you defined it)
// export const getUserTransactions = ({ page = 1, limit = 25, type } = {}) =>
//   api.get("/user/transaction", {
//     params: {
//       page,
//       limit,
//       ...(type ? { type } : {}),
//     },
//   });

// // Backend route: POST /api/transactions/withdraw
// export const requestWithdrawal = (data) =>
//   api.post("/transactions/withdraw", data);

// // Backend route: GET /api/referrals/my
// export const getReferrals = () => api.get("/referrals");

// // Backend route: GET /api/user/list-investment
// export const getUserInvestments = () => api.get("/user/list-investment");

// src/services/userApi.js
import api from "../lib/axios";

/**
 * AUTH
 * app.use("/api/auth", authRoute);
 *  - GET /api/auth/me
 */
export const getCurrentUser = () => api.get("/auth/me");

/**
 * WALLET
 * You said backend route: GET /api/wallet/me
 * (mount not shown, but assume app.use("/api/wallet", walletRoute))
 */
export const getWallet = () => api.get("/wallet/me");

/**
 * USER TRANSACTIONS
 * app.use("/api/user", userTransactionRoutes);
 * Assume in that router:
 *  - GET  /transaction                → listUserTransactions
 *  - POST /transactions/withdraw      → requestWithdrawal
 *  - POST /transactions/crypto-deposit → createCryptoDeposit
 *
 * Final URLs:
 *  - GET  /api/user/transaction
 *  - POST /api/user/transactions/withdraw
 *  - POST /api/user/transactions/crypto-deposit
 */
export const getUserTransactions = ({ page = 1, limit = 25, type } = {}) =>
  api.get("/user/transaction", {
    params: {
      page,
      limit,
      ...(type ? { type } : {}),
    },
  });

export const requestWithdrawal = (data) =>
  api.post("/user/transactions/withdraw", data);

// For crypto deposit (if you want a helper)
// export const createCryptoDeposit = (data) =>
//   api.post("/user/transactions/crypto-deposit", data);

/**
 * REFERRALS
 * You previously mentioned Backend route: GET /api/referrals/my
 * If you actually mounted it as app.use("/api", referralRoute) with /referrals,
 * adjust accordingly. For now assume GET /api/referrals.
 */
export const getReferrals = () => api.get("/referrals");

/**
 * USER INVESTMENTS
 * app.use("/api/user", investmentRoute);
 *  - POST /create-investment
 *  - GET  /list-investment
 *  - POST /cancel-investment/:id/cancel
 *
 * Final URLs:
 *  - POST /api/user/create-investment
 *  - GET  /api/user/list-investment
 *  - POST /api/user/cancel-investment/:id/cancel
 */
export const getUserInvestments = () => api.get("/user/list-investment");

// Optional helper to create investment directly from userApi:
export const createUserInvestment = (payload) =>
  api.post("/user/create-investment", payload);

export const cancelUserInvestment = (id) =>
  api.post(`/user/cancel-investment/${id}/cancel`);
