import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export interface AIAnalysisResult {
    category: "billing" | "technical" | "sales" | "account" | "other";
    priority: "low" | "medium" | "high";
    summary: string;
    route_to: "billing_queue" | "technical_queue" | "sales_queue" | "general_support";
}

const FALLBACK_RESULT: AIAnalysisResult = {
    category: "other",
    priority: "medium",
    summary: "AI processing failed, manual review required.",
    route_to: "general_support",
};

export async function analyzeTicketWithGemini(
    name: string,
    email: string,
    message: string
): Promise<AIAnalysisResult> {
    if (!apiKey) {
        console.error("Missing Gemini API Key");
        return FALLBACK_RESULT;
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      You are an AI Support Ticket Routing System.
      Analyze the following support request and output a STRICT JSON object.

      USER: ${name} (${email})
      MESSAGE: "${message}"

      RULES:
      1. Classify 'category' as one of: billing, technical, sales, account, other.
      2. Determine 'priority' as: low, medium, high.
         - High if: service down, payment failed, access blocked, angry user.
      3. Create a 'summary' (one sentence).
      4. Assign 'route_to' as:
         - billing_queue (for billing/payment)
         - technical_queue (for bugs/outages)
         - sales_queue (for pricing/demos)
         - general_support (for rest/unclear)

      OUTPUT SCHEMA (JSON ONLY):
      {
        "category": "...",
        "priority": "...",
        "summary": "...",
        "route_to": "..."
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/^```json\n|\n```$/g, "").trim();

        const data = JSON.parse(jsonString);

        // Basic validation
        if (!data.category || !data.priority || !data.route_to) {
            throw new Error("Invalid structure");
        }

        return {
            category: data.category,
            priority: data.priority,
            summary: data.summary || message.substring(0, 50) + "...",
            route_to: data.route_to,
        };
    } catch (error) {
        console.error("Gemini Analysis Failed. Details:", error);
        if (error instanceof Error) {
            console.error("Error Message:", error.message);
            // console.error("Stack:", error.stack); // Optional, might be noisy
        }
        return FALLBACK_RESULT;
    }
}
