"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, ReportDetail } from "@/lib/api";
import {
    Download,
    ArrowLeft,
    Loader2,
    ExternalLink,
} from "lucide-react";

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [report, setReport] = useState<ReportDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await api.getReport(id);
                setReport(data);
            } catch (error) {
                console.error("Failed to load report", error);
                router.push("/dashboard/reports");
            } finally {
                setLoading(false);
            }
        };

        void loadReport();
    }, [id, router]);

    if (loading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!report) {
        return (
            <div className="p-6 text-center text-slate-400">
                Report not found.
            </div>
        );
    }

    // Helper to render markdown headings simply
    const renderMarkdownContent = (text: string) => {
        if (!text) return null;
        
        const lines = text.split("\n");
        return lines.map((line, idx) => {
            const lineStrip = line.trim();
            if (!lineStrip) return <div key={idx} className="h-3" />;

            // Headings
            if (lineStrip.startsWith("# ")) {
                return <h1 key={idx} className="text-2xl font-bold text-white border-b border-slate-800 pb-3 mt-6 mb-4">{lineStrip.slice(2)}</h1>;
            }
            if (lineStrip.startsWith("## ")) {
                return <h2 key={idx} className="text-xl font-bold text-slate-100 mt-6 mb-3">{lineStrip.slice(3)}</h2>;
            }
            if (lineStrip.startsWith("### ")) {
                return <h3 key={idx} className="text-md font-semibold text-blue-400 mt-4 mb-2">{lineStrip.slice(4)}</h3>;
            }

            // Separators
            if (lineStrip === "---") {
                return <hr key={idx} className="border-slate-800 my-6" />;
            }

            // Bullet lists
            if (lineStrip.startsWith("* ") || lineStrip.startsWith("- ")) {
                return (
                    <li key={idx} className="ml-5 list-disc text-slate-300 text-xs leading-relaxed mb-1">
                        {lineStrip.slice(2)}
                    </li>
                );
            }

            // Bold markers cleanup
            let cleanLine: React.ReactNode = lineStrip;
            if (lineStrip.includes("**")) {
                const parts = lineStrip.split("**");
                cleanLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part);
            }

            // Normal text
            return <p key={idx} className="text-xs text-slate-350 leading-relaxed mb-3">{cleanLine}</p>;
        });
    };

    const host = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    return (
        <div className="space-y-6 select-none max-w-7xl mx-auto">
            {/* Header navigation bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.push("/dashboard/reports")}
                        className="p-2 rounded-xl bg-slate-800/60 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white tracking-tight">{report.title}</h1>
                        <span className="text-[10px] text-slate-500 block font-mono">Report Prompt: {report.topic}</span>
                    </div>
                </div>

                {/* Exporter downloads links */}
                <div className="flex items-center gap-2">
                    <a 
                        href={`${host}${report.pdf_url}`} 
                        download
                        target="_blank"
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
                    >
                        <Download className="w-4 h-4" /> PDF Report
                    </a>
                    <a 
                        href={`${host}${report.docx_url}`} 
                        download
                        target="_blank"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-blue-600/15 cursor-pointer"
                    >
                        <Download className="w-4 h-4" /> Word DOCX
                    </a>
                </div>
            </div>

            {/* Split Screen Panel layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Left Side: Scrollable Document Viewer */}
                <div className="lg:col-span-2 p-8 rounded-2xl border border-slate-800/80 bg-[#0b1329]/50 glass-panel min-h-[500px]">
                    {report.status !== "completed" ? (
                        <div className="h-64 flex flex-col items-center justify-center text-center">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                            <span className="text-sm font-bold text-white uppercase font-mono tracking-wider">Generating Document...</span>
                        </div>
                    ) : (
                        <article className="prose prose-invert max-w-none">
                            {renderMarkdownContent(report.content)}
                        </article>
                    )}
                </div>

                {/* Right Side: RAGAS Quality evaluation panel */}
                <div className="space-y-6">
                    {/* Performance & cost widgets card */}
                    <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel">
                        <h3 className="text-xs font-mono font-semibold text-slate-400 mb-4 uppercase tracking-wider">Metrics and Costs</h3>
                        <div className="grid grid-cols-3 gap-4 border-b border-slate-850 pb-4 mb-4">
                            <div>
                                <span className="text-[10px] text-slate-500 block">LLM COST</span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                    ${report.evaluation?.estimated_cost?.toFixed(5) || "0.00000"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 block">TOKENS</span>
                                <span className="text-xs font-mono font-bold text-purple-400">
                                    {report.evaluation?.token_count?.toLocaleString() || 0}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-slate-500 block">LATENCY</span>
                                <span className="text-xs font-mono font-bold text-blue-400">
                                    {report.evaluation?.latency_ms ? `${(report.evaluation.latency_ms / 1000).toFixed(2)}s` : "0.00s"}
                                </span>
                            </div>
                        </div>

                        {/* RAGAS indicators */}
                        {report.evaluation && (
                            <div className="space-y-3.5">
                                <span className="text-[10px] font-mono text-slate-500 block">RAGAS METRICS</span>
                                {[
                                    { name: "Faithfulness", score: report.evaluation.faithfulness, desc: "Claims aligned with citation chunks" },
                                    { name: "Answer Relevancy", score: report.evaluation.answer_relevancy, desc: "Directness of report contents to query" },
                                    { name: "Confidence Score", score: report.evaluation.confidence_score, desc: "Integrated quality average assessment" },
                                    { name: "Hallucination Rate", score: report.evaluation.hallucination_rate, desc: "Ratio of unverified assertions found", inverted: true }
                                ].map((metric, idx) => {
                                    const percentage = Math.round(metric.score * 100);
                                    let barColor = "bg-blue-500";
                                    if (metric.inverted) {
                                        barColor = percentage > 20 ? "bg-rose-500" : "bg-emerald-500";
                                    } else {
                                        barColor = percentage > 85 ? "bg-emerald-500" : percentage > 70 ? "bg-amber-500" : "bg-rose-500";
                                    }

                                    return (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-semibold text-slate-355">{metric.name}</span>
                                                <span className="font-mono font-bold text-white">{percentage}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${percentage}%` }}
                                                    className={`h-full ${barColor} transition-all`}
                                                ></div>
                                            </div>
                                            <span className="text-[8.5px] text-slate-500 block leading-tight">{metric.desc}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Sources & Citations validation checklist card */}
                    <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/40 glass-panel">
                        <h3 className="text-xs font-mono font-semibold text-slate-400 mb-4 uppercase tracking-wider">Claims Checklists</h3>
                        <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
                            {report.sources?.map((s: NonNullable<ReportDetail["sources"]>[number], idx: number) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-950/40 border border-slate-850 text-[10px] leading-relaxed">
                                    <div className="flex justify-between items-start mb-1.5">
                                        <span className="font-semibold text-slate-300 font-mono truncate max-w-[150px]">
                                            Source [{idx + 1}]: {s.title}
                                        </span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                                            Cred: {Math.round(s.credibility_score * 100)}%
                                        </span>
                                    </div>
                                    <p className="text-slate-400 leading-normal line-clamp-3 mb-1.5">{s.content}</p>
                                    {s.url && (
                                        <a 
                                            href={s.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transition-all font-mono inline-flex items-center gap-1 hover:underline"
                                        >
                                            Verify Source URL <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                    )}
                                </div>
                            ))}
                            
                            {(!report.sources || report.sources.length === 0) && (
                                <div className="text-[10px] text-slate-500 py-4 text-center">
                                    No external references recorded for this generation.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
