"use client";

import Link from "next/link";
import { ArrowRight, Search, ShieldAlert, Award, Bot, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090d16] text-slate-100 animated-bg-gradient selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#090d16]/75 backdrop-blur-md border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            A
          </div>
          <div>
            <span className="font-semibold text-lg tracking-tight text-white">Autonomous Agent</span>
            <span className="text-xs block text-slate-400 -mt-1 font-mono">Report Generator v1.0</span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-blue-400 transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/register" 
            className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 flex items-center gap-1.5"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 text-center max-w-6xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/35 text-blue-400 text-xs font-semibold mb-8 animate-pulse">
          <Bot className="w-3.5 h-3.5" /> Next-Generation Multi-Agent Orchestration
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Autonomously Research, Write & Verify <span className="animated-gradient-text">Enterprise-Grade Reports</span>
        </h1>
        
        <p className="text-slate-400 text-base md:text-xl max-w-2xl mb-10 leading-relaxed">
          Provide a topic, upload reference docs, and watch a synchronized team of Planning, Research, RAG, Writing, and Review agents compile a fact-checked, cited report in minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/register" 
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/35 flex items-center justify-center gap-2 text-base"
          >
            Launch Free Workspace <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#workflow" 
            className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-base"
          >
            See How It Works
          </a>
        </div>

        {/* Hero Interactive App Mockup */}
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-1.5 shadow-2xl shadow-blue-900/20 max-w-4xl relative overflow-hidden">
          <div className="rounded-xl border border-slate-800/50 bg-[#0b1329]/80 p-6 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 block"></span>
                <span className="text-xs text-slate-500 font-mono ml-4">agent_orchestrator.py</span>
              </div>
              <div className="px-2.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
                GRAPH ACTIVE
              </div>
            </div>

            {/* Agent steps display */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { name: "Planning Agent", desc: "Topic Outline & Queries", status: "completed", color: "from-blue-600 to-indigo-500" },
                { name: "Research Agent", desc: "Multi-Source Web Crawl", status: "completed", color: "from-purple-600 to-pink-500" },
                { name: "RAG Retrieval", desc: "Semantic Doc Query", status: "completed", color: "from-cyan-600 to-teal-500" },
                { name: "Writer Agent", desc: "Markdown Synthesis", status: "active", color: "from-amber-500 to-orange-500" },
                { name: "Review & Verify", desc: "Citation Checking & Cost", status: "pending", color: "from-slate-700 to-slate-600" }
              ].map((agent, i) => (
                <div key={i} className={`p-4 rounded-xl border ${
                  agent.status === "completed" ? "border-emerald-500/30 bg-emerald-500/5" :
                  agent.status === "active" ? "border-blue-500 bg-blue-500/5 shadow-md shadow-blue-500/10" :
                  "border-slate-800 bg-slate-900/40"
                } relative overflow-hidden group`}>
                  <div className={`w-1 h-full absolute left-0 top-0 bg-gradient-to-b ${agent.color}`}></div>
                  <div className="font-semibold text-xs mb-1 flex items-center justify-between">
                    {agent.name}
                    {agent.status === "completed" && <span className="text-[10px] text-emerald-400 font-mono">✓ Done</span>}
                    {agent.status === "active" && <span className="text-[10px] text-blue-400 font-mono animate-pulse">● Run</span>}
                    {agent.status === "pending" && <span className="text-[10px] text-slate-500 font-mono">Wait</span>}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight">{agent.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-slate-950/60 border border-slate-800 font-mono text-xs text-slate-400 h-24 overflow-y-hidden flex flex-col justify-end">
              <div>[SYSTEM] Planning complete. Created 6 Outline Headers and 4 Search Queries.</div>
              <div>[SYSTEM] Web Research query executed. Fetched 3 target sources. Credibility threshold passed.</div>
              <div>[SYSTEM] Vector db search matched 2 uploaded PDF chunks. Injecting into Context.</div>
              <div className="text-blue-400 animate-pulse">[AGENT] Writer is drafting Section 3: Key Technology Components. Tokens: 1,420...</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-20 bg-slate-950/40 border-t border-b border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Engineered for Production Precision</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our platform implements advanced guardrails and evaluations to guarantee credibility, accuracy, and utility.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Search className="w-6 h-6 text-blue-400" />, title: "Autonomous Research", desc: "Queries search APIs or crawls simulated sites to locate high-density facts matching the topic." },
              { icon: <Layers className="w-6 h-6 text-emerald-400" />, title: "Dynamic RAG Fusion", desc: "Upload project PDFs or text guidelines. The vector store queries document chunks and merges them." },
              { icon: <ShieldAlert className="w-6 h-6 text-rose-400" />, title: "Hallucination Checkers", desc: "A verification agent cross-checks assertions against retrieved snippets and flags unverified text." },
              { icon: <Award className="w-6 h-6 text-amber-400" />, title: "RAGAS Metrics Stats", desc: "Evaluates generated reports for Faithfulness, Relevancy, Context Precision, and Recalls." }
            ].map((feat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 glass-panel-hover flex flex-col items-start text-left">
                <div className="p-3 rounded-xl bg-slate-800/60 mb-4">{feat.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-white">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Simple, Scalable Pricing</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-16">
          Access automated research capabilities with fair rates. Run mock-generations entirely for free.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {[
            { 
              name: "Developer Workspace", 
              price: "$0", 
              sub: "Free Forever",
              desc: "Perfect for testing, interviews, and portfolio showcase.",
              features: [
                "Unlimited mock agent generations",
                "Full interactive dashboards",
                "SQLite/InMemory vector database",
                "Input prompt injection guardrails",
                "RAGAS evaluation simulation",
                "PDF and Word reports export"
              ],
              button: "Launch Console Now",
              link: "/register"
            },
            { 
              name: "Enterprise Core", 
              price: "Custom", 
              sub: "Token-based pricing",
              desc: "Connect your keys and query live engines at scale.",
              features: [
                "GPT-4o-mini API integration",
                "Tavily real-time web search crawler",
                "Production PostgreSQL database",
                "Persistent ChromaDB containers",
                "Advanced role privileges (RBAC)",
                "Full security audit event stream"
              ],
              button: "Contact Enterprise",
              link: "mailto:enterprise@reportagent.ai"
            }
          ].map((tier, i) => (
            <div key={i} className={`p-8 rounded-3xl text-left border ${
              i === 0 ? "border-blue-500/80 bg-blue-500/5 shadow-lg shadow-blue-500/5" : "border-slate-800 bg-slate-900/30"
            } flex flex-col justify-between`}>
              <div>
                <span className="font-bold text-xl block text-white mb-2">{tier.name}</span>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-xs text-slate-400">{tier.sub}</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">{tier.desc}</p>
                <div className="border-b border-slate-800 pb-6 mb-6"></div>
                <ul className="space-y-3.5 mb-8">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 block shrink-0"></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href={tier.link}
                className={`w-full text-center py-3 rounded-xl font-medium transition-all text-sm block ${
                  i === 0 ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/10" : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                {tier.button}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-850 px-6 py-8 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <div>© 2026 Autonomous AI Report Agent. All rights reserved.</div>
        <div className="flex gap-6 mt-4 sm:mt-0">
          <a href="#" className="hover:text-slate-300">Terms of Use</a>
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">System Logs</a>
        </div>
      </footer>
    </div>
  );
}
