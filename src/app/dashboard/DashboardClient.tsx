"use client";

import { useEffect, useMemo, useState } from "react";
import { STATUSES, type Lead, type LeadStatus } from "@/lib/airtable";
import { SCENARIOS } from "@/lib/scenarios";

type SortDir = "asc" | "desc";

export default function DashboardClient() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "Tous">("Tous");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selected, setSelected] = useState<Lead | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/dashboard/leads");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Erreur");
      setLeads(data.leads);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function changeStatus(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    if (selected?.id === id) setSelected({ ...selected, status });
    try {
      const res = await fetch("/api/dashboard/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
    } catch {
      load();
    }
  }

  const filtered = useMemo(() => {
    let result = leads;
    if (statusFilter !== "Tous") {
      result = result.filter((l) => l.status === statusFilter);
    }
    return [...result].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortDir === "desc" ? db - da : da - db;
    });
  }, [leads, statusFilter, sortDir]);

  const counts = useMemo(() => {
    return {
      total: leads.length,
      aContacter: leads.filter((l) => l.status === "À contacter").length,
      enCours: leads.filter((l) => l.status === "En cours").length,
    };
  }, [leads]);

  return (
    <main className="flex-1 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <div className="grid grid-cols-3 gap-4">
          <Counter label="Total leads" value={counts.total} />
          <Counter label="À contacter" value={counts.aContacter} />
          <Counter label="En cours" value={counts.enCours} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "Tous")}
            className="bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-white/50"
          >
            <option value="Tous">Tous les statuts</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortDir((d) => (d === "desc" ? "asc" : "desc"))}
            className="border border-white/20 rounded-lg px-3 py-2 text-sm hover:border-white/50 transition"
          >
            Date {sortDir === "desc" ? "↓ récent" : "↑ ancien"}
          </button>

          <button
            onClick={load}
            className="border border-white/20 rounded-lg px-3 py-2 text-sm hover:border-white/50 transition"
          >
            Rafraîchir
          </button>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="border border-white/10 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-white/40">
                <th className="px-4 py-3 font-normal">Prénom</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Mobile</th>
                <th className="px-4 py-3 font-normal">Date</th>
                <th className="px-4 py-3 font-normal">Statut</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                    Chargement...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                    Aucun lead.
                  </td>
                </tr>
              )}
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelected(lead)}
                  className="border-b border-white/5 hover:bg-white/5 cursor-pointer transition"
                >
                  <td className="px-4 py-3">{lead.firstName}</td>
                  <td className="px-4 py-3 text-white/70">{lead.email}</td>
                  <td className="px-4 py-3">
                    {lead.mobile ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigator.clipboard.writeText(lead.mobile);
                        }}
                        className="text-white/70 hover:text-white underline decoration-white/20 underline-offset-4"
                        title="Copier le numéro"
                      >
                        {lead.mobile}
                      </button>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-white/50">{formatDate(lead.date)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={lead.status}
                      onChange={(e) => changeStatus(lead.id, e.target.value as LeadStatus)}
                      className="bg-black border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-white/50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <LeadModal lead={selected} onClose={() => setSelected(null)} onChangeStatus={changeStatus} />
      )}
    </main>
  );
}

function Counter({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-white/10 rounded-lg px-5 py-4">
      <p className="text-xs text-white/40 mb-1">{label}</p>
      <p className="text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

function LeadModal({
  lead,
  onClose,
  onChangeStatus,
}: {
  lead: Lead;
  onClose: () => void;
  onChangeStatus: (id: string, status: LeadStatus) => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/80 flex items-center justify-center px-6 z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-black border border-white/15 rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">{lead.firstName}</h2>
            <p className="text-white/50 text-sm">{lead.email}</p>
            {lead.mobile && <p className="text-white/50 text-sm">{lead.mobile}</p>}
            <p className="text-white/30 text-xs mt-1">{formatDate(lead.date)}</p>
          </div>
          <select
            value={lead.status}
            onChange={(e) => onChangeStatus(lead.id, e.target.value as LeadStatus)}
            className="bg-black border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-white/50"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm uppercase tracking-wide text-white/40">Réponses</h3>
          {SCENARIOS.map((scenario, i) => (
            <div key={i} className="space-y-1">
              <p className="text-sm text-white/40">{scenario}</p>
              <p className="text-white/80">{lead.answers[i] || "—"}</p>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-white/10 pt-6">
          <h3 className="text-sm uppercase tracking-wide text-white/40">Diagnostic</h3>
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{lead.diagnosis}</p>
        </div>

        <button
          onClick={onClose}
          className="border border-white/20 rounded-lg px-4 py-2 text-sm hover:border-white/50 transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
