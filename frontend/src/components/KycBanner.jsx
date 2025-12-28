const KycBanner = () => {
  const kycPending = true; // later from backend

  if (!kycPending) return null;

  return (
    <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-300 p-4 rounded flex justify-between items-center">
      <span>You have information to submit for KYC verification.</span>
      <button className="bg-yellow-500 text-black px-4 py-1 rounded">
        Submit
      </button>
    </div>
  );
};

export default KycBanner;
