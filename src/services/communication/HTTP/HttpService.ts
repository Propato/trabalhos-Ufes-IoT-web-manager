// src/services/communication/HTTP/HttpService.ts
export class HttpService {
    private baseUrl: string;

    constructor(baseUrl: string = import.meta.env.VITE_HTTP_TELEMETRY_URL || "") {
        this.baseUrl = baseUrl;
    }

    async post(
        endpoint: string,
        payload: { [key: string]: number },
        headers: Record<string, string> = {},
    ): Promise<Response> {
        const url = `${this.baseUrl}${endpoint}`;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: defaultHeaders,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error("[HTTP] Request failed:", error);
            throw error;
        }
    }
}

export default HttpService;
