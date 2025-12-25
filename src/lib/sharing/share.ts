// Sharing functionality for dashboards - using Vercel Postgres

export interface SharedDashboard {
    shareId: string;
    name: string;
    schema: any;
    createdAt: string;
    viewCount: number;
}

// Create a shareable link for a dashboard (calls API)
export async function createShareLink(name: string, schema: any): Promise<string> {
    try {
        const response = await fetch('/api/share', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, schema }),
        });

        if (!response.ok) {
            throw new Error('Failed to create share link');
        }

        const data = await response.json();
        return data.shareUrl;
    } catch (error) {
        console.error('Error creating share link:', error);
        throw error;
    }
}

// Get shared dashboard by ID (calls API)
export async function getSharedDashboard(shareId: string): Promise<SharedDashboard | null> {
    try {
        const response = await fetch(`/api/share/${shareId}`);

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Failed to fetch shared dashboard');
        }

        const data = await response.json();
        return {
            shareId: data.shareId,
            name: data.name,
            schema: data.schema,
            createdAt: data.createdAt,
            viewCount: data.viewCount,
        };
    } catch (error) {
        console.error('Error fetching shared dashboard:', error);
        return null;
    }
}

// Delete a share link (calls API)
export async function deleteShareLink(shareId: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/share/${shareId}`, {
            method: 'DELETE',
        });

        return response.ok;
    } catch (error) {
        console.error('Error deleting share link:', error);
        return false;
    }
}

// Generate embed code
export function generateEmbedCode(shareUrl: string, width = 800, height = 600): string {
    return `<iframe 
  src="${shareUrl}?embed=true" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="GenUI Dashboard"
></iframe>`;
}

// Get all shares (calls API) - for listing user's shares
export async function getUserShares(): Promise<SharedDashboard[]> {
    try {
        const response = await fetch('/api/share');

        if (!response.ok) {
            throw new Error('Failed to fetch shares');
        }

        const data = await response.json();
        return data.shares.map((share: any) => ({
            shareId: share.share_id,
            name: share.name,
            createdAt: share.created_at,
            viewCount: share.view_count,
            schema: null, // Not included in list response
        }));
    } catch (error) {
        console.error('Error fetching shares:', error);
        return [];
    }
}
