# Autonomous AI Report Generation Agent SaaS Platform

A production-grade, full-stack SaaS platform that automates research, fact-verification, outline planning, synthesis, and PDF/Word report exports using a multi-agent orchestration team. Built for hackathons, technical assessments, and resume showcase.

---

## 🌟 Key Features

### 🧠 Multi-Agent State Graph (LangGraph-inspired)
- **Planning Agent**: Decomposes report requests into outline topics, heading arrays, and research strategies.
- **Research Agent**: Scrapes simulated web listings or Tavily API results and assigns domain authority credibility ratings.
- **RAG Retrieval Agent**: Queries local/Chroma database vector segments for user-uploaded reference PDF/TXT files.
- **Writer Agent**: Combines research briefs and document contexts to synthesize professional Markdown reports.
- **Reviewer Agent**: Critiques report layouts, check grammar parameters, and scores drafts.
- **Citation Verifier**: Cross-checks claims against source fragments, highlights hallucinations, and outputs RAGAS evaluation indices.
- **Export Agent**: Conveys Markdown blocks into formatted PDF files and Word DOCX payloads.

### 🛡️ Multi-Layer Security Guardrails
- **Prompt Injection & Jailbreak Scanner**: Scans topics against adversarial patterns, blocking violations before LLM processing.
- **Sensitive Data Masking (PII)**: Scrubs emails, phone numbers, credit card sequences, and SSNs from prompts using regex filters.
- **Role-Based Access Control (RBAC)**: Admin-protected consoles for adjusting privilege boundaries (`admin`, `editor`, `viewer`).
- **Security Audit logs**: Chronological tracking of security blocks, indexing triggers, and authentication events.

### 📊 Real-Time Observability Dashboard
- **LLMOps Analytics**: Charts token consumption, accrued dollar costs, and average latency durations.
- **RAGAS Radial Gauges**: Computes Faithfulness, Answer Relevancy, Confidence Score, and Hallucination Rates.
- **Audit Feed**: Scrollable logs detailing rate limits, role modifications, and blocked prompt injections.
- **Reference Indexer**: Live drag-and-drop file uploading dashboard to update the vector database instantly.

---

## 🏗️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS | UI Dashboard, charting, file uploading console |
| **Backend** | FastAPI, Python 3.13 | High-performance RESTful API endpoints |
| **Orchestration** | State-Graph Asyncio Pipeline | Multi-agent execution loop |
| **Database** | SQLAlchemy (PostgreSQL / SQLite) | User registers, report metadata, audit records |
| **Vector DB** | ChromaDB / Custom TF-IDF Fallback | Semantic search segment indexing |
| **Caching** | Redis (Optional config) | Rate-limiting & route optimization |

---

## 📦 Project Directory Structure

```text
/autonomous-report-agent
│
├── backend/                        # FastAPI Backend Application
│   ├── app/
│   │   ├── main.py                 # App entrypoint & CORS configuration
│   │   ├── config.py               # Pydantic environment configuration
│   │   ├── database.py             # DB connection session
│   │   ├── security/               # Hashing, RBAC checkers, input guardrails
│   │   ├── models/                 # SQLAlchemy relational schema
│   │   ├── schemas/                # Pydantic request validators
│   │   ├── routes/                 # FastAPI routes (Auth, Reports, Uploads)
│   │   ├── services/               # PDF/Word generators, VectorDB loaders
│   │   └── agents/                 # Planning, Research, Writing, Review agents
│   └── requirements.txt
│
├── frontend/                       # Next.js 15 Frontend
│   ├── src/
│   │   ├── app/                    # App Router dashboard & view routes
│   │   ├── components/             # Sidebar, theme hooks, viewer panels
│   │   ├── context/                # Client session auth contexts
│   │   └── lib/                    # API client with token insertion
│   └── package.json
└── README.md
```

---

## 🚀 Quick Start Instructions

Follow these steps to run the complete SaaS platform locally in under 5 minutes:

### 1. Initialize Backend
Ensure Python 3.10+ is installed on your machine.
```bash
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# Run uvicorn server (points to localhost:8000)
python -m uvicorn app.main:app --reload
```

### 2. Initialize Frontend
Ensure Node.js 18+ is installed on your machine.
```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

# Run dev server (points to localhost:3000)
npm run dev
```

### 3. Log In to Dashboard
1. Open your browser and navigate to `http://localhost:3000`.
2. Click **Sign In** and use the default seed Administrator credentials:
   - **Email**: `admin@reportagent.ai`
   - **Password**: `AdminPassword123!`
3. Click **Generate Report** to request custom reports, or **Overview** to inspect evaluation gauges and upload PDF guidelines.

---

## 🔒 Configuration & Environment Variables

Create a `.env` file under the `/backend` folder to customize LLM connectors:
```env
# Change JWT Secret Key in production
SECRET_KEY="production_hash_secret_key"

# Database Configuration (SQLite default, toggle to PostgreSQL)
DATABASE_URL="sqlite:///./report_agent.db"

# LLM Providers (Set OpenAI keys to query actual models, or leave empty for mockup runs)
OPENAI_API_KEY="sk-proj-..."
TAVILY_API_KEY="tvly-..."
```

---

## 📈 RAGAS Quality Criteria Matrix

The platform evaluates generated reports against these parameters:
1. **Faithfulness**: Counts the percentage of document statements matching verified sources (100% means zero hallucination).
2. **Context Precision**: Rates the semantic relevancy of retrieved vector chunks against the outline.
3. **Answer Relevancy**: Validates if the drafted text directly addresses the user's research topic.
4. **Hallucination Rate**: Computes the ratio of unverified assertions found in bibliography sections.
