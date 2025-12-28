import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const usePlanStore = create((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("/plan/list-plan");
      set({ plans: res.data.data, loading: false });

      return res.data.data;
    } catch (error) {
      set({ loading: false });
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An error occurred when fetching plan";
      toast.error(msg);
      throw error;
    }
  },

  fetchSinglePlan: async (id) => {
    const res = await axios.get(`/plan/get-single-plan/${id}`);
    return res.data.data;
  },
}));
