import SupportForm from "@/components/SupportForm";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="mb-20 z-10 text-center space-y-4 max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Smart Support
        </h1>
        <p className="text-lg text-muted-foreground">
          Experience the future of customer service.
          Our <span className="font-semibold text-foreground">Gemini-powered AI</span> instantly analyzes, prioritizes, and routes your request.
        </p>

        <div className="pt-4">
          <Link href="/admin">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary">
              View Admin Dashboard →
            </Button>
          </Link>
        </div>
      </div>

      <div className="z-10 w-full max-w-md">
        <SupportForm />
      </div>

      <footer className="mt-20 text-sm text-muted-foreground z-10">
        Built for the Google DeepMind Agentic Coding Challenge
      </footer>
    </main>
  );
}
