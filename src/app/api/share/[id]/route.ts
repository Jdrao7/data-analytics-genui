import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/share/[id] - Get a shared dashboard by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: shareId } = await params;

        // Get the shared dashboard
        const result = await sql`
            SELECT share_id, name, schema, created_at, view_count 
            FROM shared_dashboards 
            WHERE share_id = ${shareId}
        `;

        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: 'Dashboard not found' },
                { status: 404 }
            );
        }

        const dashboard = result.rows[0];

        // Increment view count
        await sql`
            UPDATE shared_dashboards 
            SET view_count = view_count + 1 
            WHERE share_id = ${shareId}
        `;

        return NextResponse.json({
            shareId: dashboard.share_id,
            name: dashboard.name,
            schema: dashboard.schema,
            createdAt: dashboard.created_at,
            viewCount: dashboard.view_count + 1
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

        const result = await sql`
            DELETE FROM shared_dashboards 
            WHERE share_id = ${shareId}
            RETURNING share_id
        `;

        if (result.rows.length === 0) {
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
