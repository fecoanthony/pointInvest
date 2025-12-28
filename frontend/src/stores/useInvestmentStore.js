// src/stores/useInvestmentStore.js
import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-hot-toast";

export const useInvestmentStore = create((set) => ({
  loading: false,

  investInPlan: async ({ planId, amountCents }) => {
    try {
      set({ loading: true });
      // Backend: POST /api/user/create-investment
      const res = await api.post("/user/create-investment", {
        planId,
        amountCents,
      });
      toast.success("Investment created successfully");
      return res.data.data;
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || "Investment failed";
      toast.error(msg);
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
