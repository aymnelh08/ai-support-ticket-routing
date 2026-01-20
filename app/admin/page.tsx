import AdminDashboard from "@/components/AdminDashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
                        </Button>
                    </Link>
                </div>

                <AdminDashboard />

            </div>
        </div>
    );
}
