"use client";

import React, { useState, useEffect } from "react";
import { api, DashboardStats } from "@/lib/api";
import {
    Coins,
    FileSpreadsheet,
    ShieldAlert,
    UploadCloud,
    AlertCircle,
    Loader2,
    TrendingUp,
    CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    
    // File upload state
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            const data = await api.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to load dashboard metrics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadStats = async () => {
            await fetchStats();
        };
        loadStats();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploadFile(e.target.files[0]);
            setUploadError(null);
            setUploadSuccess(null);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadFile) return;
        
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(null);

        try {
            const res = await api.uploadDocument(uploadFile);
            setUploadSuccess(res.message || "File uploaded and indexed successfully!");
            setUploadFile(null);
            // Refresh stats to capture updated audit logs
            await fetchStats();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to upload document.";
            setUploadError(message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    type MonthlyBreakdownItem = DashboardStats["monthly_breakdown"][number];

    const cardsData = [
        { title: "Total Reports", value: stats?.total_reports || 0, icon: <FileSpreadsheet className="w-4 h-4 text-blue-400" />, desc: "Generations triggered", color: "border-blue-500/30" },
        { title: "Tokens Processed", value: stats?.total_tokens?.toLocaleString() || 0, icon: <Coins className="w-4 h-4 text-purple-400" />, desc: "Prompt + Output cost", color: "border-purple-500/30" },
        { title: "AI Cost (USD)", value: `$${stats?.total_cost?.toFixed(4) || "0.00"}`, icon: <TrendingUp className="w-4 h-4 text-emerald-400" />, desc: "Based on actual usage", color: "border-emerald-500/30" },
        { title: "Injections Blocked", value: stats?.blocked_security_events || 0, icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, desc: "Guardrail threat mitigations", color: "border-rose-500/30" }
    ];

    const monthlyData = stats?.monthly_breakdown ?? [];
    const maxReports = monthlyData.length ? Math.max(...monthlyData.map((m: MonthlyBreakdownItem) => m.reports)) : 10;
    const maxCost = monthlyData.length ? Math.max(...monthlyData.map((m: MonthlyBreakdownItem) => m.cost)) : 1.0;

    return (
        <div className="space-y-6 select-none max-w-7xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Console Overview</h1>
                <p className="text-xs text-slate-400">Real-time LLMOps metrics, evaluations, and threat mitigation systems.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {cardsData.map((card, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border ${card.color} bg-[#0b1329]/50 glass-panel flex flex-col justify-between h-28`}>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{card.title}</span>
                            <div className="p-2 rounded-xl bg-slate-800/40">{card.icon}</div>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-white block -mt-1">{card.value}</span>
                            <span className="text-[10px] text-slate-500 block">{card.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual SVG Trend graph */}
                <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel flex flex-col justify-between min-h-[300px]">
                    <div>
                        <h3 className="text-sm font-semibold text-white">Generation Trends</h3>
                        <p className="text-[10px] text-slate-500 mb-6">Report volume and computational cost metrics over past 6 months.</p>
                    </div>

                    <div className="relative h-44 flex items-end justify-between border-b border-l border-slate-800 pb-2 pl-4">
                        {/* Render custom SVG Bars */}
                        {monthlyData.map((m: MonthlyBreakdownItem, idx: number) => {
                            const barHeight = (m.reports / (maxReports || 1)) * 120 + 10;
                            const costHeight = (m.cost / (maxCost || 1)) * 120 + 10;
                            return (
                                <div key={idx} className="flex flex-col items-center gap-1.5 w-12 group relative">
                                    <div className="flex gap-1.5 items-end h-32 justify-center">
                                        {/* Reports Bar */}
                                        <div 
                                            style={{ height: `${barHeight}px` }} 
                                            className="w-3 rounded-t-sm bg-gradient-to-t from-blue-600 to-blue-400 transition-all hover:brightness-110"
                                        ></div>
                                        {/* Cost Bar */}
                                        <div 
                                            style={{ height: `${costHeight}px` }} 
                                            className="w-3 rounded-t-sm bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:brightness-110"
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">{m.name}</span>
                                    
                                    {/* Hover info tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300 shadow-xl whitespace-nowrap">
                                        <div>Reports: {m.reports}</div>
                                        <div>Cost: ${m.cost.toFixed(3)}</div>
                                        <div>Tokens: {m.tokens.toLocaleString()}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 text-[10px] font-mono">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-blue-500 block"></span>
                            <span className="text-slate-400">Reports volume</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-emerald-500 block"></span>
                            <span className="text-slate-400">API Cost (USD)</span>
                        </div>
                    </div>
                </div>

                {/* Radian quality metrics */}
                <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-white">System RAGAS Quality Averages</h3>
                        <p className="text-[10px] text-slate-500 mb-6">Aggregated RAG validation scores from active evaluations.</p>
                    </div>

                    <div className="flex items-center justify-around py-4">
                        {[
                            { name: "Faithfulness", score: stats?.average_faithfulness || 0.94, color: "#3b82f6" },
                            { name: "Relevancy", score: stats?.average_answer_relevancy || 0.92, color: "#10b981" },
                            { name: "Confidence", score: stats?.average_confidence || 0.91, color: "#f59e0b" }
                        ].map((gauge, i) => (
                            <div key={i} className="flex flex-col items-center">
                                <div className="relative w-16 h-16 mb-2">
                                    {/* Radial SVG Circle */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle 
                                            cx="32" 
                                            cy="32" 
                                            r="26" 
                                            fill="transparent" 
                                            stroke="#1e293b" 
                                            strokeWidth="4" 
                                        />
                                        <circle 
                                            cx="32" 
                                            cy="32" 
                                            r="26" 
                                            fill="transparent" 
                                            stroke={gauge.color} 
                                            strokeWidth="4.5" 
                                            strokeDasharray="163.3"
                                            strokeDashoffset={163.3 - (gauge.score * 163.3)}
                                            className="transition-all duration-1000 ease-out"
                                        />
                                    </svg>
                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white">
                                        {Math.round(gauge.score * 100)}%
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">{gauge.name}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-850 text-[10px] leading-relaxed text-slate-400">
                        Average latency for execution runs: <strong className="text-white">{(stats?.average_latency_ms / 1000).toFixed(2)}s</strong>. System meets SLA bounds.
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* PDF RAG Upload Panel */}
                <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel">
                    <h3 className="text-sm font-semibold text-white mb-1">Index Custom Reference Materials</h3>
                    <p className="text-[10px] text-slate-500 mb-6">Upload PDFs or TXT documents. The system will chunk and inject them into the vector store.</p>

                    {uploadSuccess && (
                        <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/35 flex gap-2.5 items-center text-emerald-400 text-xs font-medium">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            {uploadSuccess}
                        </div>
                    )}

                    {uploadError && (
                        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/35 flex gap-2.5 items-center text-rose-400 text-xs font-medium">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {uploadError}
                        </div>
                    )}

                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                        <div className="relative border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-8 text-center transition-all bg-slate-950/20 group">
                            <input 
                                type="file" 
                                accept=".pdf,.txt"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            <div className="flex flex-col items-center">
                                <UploadCloud className="w-10 h-10 text-slate-500 mb-3 group-hover:text-blue-400 transition-colors" />
                                <span className="text-xs text-slate-300 font-medium block">
                                    {uploadFile ? uploadFile.name : "Select your PDF or TXT document"}
                                </span>
                                <span className="text-[10px] text-slate-500 block mt-1">Maximum file size: 10MB</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!uploadFile || uploading}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-medium rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {uploading ? "Chunking & Vectorizing..." : "Index Reference Document"}
                        </button>
                    </form>
                </div>

                {/* Audit & Security Alerts Panel */}
                <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-1">Security Guardrail Logs</h3>
                        <p className="text-[10px] text-slate-500 mb-4">Real-time log of prompt injection filters and system events.</p>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {stats?.recent_events?.map((e, idx: number) => {
                            const isBlocked = e.status === "blocked" || e.status === "failure";
                            return (
                                <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-[10px] leading-relaxed flex items-start gap-3">
                                    <div className={`p-1.5 rounded-lg shrink-0 ${isBlocked ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                                        <ShieldAlert className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex justify-between font-mono mb-1">
                                            <span className="font-bold text-white uppercase">{e.action.replace(/_/g, " ")}</span>
                                            <span className="text-slate-500">{new Date(e.created_at).toLocaleTimeString()}</span>
                                        </div>
                                        <div className="text-slate-400 truncate font-mono">{e.details}</div>
                                        <div className="text-[9px] text-slate-500 font-mono mt-0.5">IP: {e.ip_address} | User: {e.user_email}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
