"use client"

import { cn } from "@/lib/utils"

export function Empty({
    title = "No data",
    description,
    className
}: {
    title?: string
    description?: string
    className?: string
}) {
    return (
        <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
            <div className="mb-4 h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center">
                <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-300">{title}</h3>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
    )
}
