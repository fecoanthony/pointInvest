// // src/services/adminApi.js
// import api from "../lib/axios";

// /**
//  * DASHBOARD SUMMARY
//  * GET /api/admin/dashboard/summary
//  */
// export const getAdminDashboardSummary = () =>
//   api.get("/admin/dashboard/summary");

// /**
//  * USERS
//  * Base: /api/admin/users
//  */
// export const adminListUsers = (params = {}) =>
//   api.get("/admin/users", { params });

// export const adminGetUserDetails = (userId) =>
//   api.get(`/admin/users/${userId}`);

// export const adminChangeUserRole = (userId, role) =>
//   api.patch(`/admin/users/${userId}/role`, { role });

// export const adminToggleUserSuspension = (userId) =>
//   api.patch(`/admin/users/${userId}/status`);

// /**
//  * INVESTMENTS
//  * Base: /api/admin/investments
//  */
// export const adminListInvestments = (params = {}) =>
//   api.get("/admin/investments", { params });

// export const adminToggleInvestmentState = (investmentId, action) =>
//   api.patch("/admin/investments/state", { investmentId, action });

// export const adminForceCancelInvestment = (investmentId) =>
//   api.patch(`/admin/investments/${investmentId}/force-cancel`);

// /**
//  * PLANS
//  * Assuming plan routes are mounted under /api/admin/plans
//  */
// export const adminListPlans = () => api.get("/plan/list-plan");

// export const adminCreatePlan = (data) =>
//   api.post("/admin/plan/create-plan", data);

// export const adminGetPlan = (id) => api.get(`/admin/plans/${id}`);

// export const adminUpdatePlan = (id, data) =>
//   api.put(`/admin/plans/${id}`, data);

// export const adminTogglePlan = (id) => api.patch(`/admin/plans/${id}/toggle`);

// /**
//  * TRANSACTIONS
//  * Base: /api/admin/transactions
//  */
// export const adminListTransactions = (params = {}) =>
//   api.get("/admin/transactions", { params });

// export const adminGetTransactionById = (id) =>
//   api.get(`/admin/transactions/${id}`);

// export const adminCreateDeposit = (payload) =>
//   api.post("/admin/transactions/deposit", payload);

// export const adminProcessWithdrawal = (payload) =>
//   api.post("/admin/transactions/withdraw/process", payload);

// export const adminGetPendingCryptoDeposits = () =>
//   api.get("/admin/transactions/crypto/pending");

// export const adminApproveCryptoDeposit = (txId) =>
//   api.post(`/admin/transactions/crypto/approve/${txId}`);

// src/services/adminApi.js
import api from "../lib/axios";

/**
 * DASHBOARD SUMMARY
 * GET /api/admin/dashboard/summary
 */
export const getAdminDashboardSummary = () =>
  api.get("/admin/dashboard/summary");

/**
 * USERS
 * Routes mounted at: app.use("/api/admin/users", adminUserRoutes);
 *
 * Final URLs:
 *  - GET  /api/admin/users       (list)
 *  - GET  /api/admin/users/:id   (details)
 *  - PATCH /api/admin/users/:id/role
 *  - PATCH /api/admin/users/:id/status
 */
export const adminListUsers = (params = {}) =>
  api.get("/admin/users", { params });

export const adminGetUserDetails = (userId) =>
  api.get(`/admin/users/${userId}`);

export const adminChangeUserRole = (userId, role) =>
  api.patch(`/admin/users/${userId}/role`, { role });

export const adminToggleUserSuspension = (userId) =>
  api.patch(`/admin/users/${userId}/status`);

/**
 * INVESTMENTS
 * Routes mounted at: app.use("/api/admin", adminInvestmentRoute);
 *
 * In that router:
 *  - GET /investments → adminListInvestments
 *  - PATCH /investments/state → toggleInvestmentState
 *  - PATCH /investments/:investmentId/force-cancel → forceCancelInvestment
 *
 * Final URLs:
 *  - GET  /api/admin/investments
 *  - PATCH /api/admin/investments/state
 *  - PATCH /api/admin/investments/:investmentId/force-cancel
 */
export const adminListInvestments = (params = {}) =>
  api.get("/admin/investments", { params });

export const adminToggleInvestmentState = (investmentId, action) =>
  api.patch("/admin/investments/state", { investmentId, action });

export const adminForceCancelInvestment = (investmentId) =>
  api.patch(`/admin/investments/${investmentId}/force-cancel`);

/**
 * PLANS
 * Routes mounted at: app.use("/api/plan", planRoute);
 *
 * In that router:
 *  - POST /create-plan
 *  - GET  /list-plan
 *  - GET  /single-plan        (currently no :id; adjust if needed)
 *  - PATCH /toggle-plan/:id
 *  - PUT   /update-plan/:id
 *
 * Final URLs:
 *  - POST /api/plan/create-plan
 *  - GET  /api/plan/list-plan
 *  - GET  /api/plan/single-plan
 *  - PATCH /api/plan/toggle-plan/:id
 *  - PUT   /api/plan/update-plan/:id
 */
export const adminListPlans = () => api.get("/plan/list-plan");

export const adminCreatePlan = (data) => api.post("/plan/create-plan", data);

// NOTE: Your current route is GET /single-plan with no :id.
// If you add /single-plan/:id, then use this:
export const adminGetPlan = (id) => api.get(`/plan/single-plan/${id}`);

export const adminUpdatePlan = (id, data) =>
  api.put(`/plan/update-plan/${id}`, data);

export const adminTogglePlan = (id) => api.patch(`/plan/toggle-plan/${id}`);

/**
 * TRANSACTIONS
 * Assuming you adjusted adminTransactionRoutes to:
 *
 *  app.use("/api/admin", adminTransactionRoutes);
 *
 *  router.use(protectroute, isAdmin("admin","super_admin"));
 *  router.get("/transactions", adminListTransactions);
 *  router.get("/transactions/:id", getTransactionById);
 *  router.post("/transactions/deposit", createDeposit);
 *  router.post("/transactions/withdraw/process", processWithdrawal);
 *  router.get("/transactions/crypto/pending", getPendingCryptoDeposits);
 *  router.post("/transactions/crypto/approve/:txId", approveCryptoDeposit);
 *
 * Final URLs:
 *  - /api/admin/transactions...
 */
export const adminListTransactions = (params = {}) =>
  api.get("/admin/transactions", { params });

export const adminGetTransactionById = (id) =>
  api.get(`/admin/transactions/${id}`);

export const adminCreateDeposit = (payload) =>
  api.post("/admin/transactions/deposit", payload);

export const adminProcessWithdrawal = (payload) =>
  api.post("/admin/transactions/withdraw/process", payload);

export const adminGetPendingCryptoDeposits = () =>
  api.get("/admin/transactions/crypto/pending");

export const adminApproveCryptoDeposit = (txId) =>
  api.post(`/admin/transactions/crypto/approve/${txId}`);
