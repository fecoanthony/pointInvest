import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/userApi";
import api from "../../lib/axios";
import toast from "react-hot-toast";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refLink, setRefLink] = useState("");

  useEffect(() => {
    fetchProfile();
    getCurrentUser().then((res) => setRefLink(res.data.user.referralUrl));
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profile");
      setUser(data.user);
      setWallet(data.wallet);
      console.log(data);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl md:text-2xl font-bold">My Profile</h1>

      {/* Account Info */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <p className="text-sm text-gray-500">Full Name</p>
        <p className="font-medium">{user?.name}</p>

        <p className="text-sm text-gray-500 mt-3">Email</p>
        <p className="font-medium">{user?.email}</p>
      </div>

      {/* Wallet */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold">Wallet</h2>

        <p className="text-sm text-gray-500">Available Balance</p>
        <p className="text-lg font-bold">
          ${(wallet?.mainBalanceCents || 0) / 100}
        </p>
      </div>

      {/* Referral */}
      <div className="bg-white rounded-xl shadow p-4 space-y-2">
        <h2 className="font-semibold">Referral</h2>

        <p className="text-sm text-gray-500">Referral Link</p>
        <p className="font-mono bg-gray-100 inline-block px-3 py-1 rounded">
          {refLink || "N/A"}
        </p>
      </div>
    </div>
  );
}
