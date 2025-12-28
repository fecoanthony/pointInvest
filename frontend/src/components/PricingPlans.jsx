import React, { useEffect, useState } from "react";
import PlanCard from "./PlanCard";
import LoadingSpinner from "../components/LoadingSpinner";
import InvestModal from "../components/InvestModal";
import { usePlanStore } from "../stores/usePlanStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";

const PricingPlans = () => {
  // Using selectors is a bit safer with Zustand
  const plans = usePlanStore((s) => s.plans);
  const fetchPlans = usePlanStore((s) => s.fetchPlans);
  const loading = usePlanStore((s) => s.loading);

  const [selectedPlan, setSelectedPlan] = useState(null);

  const navigate = useNavigate();
  const { user } = useUserStore();

  const handleInvestClick = (plan) => {
    if (!user) {
      toast.error("Please log in to continue investing");
      navigate("/login", {
        state: { redirectTo: "/#pricing" },
      });
      return;
    }

    setSelectedPlan(plan);
  };

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <section className="py-24 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-yellow-400 uppercase tracking-widest text-sm">
              Pricing Plan
            </span>
            <h2 className="text-4xl font-bold text-white mt-2">
              Best Investment Packages
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
              Select from our trusted investment options to build lasting
              wealth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(plans || []).map((plan, index) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                index={index}
                onInvest={handleInvestClick} // pass the setter directly
              />
            ))}
          </div>
        </div>
      </section>

      <InvestModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
};

export default PricingPlans;
