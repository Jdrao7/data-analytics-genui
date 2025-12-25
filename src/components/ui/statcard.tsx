import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpIcon, ArrowDownIcon, type LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, trend = "neutral" }: StatCardProps) {
  return (
    <Card className="bg-[rgba(17,24,39,0.7)] backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 text-white shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-balance">{value}</div>
        {change !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
              className="gap-1 px-2"
            >
              {trend === "up" ? (
                <ArrowUpIcon className="size-3" />
              ) : trend === "down" ? (
                <ArrowDownIcon className="size-3" />
              ) : null}
              <span>{Math.abs(change)}%</span>
            </Badge>
            <span className="text-xs text-muted-foreground">{changeLabel || "vs last period"}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
