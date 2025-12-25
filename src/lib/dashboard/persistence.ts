// Dashboard persistence using LocalStorage

export interface SavedDashboard {
    id: string;
    name: string;
    description?: string;
    schema: any; // UIComponentSchemaType
    createdAt: string;
    updatedAt: string;
    thumbnail?: string;
}

const STORAGE_KEY = 'genui_dashboards';

// Generate unique ID
function generateId(): string {
    return `dash_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// Get all saved dashboards
export function getSavedDashboards(): SavedDashboard[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

// Get a single dashboard by ID
export function getDashboard(id: string): SavedDashboard | null {
    const dashboards = getSavedDashboards();
    return dashboards.find(d => d.id === id) || null;
}

// Save a new dashboard
export function saveDashboard(
    name: string,
    schema: any,
    description?: string
): SavedDashboard {
    const dashboards = getSavedDashboards();

    const newDashboard: SavedDashboard = {
        id: generateId(),
        name,
        description,
        schema,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    dashboards.unshift(newDashboard); // Add to beginning
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));

    return newDashboard;
}

// Update existing dashboard
export function updateDashboard(
    id: string,
    updates: Partial<Pick<SavedDashboard, 'name' | 'description' | 'schema'>>
): SavedDashboard | null {
    const dashboards = getSavedDashboards();
    const index = dashboards.findIndex(d => d.id === id);

    if (index === -1) return null;

    dashboards[index] = {
        ...dashboards[index],
        ...updates,
        updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboards));
    return dashboards[index];
}

// Delete a dashboard
export function deleteDashboard(id: string): boolean {
    const dashboards = getSavedDashboards();
    const filtered = dashboards.filter(d => d.id !== id);

    if (filtered.length === dashboards.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
}

// Duplicate a dashboard
export function duplicateDashboard(id: string): SavedDashboard | null {
    const original = getDashboard(id);
    if (!original) return null;

    return saveDashboard(
        `${original.name} (Copy)`,
        original.schema,
        original.description
    );
}

// Export dashboard as JSON
export function exportDashboard(id: string): string | null {
    const dashboard = getDashboard(id);
    if (!dashboard) return null;

    return JSON.stringify(dashboard, null, 2);
}

// Import dashboard from JSON
export function importDashboard(jsonString: string): SavedDashboard | null {
    try {
        const data = JSON.parse(jsonString);

        if (!data.name || !data.schema) {
            throw new Error('Invalid dashboard format');
        }

        return saveDashboard(
            data.name,
            data.schema,
            data.description
        );
    } catch {
        return null;
    }
}

// Format date for display
export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
}
