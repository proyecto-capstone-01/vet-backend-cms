'use client'

import * as React from "react"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface PieChartData {
    name: string
    value: number
    fill: string
}

interface GenericPieChartProps {
    title: string
    description?: string
    data: PieChartData[]
}

export function GenericPieChart({
    title,
    description,
    data,
}: GenericPieChartProps) {


  return (
        <Card className="@container/card">
        <CardHeader className="items-center pb-0">
            <CardTitle>{title}</CardTitle>
            {description && (
            <CardDescription className="text-muted-foreground">
                {description}
            </CardDescription>
            )}
        </CardHeader>

        <div className="flex justify-center p-4"> {/* Contenedor para centrar el gráfico */}
          {/*// @ts-ignore*/}
            <ChartContainer
            config={Object.fromEntries(
                data.map((item) => [item.name, { label: item.name, color: item.fill }])
            )}
            className="aspect-square h-[250px] sm:h-[300px] w-full max-w-[300px] sm:max-w-[400px]"
            >
            <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={0}
                outerRadius={100}
                strokeWidth={0}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                </Pie>
            </PieChart>
            <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </ChartContainer>
        </div>
        </Card>
    )
}