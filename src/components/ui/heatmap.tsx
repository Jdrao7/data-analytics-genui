"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface HeatmapCardProps {
  title: string
  description?: string
  data: Array<{
    day: string
    hour: string
    value: number
  }>
}

export function HeatmapCard({ title, description, data }: HeatmapCardProps) {
  const days = [...new Set(data.map((d) => d.day))]
  const hours = [...new Set(data.map((d) => d.hour))]
  const maxValue = Math.max(...data.map((d) => d.value))

  const getValue = (day: string, hour: string) => {
    const item = data.find((d) => d.day === day && d.hour === hour)
    return item ? item.value : 0
  }

  const getOpacity = (value: number) => {
    return (value / maxValue) * 0.9 + 0.1
  }

  return (
    <Card className="glass-strong border-border/50">
      <CardHeader>
        <CardTitle className="text-balance">{title}</CardTitle>
        {description && <CardDescription className="text-balance">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <div className="w-12 text-xs text-muted-foreground">{day}</div>
              <div className="flex gap-1 flex-1">
                {hours.map((hour) => {
                  const value = getValue(day, hour)
                  return (
                    <div
                      key={hour}
                      className={cn(
                        "flex-1 h-8 rounded-sm transition-all duration-200 hover:scale-110 cursor-pointer",
                        "bg-primary",
                      )}
                      style={{ opacity: getOpacity(value) }}
                      title={`${day} ${hour}: ${value}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            {hours.map((hour) => (
              <span key={hour}>{hour}</span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
