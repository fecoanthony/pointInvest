import Plan from "../../models/Plan.js";
import Investment from "../../models/Investment.js";

/**
 * Admin: List all plans
 */
// controllers/admin/adminPlansController.js

export const adminListPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: plans });
  } catch (err) {
    console.error("adminListPlans error:", err); // 👈 log to server console
    res.status(500).json({
      success: false,
      message: err.message || "Failed to list plans",
    });
  }
};
/**
 * Admin: Create plan
 */
export const adminCreatePlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Get Single Plan
 */
export const getPlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id).lean();
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    return res.json({ success: true, data: plan });
  } catch (err) {
    console.error("getPlan error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * Admin: Update plan (BLOCKED if locked)
 */
export const adminUpdatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (plan.locked) {
      return res.status(403).json({
        message: "Plan is locked because users have invested in it",
      });
    }

    Object.assign(plan, req.body);
    await plan.save();

    res.json({ success: true, data: plan });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Super Admin: Activate / Deactivate plan
 */
export const adminTogglePlan = async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  if (!plan) return res.status(404).json({ message: "Plan not found" });

  plan.active = !plan.active;
  await plan.save();

  res.json({
    success: true,
    message: `Plan ${plan.active ? "activated" : "deactivated"}`,
  });
};

/**
 * SYSTEM: Auto-lock plan after first investment
 */
export const lockPlanIfNeeded = async (planId) => {
  const count = await Investment.countDocuments({ planId });
  if (count > 0) {
    await Plan.findByIdAndUpdate(planId, { locked: true });
  }
};
