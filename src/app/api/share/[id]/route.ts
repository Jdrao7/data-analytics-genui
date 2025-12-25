import { getSupabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/share/[id] - Get a shared dashboard by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: shareId } = await params;
        const supabase = getSupabase();

        // Get the shared dashboard
        const { data, error } = await supabase
            .from('shared_dashboards')
            .select('share_id, name, schema, created_at, view_count')
            .eq('share_id', shareId)
            .single();

        if (error || !data) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        // Increment view count
        await supabase
            .from('shared_dashboards')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('share_id', shareId);

        return NextResponse.json({
            shareId: data.share_id,
            name: data.name,
            schema: data.schema,
            createdAt: data.created_at,
            viewCount: (data.view_count || 0) + 1
        });
    } catch (error) {
        console.error('Error fetching shared dashboard:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard' },
            { status: 500 }
        );
    }
}

// DELETE /api/share/[id] - Delete a shared dashboard
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: shareId } = await params;
        const supabase = getSupabase();

        const { error, count } = await supabase
            .from('shared_dashboards')
            .delete()
            .eq('share_id', shareId);

        if (error) {
            console.error('Supabase delete error:', error);
            return NextResponse.json(
                { error: 'Failed to delete dashboard' },
                { status: 500 }
            );
        }

        if (count === 0) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            deleted: shareId
        });
    } catch (error) {
        console.error('Error deleting shared dashboard:', error);
        return NextResponse.json(
            { error: 'Failed to delete dashboard' },
            { status: 500 }
        );
    }
}
