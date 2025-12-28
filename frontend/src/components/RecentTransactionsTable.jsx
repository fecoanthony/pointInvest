const RecentTransactionsTable = () => {
  const transactions = []; // later from API

  return (
    <div className="bg-slate-900 border border-slate-800 rounded">
      <table className="w-full text-sm">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-3 text-left">No</th>
            <th>Type</th>
            <th>TxID</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-slate-400">
                No Data Found
              </td>
            </tr>
          ) : (
            transactions.map((tx, i) => (
              <tr key={tx._id}>
                <td>{i + 1}</td>
                <td>{tx.type}</td>
                <td>{tx._id}</td>
                <td>${(tx.amountCents / 100).toFixed(2)}</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentTransactionsTable;
