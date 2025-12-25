// Sharing functionality for dashboards

const SHARED_STORAGE_KEY = 'genui_shared_dashboards';

export interface SharedDashboard {
    shareId: string;
    name: string;
    schema: any;
    createdAt: string;
    viewCount: number;
}

// Generate short share ID
function generateShareId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Get all shared dashboards
function getSharedDashboards(): SharedDashboard[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(SHARED_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Save shared dashboards
function saveSharedDashboards(dashboards: SharedDashboard[]): void {
    localStorage.setItem(SHARED_STORAGE_KEY, JSON.stringify(dashboards));
}

// Create a shareable link for a dashboard
export function createShareLink(name: string, schema: any): string {
    const shares = getSharedDashboards();

    const shareId = generateShareId();
    const newShare: SharedDashboard = {
        shareId,
        name,
        schema,
        createdAt: new Date().toISOString(),
        viewCount: 0
    };

    shares.push(newShare);
    saveSharedDashboards(shares);

    // Return the full share URL
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/share/${shareId}`;
}

// Get shared dashboard by ID
export function getSharedDashboard(shareId: string): SharedDashboard | null {
    const shares = getSharedDashboards();
    const share = shares.find(s => s.shareId === shareId);

    if (share) {
        // Increment view count
        share.viewCount++;
        saveSharedDashboards(shares);
    }

    return share || null;
}

// Delete a share link
export function deleteShareLink(shareId: string): boolean {
    const shares = getSharedDashboards();
    const filtered = shares.filter(s => s.shareId !== shareId);

    if (filtered.length === shares.length) return false;

    saveSharedDashboards(filtered);
    return true;
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

// Get all shares for current user
export function getUserShares(): SharedDashboard[] {
    return getSharedDashboards();
}
