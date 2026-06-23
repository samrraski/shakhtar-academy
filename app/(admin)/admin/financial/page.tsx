"use client";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, TrendingDown, Users } from "lucide-react";

interface FinancialData {
  bills: any[]; payments: any[]; payroll: any[]; expenses: any[];
}

export default function FinancialPage() {
  const [data, setData] = useState<FinancialData>({ bills: [], payments: [], payroll: [], expenses: [] });
  const [tab, setTab] = useState<"bills" | "payments" | "payroll" | "expenses">("bills");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/financial").then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  const totalReceived = data.payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_cad), 0);
  const totalPending = data.bills.filter(b => b.status === "pending").reduce((s, b) => s + Number(b.total_cad), 0);
  const totalExpenses = data.expenses.reduce((s, e) => s + Number(e.amount_cad), 0);

  const TABS = [
    { key: "bills" as const, label: "Bills" },
    { key: "payments" as const, label: "Payments" },
    { key: "payroll" as const, label: "Payroll" },
    { key: "expenses" as const, label: "Expenses" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Financial</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Received (paid)", value: `$${totalReceived.toFixed(2)}`, icon: TrendingUp, color: "text-green-600" },
          { label: "Pending bills", value: `$${totalPending.toFixed(2)}`, icon: DollarSign, color: "text-yellow-600" },
          { label: "Total expenses", value: `$${totalExpenses.toFixed(2)}`, icon: TrendingDown, color: "text-red-500" },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <card.icon size={20} className={`${card.color} mb-2`} />
            <p className="text-2xl font-black text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? "border-brand-orange text-brand-orange" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label} ({data[t.key].length})
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-gray-400 text-sm">Loading…</div>
        ) : data[tab].length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No {tab} yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {tab === "bills" && ["Player","Amount","GST","Total","Due","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
                {tab === "payments" && ["Player","Amount","Method","Date","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
                {tab === "payroll" && ["Worker","Amount","Period","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
                {tab === "expenses" && ["Category","Vendor","Amount","Date"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tab === "bills" && data.bills.map((b: any) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{b.players?.first_name} {b.players?.last_name}</td>
                  <td className="px-4 py-3 text-gray-600">${Number(b.amount_cad).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">${Number(b.gst_amount).toFixed(2)}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(b.total_cad).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{b.due_date}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {tab === "payments" && data.payments.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{p.players?.first_name} {p.players?.last_name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(p.amount_cad).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.payment_method}</td>
                  <td className="px-4 py-3 text-gray-600">{p.payment_date}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
              {tab === "payroll" && data.payroll.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{p.workers?.first_name} {p.workers?.last_name}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(p.amount_cad).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{p.pay_period_start} – {p.pay_period_end}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
              {tab === "expenses" && data.expenses.map((e: any) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{e.category}</td>
                  <td className="px-4 py-3 text-gray-600">{e.vendor ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${Number(e.amount_cad).toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-600">{e.expense_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls = status === "paid" ? "bg-green-50 text-green-700" : status === "overdue" ? "bg-red-50 text-red-600" : "bg-yellow-50 text-yellow-700";
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}
