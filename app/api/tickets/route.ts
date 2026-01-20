import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { analyzeTicketWithGemini } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // AI Analysis
        const aiAnalysis = await analyzeTicketWithGemini(name, email, message);

        // Database Insertion
        const { data, error } = await supabase
            .from('support_tickets')
            .insert([
                {
                    name,
                    email,
                    message,
                    ...aiAnalysis,
                    status: 'new',
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Supabase Insert Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, ticket: data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ tickets: data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
