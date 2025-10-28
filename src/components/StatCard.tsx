"use client"

import { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCardProps {
  title: string
  description: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  percent?: string
  icon?: ReactNode
  footerMain?: string
  footerSub?: string
}

export function StatCard({
  title,
  description,
  value,
  trend = "neutral",
  percent,
  icon,
  footerMain,
  footerSub,
}: StatCardProps) {
  const isUp = trend === "up"
  const isDown = trend === "down"

  return (
    <Card className="@container/card transition-all hover:shadow-md hover:scale-[1.01]">
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {percent && (
          <CardAction>
            <Badge variant="outline" className="flex items-center gap-1">
              {icon}
              {isUp && <span className="text-green-600">+{percent}</span>}
              {isDown && <span className="text-red-600">-{percent}</span>}
              {!isUp && !isDown && <span>{percent}</span>}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      {(footerMain || footerSub) && (
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          {footerMain && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {footerMain}
              {icon && <span className="inline-block">{icon}</span>}
            </div>
          )}
          {footerSub && (
            <div className="text-muted-foreground">{footerSub}</div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}