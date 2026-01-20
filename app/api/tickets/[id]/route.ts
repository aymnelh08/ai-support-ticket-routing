import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params is a Promise in Next.js 15+
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('support_tickets')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, ticket: data });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
