// Data types for GenUI Dashboard Builder

export interface DataColumn {
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    sampleValues: any[];
}

export interface DataSource {
    id: string;
    name: string;
    type: 'csv' | 'json' | 'pdf' | 'api';
    columns: DataColumn[];
    data: Record<string, any>[];
    createdAt: Date;
    rowCount: number;
    rawText?: string; // For PDF text content
}

export interface DataStore {
    sources: DataSource[];
    activeSourceId: string | null;
}

// Helper to detect column type
export function detectColumnType(values: any[]): DataColumn['type'] {
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');

    if (nonEmptyValues.length === 0) return 'string';

    // Check if all values are numbers
    const allNumbers = nonEmptyValues.every(v => {
        const num = Number(v);
        return !isNaN(num) && isFinite(num);
    });
    if (allNumbers) return 'number';

    // Check if all values are dates
    const allDates = nonEmptyValues.every(v => {
        const date = new Date(v);
        return !isNaN(date.getTime());
    });
    if (allDates) return 'date';

    // Check if all values are booleans
    const allBooleans = nonEmptyValues.every(v =>
        v === true || v === false || v === 'true' || v === 'false'
    );
    if (allBooleans) return 'boolean';

    return 'string';
}

// Parse CSV string to data
export function parseCSV(csvString: string): { columns: DataColumn[], data: Record<string, any>[] } {
    const lines = csvString.trim().split('\n');
    if (lines.length < 2) {
        throw new Error('CSV must have at least a header row and one data row');
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);

    // Parse data rows
    const data: Record<string, any>[] = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const row: Record<string, any> = {};
        headers.forEach((header, idx) => {
            row[header] = values[idx] ?? '';
        });
        data.push(row);
    }

    // Detect column types
    const columns: DataColumn[] = headers.map(name => {
        const values = data.map(row => row[name]);
        const type = detectColumnType(values);

        // Convert numeric columns
        if (type === 'number') {
            data.forEach(row => {
                row[name] = Number(row[name]) || 0;
            });
        }

        return {
            name,
            type,
            sampleValues: values.slice(0, 5)
        };
    });

    return { columns, data };
}

// Helper to parse CSV line (handles quoted values)
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }

    result.push(current.trim());
    return result;
}

// Parse JSON data
export function parseJSONData(jsonString: string): { columns: DataColumn[], data: Record<string, any>[] } {
    const parsed = JSON.parse(jsonString);

    // Handle array of objects
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object') {
        const data = parsed as Record<string, any>[];
        const allKeys = new Set<string>();
        data.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));

        const columns: DataColumn[] = Array.from(allKeys).map(name => {
            const values = data.map(row => row[name]);
            return {
                name,
                type: detectColumnType(values),
                sampleValues: values.slice(0, 5)
            };
        });

        return { columns, data };
    }

    throw new Error('JSON must be an array of objects');
}

// Generate unique ID
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

// Create data source from parsed data
export function createDataSource(
    name: string,
    type: DataSource['type'],
    columns: DataColumn[],
    data: Record<string, any>[]
): DataSource {
    return {
        id: generateId(),
        name,
        type,
        columns,
        data,
        createdAt: new Date(),
        rowCount: data.length
    };
}

// Sample datasets for quick start
export const SAMPLE_DATASETS = {
    sales: {
        name: 'Sales Data (Sample)',
        data: [
            { month: 'Jan', revenue: 45000, orders: 320, customers: 180 },
            { month: 'Feb', revenue: 52000, orders: 380, customers: 210 },
            { month: 'Mar', revenue: 48000, orders: 350, customers: 195 },
            { month: 'Apr', revenue: 61000, orders: 420, customers: 240 },
            { month: 'May', revenue: 55000, orders: 390, customers: 220 },
            { month: 'Jun', revenue: 67000, orders: 480, customers: 275 },
        ]
    },
    marketing: {
        name: 'Marketing Data (Sample)',
        data: [
            { channel: 'Organic', visitors: 45000, leads: 1200, conversions: 180 },
            { channel: 'Paid Search', visitors: 32000, leads: 950, conversions: 145 },
            { channel: 'Social', visitors: 28000, leads: 680, conversions: 95 },
            { channel: 'Email', visitors: 15000, leads: 520, conversions: 85 },
            { channel: 'Referral', visitors: 8500, leads: 340, conversions: 62 },
        ]
    },
    products: {
        name: 'Product Data (Sample)',
        data: [
            { product: 'Product A', sales: 125000, units: 850, rating: 4.5 },
            { product: 'Product B', sales: 98000, units: 720, rating: 4.2 },
            { product: 'Product C', sales: 76000, units: 580, rating: 4.7 },
            { product: 'Product D', sales: 54000, units: 420, rating: 3.9 },
            { product: 'Product E', sales: 32000, units: 280, rating: 4.1 },
        ]
    }
};
