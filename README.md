# AI Support Ticket Routing System

A production-ready full-stack application that uses AI to automatically classify, prioritize, and route customer support tickets.

## 🚀 Overview

This project demonstrates a modern approach to support ticket management. Instead of simple keyword matching, it leverages **Google's Gemini 2.0 Flash** model to understand the *sentiment* and *intent* of a user's message.

### Key Features
- **AI Decision Engine**: Automatically categorizes tickets (Billing, Technical, Sales) and assigns priority based on urgency (e.g., "service down" = HIGH).
- **Smart Routing**: Directs tickets to the specific queue best suited to handle them.
- **Modern UI**: clean, responsive interface built with Next.js App Router and Tailwind CSS.
- **Real-time Admin Dashboard**: View incoming tickets with their AI-assigned metadata.

## 🏗 Architecture

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **AI Model**: Google Gemini 2.0 Flash (via `@google/generative-ai`)
- **Database**: Supabase (PostgreSQL)

### Data Flow
1. **User Submission**: User submits a form on the landing page.
2. **API Handling**: `POST /api/tickets` receives the payload.
3. **AI Analysis**: The inputs are sent to Gemini with a strict system prompt to return structured JSON.
4. **Validation**: The backend validates the AI response against a schema.
5. **Persistence**: The ticket + AI metadata is saved to Supabase.
6. **Client Update**: The Admin Dashboard fetches the latest tickets.

## 🛠️ How to Run Locally

### Prerequisites
- Node.js 18+
- A Supabase project
- A Google Cloud project with Gemini API enabled

### 1. Clone & Install
```bash
git clone <repo_url>
cd ai-support-system
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Database Setup
Run the SQL query found in `supabase_schema.sql` in your Supabase SQL Editor to create the `support_tickets` table.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🧠 AI Logic & Constraints

The AI is treated as a deterministic function, not a chatbot. We enforce a Strict JSON Output Schema in the prompt.

**Why Gemini?**
It offers low latency and high consistency for classification tasks.

**Fallback Mechanism**
If the AI API fails or returns invalid JSON, the system gracefully falls back to a default "General Support" classification with "Medium" priority, ensuring no data is lost.

## 🔮 Future Improvements
- **Real-time Updates**: Use Supabase Realtime (Subscriptions) to push new tickets to the dashboard instantly.
- **Email Integration**: Send auto-responses to users based on the AI analysis.
- **Vector Search**: Use embeddings to find similar past tickets for automated solutions.

---
Built for the Google DeepMind Agentic Coding Challenge.
