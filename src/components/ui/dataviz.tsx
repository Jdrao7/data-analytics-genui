"use client"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,


  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Spinner } from "@/components/ui/spinner"
import { Empty } from "@/components/ui/empty"

// TypeScript interface for props
export interface DataVizProps {
  title: string
  description: string
  chartType: "bar" | "line" | "area" | "pie"
  data: Array<Record<string, unknown>>
  config: ChartConfig
  loading?: boolean
  className?: string
}

// Animation variants for entry
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,  // easeOut cubic bezier
    },
  },
}

export function DataViz({ title, description, chartType, data, config, loading = false, className }: DataVizProps) {
  // Handle loading state
  if (loading) {
    return (
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Card className={className}>
          <CardHeader>
            <CardTitle className="text-balance">{title}</CardTitle>
            <CardDescription className="text-balance">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <Spinner className="size-8" />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Handle no data state
  if (!data || data.length === 0) {
    return (
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <Card className={className}>
          <CardHeader>
            <CardTitle className="text-balance">{title}</CardTitle>
            <CardDescription className="text-balance">{description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <Empty title="No data available" description="There is no data to display at the moment." />
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Render the appropriate chart based on chartType
  const renderChart = () => {
    const dataKeys = Object.keys(config).filter((key) => key !== "label")

    switch (chartType) {
      case "bar":
        return (
          <ChartContainer config={config} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {dataKeys.map((key) => (
                  <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={[8, 8, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "line":
        return (
          <ChartContainer config={config} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {dataKeys.map((key) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    strokeWidth={2}
                    dot={{ r: 4, fill: `var(--color-${key})` }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "area":
        return (
          <ChartContainer config={config} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {dataKeys.map((key) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={`var(--color-${key})`}
                    fill={`var(--color-${key})`}
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "pie":
        // For pie charts, we assume data has a 'value' field
        const COLORS = dataKeys.map((key) => `var(--color-${key})`)
        return (
          <ChartContainer config={config} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      default:
        return null
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-balance">{title}</CardTitle>
          <CardDescription className="text-balance">{description}</CardDescription>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>
    </motion.div>
  )
}
