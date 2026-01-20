'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function SupportForm() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to submit ticket');

            setSubmitted(true);
            setFormData({ name: '', email: '', message: '' });
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="w-full max-w-md mx-auto mt-10 border-green-200 bg-green-50 dark:bg-green-900/10">
                <CardContent className="pt-6 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">Ticket Submitted!</h2>
                    <p className="text-muted-foreground">
                        Our AI is analyzing your request and routing it to the right team. You'll hear from us shortly.
                    </p>
                    <Button onClick={() => setSubmitted(false)} variant="outline">
                        Submit Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-md mx-auto mt-4 shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Contact Support</CardTitle>
                <CardDescription>
                    Tell us how we can help. Our AI agent will ensure it gets to the right person instantly.
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <Textarea
                            id="message"
                            placeholder="Describe your issue..."
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing (AI Analysis)...
                            </>
                        ) : (
                            'Submit Request'
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
