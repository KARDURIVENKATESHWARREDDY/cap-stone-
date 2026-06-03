"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, ReportSummary } from "@/lib/api";
import {
    FileText,
    Trash2,
    Eye,
    Plus,
    Loader2,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react";

export default function ReportsHistoryPage() {
    const router = useRouter();
    const [reports, setReports] = useState<ReportSummary[]>([]);
    const [loading, setLoading] = useState(true);

    const loadReports = async () => {
        try {
            const data = await api.listReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to load reports", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const load = async () => {
            await loadReports();
        };
        load();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this report? This will remove all associated database models and generated files.")) return;
        
        try {
            await api.deleteReport(id);
            await loadReports();
        } catch {
            alert("Failed to delete report.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                );
            case "failed":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-[10px] font-mono text-rose-400 font-bold uppercase">
                        <AlertTriangle className="w-3 h-3" /> Failed
                    </span>
                );
            case "pending":
            case "planning":
            case "researching":
            case "writing":
            case "reviewing":
            case "verifying":
            case "exporting":
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono text-blue-400 font-bold uppercase animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" /> {status}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-750 text-[10px] font-mono text-slate-400 font-bold uppercase">
                        Unknown
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 select-none max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Reports History</h1>
                    <p className="text-xs text-slate-400">View previous runs, access PDF downloads, and review generation metrics.</p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/reports/new")}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-blue-600/15 flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" /> Request New Report
                </button>
            </div>

            {/* Content list */}
            {reports.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border border-slate-800/80 bg-[#0b1329]/50 glass-panel">
                    <FileText className="w-12 h-12 text-slate-650 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-white mb-1">No reports generated yet</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">Create your first research report using our multi-agent autonomous orchestrator.</p>
                    <button
                        onClick={() => router.push("/dashboard/reports/new")}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all"
                    >
                        Trigger first run
                    </button>
                </div>
            ) : (
                <div className="rounded-2xl border border-slate-800/80 bg-[#0b1329]/50 glass-panel overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-[#0b1329]/80 border-b border-slate-850 text-slate-450 uppercase font-mono text-[9px] tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Title & Query</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Faithfulness</th>
                                <th className="p-4">Estimated Cost</th>
                                <th className="p-4">Date Created</th>
                                <th className="p-4 pr-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                            {reports.map((report) => (
                                <tr 
                                    key={report.id} 
                                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                                    className="hover:bg-slate-900/30 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4 pl-6 max-w-xs">
                                        <span className="font-semibold text-white group-hover:text-blue-400 transition-colors block truncate">{report.title}</span>
                                        <span className="text-[10px] text-slate-500 block truncate font-mono mt-0.5">{report.topic}</span>
                                    </td>
                                    <td className="p-4">{getStatusBadge(report.status)}</td>
                                    <td className="p-4 font-mono">
                                        {report.evaluation ? (
                                            <span className="font-bold text-slate-200">
                                                {Math.round(report.evaluation.faithfulness * 100)}%
                                            </span>
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 font-mono text-emerald-450 font-medium">
                                        {report.evaluation ? (
                                            `$${report.evaluation.estimated_cost.toFixed(4)}`
                                        ) : (
                                            <span className="text-slate-500">-</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-slate-400 font-mono">
                                        {new Date(report.created_at).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric"
                                        })}
                                    </td>
                                    <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                                                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all"
                                                title="View details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => handleDelete(report.id, e)}
                                                className="p-2 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all"
                                                title="Delete report"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
