const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface RequestOptions extends RequestInit {
    token?: string;
}

export interface User {
    id?: string;
    email?: string;
    full_name?: string;
    role?: string;
    [key: string]: unknown;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

export interface DashboardStats {
    total_reports: number;
    total_tokens: number;
    total_cost: number;
    blocked_security_events: number;
    monthly_breakdown: Array<{ name: string; reports: number; cost: number; tokens: number }>;
    recent_events?: Array<{
        status: string;
        action: string;
        created_at: string;
        details: string;
        user_email: string;
        ip_address?: string;
    }>;
    average_faithfulness: number;
    average_answer_relevancy: number;
    average_confidence: number;
    average_latency_ms: number;
}

export interface AdminUser {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
}

export interface ReportSummary {
    id: string;
    title: string;
    topic: string;
    status: string;
    evaluation?: {
        faithfulness?: number;
        answer_relevancy?: number;
        confidence_score?: number;
        hallucination_rate?: number;
        latency_ms?: number;
        estimated_cost: number;
        token_count: number;
    };
    created_at: string;
}

export interface ReportDetail extends ReportSummary {
    content: string;
    pdf_url: string;
    docx_url: string;
    sources?: Array<{
        title: string;
        credibility_score: number;
        content: string;
        url?: string;
    }>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { token, headers = {}, ...rest } = options;
    const requestHeaders: Record<string, string> = {
        ...(headers as Record<string, string>),
    };

    const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
    if (authToken) {
        requestHeaders["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: requestHeaders,
        ...rest,
    });

    if (response.status === 204) {
        return null as unknown as T;
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.detail || "An unexpected error occurred");
    }

    return data as T;
}

export const api = {
    register: (body: { email: string; full_name: string; password: string }) =>
        request<AuthResponse>("/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }),

    login: (formData: URLSearchParams) =>
        request<AuthResponse>("/auth/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
        }),

    getMe: () => request<User>("/auth/me"),

    listReports: () => request<ReportSummary[]>("/reports"),

    getReport: (id: string) => request<ReportDetail>(`/reports/${id}`),

    generateReport: (topic: string, title?: string) =>
        request<ReportDetail>("/reports/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, title }),
        }),

    deleteReport: (id: string) =>
        request<void>(`/reports/${id}`, {
            method: "DELETE",
        }),

    uploadDocument: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return request<{ message?: string }>("/upload", {
            method: "POST",
            body: formData,
        });
    },

    getDashboardStats: () => request<DashboardStats>("/analytics/dashboard"),

    listAdminUsers: () => request<AdminUser[]>("/admin/users"),

    updateUserRole: (userId: string, role: string) =>
        request<AdminUser>(`/admin/users/${userId}/role`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        }),
};
