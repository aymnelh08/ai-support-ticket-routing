'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface Ticket {
    id: string;
    name: string;
    email: string;
    message: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    summary: string;
    route_to: string;
    status: string;
    created_at: string;
}

export default function AdminDashboard() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tickets');
            const data = await res.json();
            if (data.tickets) {
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error('Failed to fetch tickets', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));

        try {
            await fetch(`/api/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error('Failed to update status', error);
            fetchTickets(); // Revert on error
        }
    };

    const getPriorityColor = (p: string) => {
        switch (p) {
            case 'high': return 'destructive';
            case 'medium': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-6 rounded-lg border shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Real-time AI classification and routing
                    </p>
                </div>
                <Button variant="outline" onClick={fetchTickets} disabled={loading}>
                    <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tickets.map((ticket) => (
                    <Card key={ticket.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2">
                                <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                                    {ticket.route_to.replace('_', ' ')}
                                </Badge>
                                <Badge variant={getPriorityColor(ticket.priority)}>
                                    {ticket.priority}
                                </Badge>
                            </div>
                            <CardTitle className="text-lg font-semibold mt-2 line-clamp-1">
                                {ticket.category.toUpperCase()}
                            </CardTitle>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(ticket.created_at).toLocaleString()}
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 space-y-4">
                            <div className="bg-muted/50 p-3 rounded-md text-sm italic border">
                                "{ticket.summary}"
                            </div>
                            <div className="text-sm">
                                <span className="font-semibold text-foreground">From:</span> {ticket.name}
                                <br />
                                <span className="text-xs text-muted-foreground">{ticket.email}</span>
                            </div>

                            <div className="text-sm text-muted-foreground border-t pt-3 mt-3">
                                <p className="line-clamp-3">{ticket.message}</p>
                            </div>
                        </CardContent>

                        <div className="p-6 pt-0 mt-auto flex gap-2">
                            {ticket.status !== 'resolved' && (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    onClick={() => updateStatus(ticket.id, 'resolved')}
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" /> Resolve
                                </Button>
                            )}
                            {ticket.status === 'resolved' && (
                                <Button variant="ghost" size="sm" className="w-full" disabled>
                                    Resolved
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
                {!loading && tickets.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        No tickets found. Submit one to see the AI in action!
                    </div>
                )}
            </div>
        </div>
    );
}
