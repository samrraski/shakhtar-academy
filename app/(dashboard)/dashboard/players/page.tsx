import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { User, CheckCircle, XCircle, Calendar, DollarSign } from "lucide-react";

export default async function DashboardPlayersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("players")
    .select("*, programs(name,price_cad,gst_rate,schedule_days)")
    .eq("user_id", user.id);

  const players = (data ?? []) as any[];

  if (players.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-gray-400" />
          </div>
          <h2 className="font-bold text-gray-900 mb-1">No player linked yet</h2>
          <p className="text-sm text-gray-500">Your account hasn&apos;t been linked to a player profile. Contact the academy to get set up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-bold text-gray-900">My Player</h1>
      {players.map(player => {
        const total = player.programs?.price_cad
          ? (Number(player.programs.price_cad) * (1 + Number(player.programs.gst_rate ?? 0.05))).toFixed(2)
          : null;
        return (
          <div key={player.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {player.profile_photo_url
                  ? <img src={player.profile_photo_url} alt="Profile" className="w-full h-full object-cover" />
                  : <User size={28} className="text-gray-400" />}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{player.first_name} {player.last_name}</h2>
                <div className="mt-1">
                  {player.is_active
                    ? <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5"><CheckCircle size={11}/> Active</span>
                    : <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5"><XCircle size={11}/> Inactive</span>}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1"><Calendar size={13}/><span>Program</span></div>
                <p className="font-semibold text-gray-900">{player.programs?.name ?? "—"}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1"><Calendar size={13}/><span>Schedule</span></div>
                <p className="font-semibold text-gray-900">{player.programs?.schedule_days?.join(", ") ?? "—"}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1"><DollarSign size={13}/><span>Monthly fee</span></div>
                <p className="font-semibold text-gray-900">{total ? `$${total} CAD` : "—"}{total && <span className="text-xs text-gray-400 ml-1">incl. GST</span>}</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-gray-500 mb-1"><Calendar size={13}/><span>Date of birth</span></div>
                <p className="font-semibold text-gray-900">
                  {new Date(player.date_of_birth + "T00:00:00").toLocaleDateString("en-CA", { year:"numeric", month:"short", day:"numeric" })}
                </p>
              </div>
            </div>
            {player.notes && <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-600">{player.notes}</div>}
          </div>
        );
      })}
    </div>
  );
}
