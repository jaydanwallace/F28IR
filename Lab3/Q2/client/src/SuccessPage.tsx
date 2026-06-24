import { useLocation, useNavigate } from "react-router-dom";

export default function SuccessPage() {
  const { state } = useLocation() as any;
  const navigate = useNavigate();

  if (!state) { navigate("/"); return null; }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Transfer was successful</h1>
        <p className="text-gray-500 mb-8">Updated balances:</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {[state.from, state.to].map((a: any) => (
            <div key={a.id} className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-500">{a.name}</p>
              <p className="text-xl font-semibold text-green-700">£{Number(a.balance).toFixed(2)}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/")} className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold">
          Make another transfer
        </button>
      </div>
    </div>
  );
}