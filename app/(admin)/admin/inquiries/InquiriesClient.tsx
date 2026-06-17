"use client";

import { useState, useTransition } from "react";
import { MessageSquare } from "lucide-react";
import { updateInquiryStatus } from "./actions";

interface Inquiry {
  id: string; name: string; email: string; phone: string | null;
  program_interest: string | null; message: string | null;
  status: string; created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  new:       "bg-red-100 text-red-600",
  contacted: "bg-blue-100 text-blue-700",
  closed:    "bg-brand-gray-200 text-brand-gray-600",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });

export default function InquiriesClient({ initialInquiries }: { initialInquiries: Inquiry[] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [pending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const newCount = inquiries.filter(i => i.status === "new").length;

  function handleAction(id: string, status: "contacted" | "closed") {
    setLoadingId(id);
    startTransition(async () => {
      try {
        await updateInquiryStatus(id, status);
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      } catch (e) {
        alert(e instanceof Error ? e.message : "Action failed.");
      } finally {
        setLoadingId(null);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-black font-display uppercase">Inquiries</h1>
          <p className="text-brand-gray-400 text-sm mt-1">
            {inquiries.length} total{newCount > 0 ? ` · ${newCount} new` : ""}
          </p>
        </div>
        {newCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {newCount} unread
          </span>
        )}
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-brand-gray-200 py-20 text-center">
          <MessageSquare size={32} className="text-brand-gray-200 mx-auto mb-3" />
          <p className="text-brand-gray-400 text-sm">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => {
            const isLoading = loadingId === inq.id && pending;
            return (
              <div key={inq.id} className="bg-white rounded-2xl border border-brand-gray-200 p-5 hover:border-brand-orange transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-brand-black">{inq.name}</p>
                    <div className="flex flex-wrap gap-3 mt-0.5">
                      <a href={`mailto:${inq.email}`} className="text-xs text-brand-orange hover:underline">{inq.email}</a>
                      {inq.phone && <span className="text-xs text-brand-gray-400">{inq.phone}</span>}
                      {inq.program_interest && (
                        <span className="text-xs bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full">{inq.program_interest}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-brand-gray-400">{fmt(inq.created_at)}</span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[inq.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {inq.status}
                    </span>
                  </div>
                </div>
                {inq.message && (
                  <p className="mt-3 text-sm text-brand-gray-600 border-t border-brand-gray-200 pt-3 leading-relaxed">
                    {inq.message}
                  </p>
                )}
                <div className="flex gap-3 mt-3 pt-3 border-t border-brand-gray-200">
                  {inq.status === "new" && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleAction(inq.id, "contacted")}
                      className="text-xs text-blue-600 hover:underline font-medium disabled:opacity-40"
                    >
                      {isLoading ? "…" : "Mark Contacted"}
                    </button>
                  )}
                  {inq.status !== "closed" && (
                    <button
                      disabled={isLoading}
                      onClick={() => handleAction(inq.id, "closed")}
                      className="text-xs text-brand-gray-400 hover:underline font-medium disabled:opacity-40"
                    >
                      {isLoading ? "…" : "Close"}
                    </button>
                  )}
                  <a href={`mailto:${inq.email}`} className="text-xs text-brand-orange hover:underline font-medium ml-auto">
                    Reply by Email →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
