"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { 
    Loader2, 
    Bot, 
    CheckCircle2, 
    AlertTriangle,
    Eye,
    Compass,
    Search,
    BookOpen,
    Edit3,
    CheckSquare
} from "lucide-react";

export default function NewReportPage() {
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [customTitle, setCustomTitle] = useState("");
    const [loading, setLoading] = useState(false);
    
    // Polling report status states
    const [activeReportId, setActiveReportId] = useState<string | null>(null);
    const [reportStatus, setReportStatus] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Polling effect
    useEffect(() => {
        if (!activeReportId) return;

        const interval = setInterval(() => {
            const pollStatus = async () => {
                try {
                    const report = await api.getReport(activeReportId);
                    setReportStatus(report.status);

                    if (report.status === "completed") {
                        clearInterval(interval);
                        setLoading(false);
                    } else if (report.status === "failed") {
                        clearInterval(interval);
                        setErrorMsg("Agent orchestration graph failed. Try a different topic configuration.");
                        setLoading(false);
                    }
                } catch (err: unknown) {
                    clearInterval(interval);
                    const message = err instanceof Error ? err.message : "Failed to poll agent updates.";
                    setErrorMsg(message);
                    setLoading(false);
                }
            };
            void pollStatus();
        }, 2000);

        return () => clearInterval(interval);
    }, [activeReportId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setLoading(true);
        setErrorMsg(null);
        setReportStatus("pending");
        setActiveReportId(null);

        try {
            const data = await api.generateReport(topic, customTitle || undefined);
            setActiveReportId(data.id);
            setReportStatus(data.status);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Security violation or backend failure. Request blocked.";
            setErrorMsg(message);
            setLoading(false);
        }
    };

    // Helper to get step detail text
    const getStatusDetails = () => {
        switch (reportStatus) {
            case "pending":
                return { text: "Initializing multi-agent graph loop...", step: 0 };
            case "planning":
                return { text: "Planning Agent: Structuring outlining headers, formulating queries...", step: 1 };
            case "researching":
                return { text: "Research Agent: Querying search APIs & scraping findings content...", step: 2 };
            case "retrieving":
                return { text: "RAG Retrieval Agent: Querying local vector db for user reference chunks...", step: 3 };
            case "writing":
                return { text: "Writer Agent: Aggregating research documents and drafting markdown sections...", step: 4 };
            case "reviewing":
                return { text: "Reviewer Agent: Grading outline integrity, spelling parameters, and flow...", step: 5 };
            case "verifying":
                return { text: "Citation Verifier Agent: Mapping references, scoring RAGAS indicators...", step: 6 };
            case "exporting":
                return { text: "Report Exporter Agent: Formulating PDF and Microsoft Word DOCX payloads...", step: 7 };
            case "completed":
                return { text: "Workflow completed successfully!", step: 8 };
            default:
                return { text: "Awaiting execution sequence trigger...", step: 0 };
        }
    };

    const statusInfo = getStatusDetails();

    const agentSteps = [
        { name: "Decompose Topic", key: "planning", icon: <Compass className="w-4 h-4" /> },
        { name: "Web Crawler", key: "researching", icon: <Search className="w-4 h-4" /> },
        { name: "Vector RAG Sync", key: "retrieving", icon: <BookOpen className="w-4 h-4" /> },
        { name: "Draft Markdown", key: "writing", icon: <Edit3 className="w-4 h-4" /> },
        { name: "Quality Grading", key: "reviewing", icon: <CheckSquare className="w-4 h-4" /> }
    ];

    return (
        <div className="max-w-3xl mx-auto space-y-6 select-none">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Generate Research Report</h1>
                <p className="text-xs text-slate-400">Trigger the autonomous agent workflow to gather data, review layout, and exports files.</p>
            </div>

            {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/35 flex gap-3 items-start text-rose-450 text-xs leading-normal">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                        <strong className="block text-rose-300 font-semibold mb-0.5">Execution Error</strong>
                        {errorMsg}
                    </div>
                </div>
            )}

            {/* Request form or Progress */}
            <div className="p-6 rounded-2xl border border-slate-800/80 bg-[#0b1329]/50 glass-panel">
                {!loading && !activeReportId ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-mono font-medium text-slate-400 mb-2">RESEARCH TOPIC / PROMPT</label>
                            <textarea
                                required
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
                                placeholder="E.g., Quantum Computing hardware scaling challenges in 2026, or Security vulnerabilities in next-gen Next.js 15 apps."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono font-medium text-slate-400 mb-2">OPTIONAL DOCUMENT TITLE</label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={(e) => setCustomTitle(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                                placeholder="E.g., Quantum_Hardware_Report_v1"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/15 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Bot className="w-4 h-4" />
                            Trigger Agent Orchestration Graph
                        </button>
                    </form>
                ) : (
                    <div className="space-y-8 py-4">
                        {/* Live Status Animation */}
                        <div className="flex flex-col items-center justify-center text-center">
                            {reportStatus === "completed" ? (
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                            ) : (
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                </div>
                            )}

                            <span className="text-sm font-bold text-white uppercase font-mono tracking-wider">
                                STATUS: {reportStatus.replace(/_/g, " ")}
                            </span>
                            <p className="text-xs text-slate-400 mt-2 max-w-md font-mono leading-relaxed bg-slate-950/30 p-3 rounded-lg border border-slate-850">
                                {statusInfo.text}
                            </p>
                        </div>

                        {/* Progress Stepper Visual indicator */}
                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                                <span>INITIALIZATION</span>
                                <span>COMPLETED</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div 
                                    style={{ width: `${(statusInfo.step / 8) * 100}%` }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-700 ease-out"
                                ></div>
                            </div>
                        </div>

                        {/* Visual agent grid list */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-4">
                            {agentSteps.map((agent, i) => {
                                const isCurrent = reportStatus === agent.key;
                                const isDone = statusInfo.step > (i + 1);
                                return (
                                    <div key={i} className={`p-3 rounded-xl border text-center transition-all ${
                                        isCurrent ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/10" :
                                        isDone ? "border-emerald-500/30 bg-emerald-500/5 text-slate-350" :
                                        "border-slate-800 bg-slate-900/10 text-slate-500"
                                    }`}>
                                        <div className={`mx-auto w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${
                                            isCurrent ? "bg-blue-500/10 text-blue-400" :
                                            isDone ? "bg-emerald-500/10 text-emerald-400" :
                                            "bg-slate-800/40 text-slate-500"
                                        }`}>
                                            {agent.icon}
                                        </div>
                                        <div className="text-[9px] font-mono font-bold block leading-none">{agent.name}</div>
                                    </div>
                                );
                            })}
                        </div>

                        {reportStatus === "completed" && (
                            <div className="border-t border-slate-800/80 pt-6 flex justify-end">
                                <button
                                    onClick={() => router.push(`/dashboard/reports/${activeReportId}`)}
                                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/15 flex items-center gap-1.5 cursor-pointer"
                                >
                                    View Report <Eye className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
