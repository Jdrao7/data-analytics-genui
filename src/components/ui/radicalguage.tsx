"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"

interface RadialGaugeProps {
  title: string
  value: number
  maxValue?: number
  label?: string
  color?: string
}

export function RadialGauge({ title, value, maxValue = 100, label, color = "hsl(var(--chart-1))" }: RadialGaugeProps) {
  const percentage = (value / maxValue) * 100
  const chartData = [{ name: title, value: percentage, fill: color }]

  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color: color,
    },
  }

  return (
    <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground text-balance">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ChartContainer config={chartConfig} className="h-[180px] w-full">
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90 - (percentage * 360) / 100}
            innerRadius={60}
            outerRadius={90}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar background={{ fill: "hsl(var(--muted))" }} dataKey="value" cornerRadius={10} />
          </RadialBarChart>
        </ChartContainer>
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold">{value}</div>
          {label && <div className="text-xs text-muted-foreground mt-1">{label}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
