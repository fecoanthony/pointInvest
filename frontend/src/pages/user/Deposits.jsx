import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import api from "../../lib/axios.js";
import { Copy, CheckCircle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const CRYPTO_ADDRESS = "0x9Bf3A2D9E5C7B1F2A4E8D6C0A9B7F1D3E5C7B9A2";

export default function Deposits() {
  const [usdAmount, setUsdAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [btcPrice, setBtcPrice] = useState(null); // 1 BTC in USD
  const [priceLoading, setPriceLoading] = useState(false);

  /* ---------------- Fetch BTC price (USD) once ---------------- */
  useEffect(() => {
    const fetchBtcPrice = async () => {
      try {
        setPriceLoading(true);
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
        );
        const data = await res.json();
        setBtcPrice(data.bitcoin.usd); // 1 BTC = X USD
      } catch (err) {
        console.error("Failed to fetch BTC price:", err);
        toast.error("Failed to fetch BTC price");
      } finally {
        setPriceLoading(false);
      }
    };

    fetchBtcPrice();
  }, []);

  /* ---------------- Derived BTC amount from USD ---------------- */
  const btcAmount = useMemo(() => {
    const n = Number(usdAmount);
    if (!btcPrice || !n || n <= 0) return 0;
    return n / btcPrice; // BTC = USD / (USD per BTC)
  }, [usdAmount, btcPrice]);

  /* ---------------- QR value (bitcoin URI) ---------------- */
  const qrValue = useMemo(() => {
    const n = Number(usdAmount);
    if (!btcPrice || !n || n <= 0) {
      // No valid amount → just encode address
      return CRYPTO_ADDRESS;
      // or `bitcoin:${CRYPTO_ADDRESS}` if you prefer the URI scheme
    }

    const btc = (n / btcPrice).toFixed(8);
    // Many wallets understand this format:
    return `bitcoin:${CRYPTO_ADDRESS}?amount=${btc}`;
  }, [usdAmount, btcPrice]);

  /* ---------------- Copy address ---------------- */
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(CRYPTO_ADDRESS);
      setCopied(true);
      toast.success("Address copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  /* ---------------- Submit deposit ---------------- */
  const submitDeposit = async () => {
    const n = Number(usdAmount);

    if (!n || n <= 0) {
      return toast.error("Enter a valid amount");
    }

    if (!btcPrice) {
      return toast.error("BTC price not loaded yet");
    }

    try {
      setLoading(true);

      await api.post("/user/transactions/crypto-deposit", {
        amount: n, // adjust to what your backend expects
        // or: amountUsd: n, amountBtc: btcAmount
      });

      toast.success("Deposit request submitted");
      setUsdAmount("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Crypto Deposit</h1>

      {/* Wallet Address + QR */}
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600 block mb-2">
            Deposit to this address
          </label>

          <div className="flex items-center gap-2">
            <input
              value={CRYPTO_ADDRESS}
              readOnly
              className="flex-1 border border-blue-400 rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-950"
            />

            <button
              onClick={copyAddress}
              className="bg-gray-900 text-white p-2 rounded-lg"
            >
              {copied ? (
                <CheckCircle size={18} className="text-green-400" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Send only supported crypto (BTC) to this address. Deposits require
            admin approval.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm text-gray-600 mb-2">Or scan QR code</p>
          <div className="bg-white p-2 rounded-lg border border-gray-200">
            <QRCodeCanvas
              value={qrValue}
              size={140}
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-1 text-center">
            Scan with your wallet app. If you entered an amount, it may be
            pre‑filled.
          </p>
        </div>
      </div>

      {/* Deposit Amount */}
      <div className="bg-white rounded-xl shadow p-4 max-w-md">
        <label className="block text-sm text-gray-600 mb-1">Amount (USD)</label>

        <input
          type="number"
          value={usdAmount}
          onChange={(e) => setUsdAmount(e.target.value)}
          className="w-full border border-blue-400 rounded-lg px-3 py-2 mb-3 "
          placeholder="Enter amount you want to deposit in USD"
        />

        {/* BTC equivalent display */}
        <div className="text-sm text-gray-600 mb-4">
          {priceLoading && <span>Loading BTC price...</span>}

          {!priceLoading && btcPrice && Number(usdAmount) > 0 && (
            <>
              <div>
                ≈{" "}
                <span className="font-semibold">
                  {btcAmount.toFixed(8)} BTC
                </span>
              </div>
              <div className="text-xs text-gray-500">
                1 BTC ≈ $
                {btcPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </div>
            </>
          )}

          {!priceLoading && !btcPrice && (
            <span className="text-red-500 text-xs">BTC price unavailable</span>
          )}
        </div>

        <button
          onClick={submitDeposit}
          disabled={loading || !btcPrice}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "I Have Sent the Funds"}
        </button>
      </div>
    </div>
  );
}
