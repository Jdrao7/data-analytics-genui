import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// Generate a short share ID
function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// POST /api/share - Create a new share link
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, schema } = body;

        if (!name || !schema) {
            return NextResponse.json(
                { error: 'Name and schema are required' },
                { status: 400 }
            );
        }

        const shareId = generateShareId();

        // Insert into database
        const { error } = await supabase
            .from('shared_dashboards')
            .insert({
                share_id: shareId,
                name: name,
                schema: schema
            });

        if (error) {
            console.error('Supabase insert error:', error);
            return NextResponse.json(
                { error: 'Failed to create share link', details: error.message },
                { status: 500 }
            );
        }

        // Build the share URL
        const protocol = request.headers.get('x-forwarded-proto') || 'http';
        const host = request.headers.get('host') || 'localhost:3000';
        const shareUrl = `${protocol}://${host}/share/${shareId}`;

        return NextResponse.json({
            success: true,
            shareId,
            shareUrl
        });
    } catch (error) {
        console.error('Error creating share:', error);
        return NextResponse.json(
            { error: 'Failed to create share link' },
            { status: 500 }
        );
    }
}

// GET /api/share - List all shares (optional, for admin)
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('shared_dashboards')
            .select('share_id, name, created_at, view_count')
            .order('created_at', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Supabase query error:', error);
            return NextResponse.json(
                { error: 'Failed to list shares' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            shares: data || []
        });
    } catch (error) {
        console.error('Error listing shares:', error);
        return NextResponse.json(
            { error: 'Failed to list shares' },
            { status: 500 }
        );
    }
}
