import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: players } = await admin.from("players").select("id").eq("user_id", user.id);
  const playerIds = (players ?? []).map((p: any) => p.id);

  let bills: any[] = [];
  let payments: any[] = [];

  if (playerIds.length > 0) {
    const [b, p] = await Promise.all([
      admin.from("player_bills").select("*").in("player_id", playerIds).order("due_date", { ascending: false }),
      admin.from("payments").select("*").in("player_id", playerIds).order("payment_date", { ascending: false }),
    ]);
    bills = b.data ?? [];
    payments = p.data ?? [];
  }

  const totalOwing = bills.filter(b => b.status === "pending" || b.status === "overdue")
    .reduce((s, b) => s + Number(b.total_cad), 0);
  const totalPaid = payments.filter(p => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount_cad), 0);

  const STATUS_ICON: Record<string, React.ReactNode> = {
    paid:    <CheckCircle size={14} className="text-green-500" />,
    pending: <Clock size={14} className="text-yellow-500" />,
    overdue: <AlertCircle size={14} className="text-red-500" />,
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-xl font-bold text-gray-900">Billing</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <DollarSign size={18} className="text-red-500 mb-2" />
          <p className="text-2xl font-black text-gray-900">${totalOwing.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Outstanding balance</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <CheckCircle size={18} className="text-green-500 mb-2" />
          <p className="text-2xl font-black text-gray-900">${totalPaid.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total paid</p>
        </div>
      </div>

      {bills.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Bills</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {bills.map((b: any) => (
              <div key={b.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">${Number(b.total_cad).toFixed(2)} CAD</p>
                  <p className="text-xs text-gray-500 mt-0.5">Due {b.due_date}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  {STATUS_ICON[b.status] ?? null}
                  <span className={b.status === "paid" ? "text-green-600" : b.status === "overdue" ? "text-red-600" : "text-yellow-600"}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 text-sm">Payment History</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {payments.map((p: any) => (
              <div key={p.id} className="px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">${Number(p.amount_cad).toFixed(2)} CAD</p>
                  <p className="text-xs text-gray-500 mt-0.5">{p.payment_date} · {p.payment_method}</p>
                </div>
                <CheckCircle size={14} className="text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {bills.length === 0 && payments.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <DollarSign size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No billing records yet.</p>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        For payment inquiries contact the academy at{" "}
        <a href="mailto:info@shakhtarcalgary.ca" className="text-brand-orange hover:underline">info@shakhtarcalgary.ca</a>
      </p>
    </div>
  );
}
