import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TransferPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/accounts").then(r => r.json()).then(setAccounts);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("http://localhost:3001/transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromId: Number(fromId), toId: Number(toId), amount }),
    });
    const data = await res.json();
    if (data.error) return setError(data.error);
    navigate("/success", { state: data });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Bank Transfer</h1>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {accounts.map(a => (
            <div key={a.id} className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">{a.name}</p>
              <p className="text-xl font-semibold text-blue-700">£{Number(a.balance).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select className="w-full border rounded-lg p-2" value={fromId} onChange={e => setFromId(e.target.value)} required>
            <option value="">From account</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <select className="w-full border rounded-lg p-2" value={toId} onChange={e => setToId(e.target.value)} required>
            <option value="">To account</option>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <input
            type="number" min="0.01" step="0.01" placeholder="Amount (£)"
            className="w-full border rounded-lg p-2"
            value={amount} onChange={e => setAmount(e.target.value)} required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
}