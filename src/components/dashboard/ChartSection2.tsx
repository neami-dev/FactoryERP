
"use client";
import { dashboardComponentsProps } from "@/app/dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesInfos } from "@/hooks/useCategoriesInfos";
import { useDailyReceptionWrappingStats } from "@/hooks/useDailyReceptionWrappingStats";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
 import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { useCategoryWeightTypeStatsRes } from "@/hooks/useCategoryWeightTypeStatsRes";
import { useCategoryWeightTypeStatsWrap } from "@/hooks/useCategoryWeightTypeStatsWrap";
import { Skeleton } from "@/components/ui/skeleton";
``
// Same meaning-mapped palette as KPICards
const PALETTE = {
  teal: "#1C7C8C",
  coral: "#FF7A59",
  amber: "#E8A33D",
  mint: "#2F9E7A",
  navy: "#0F2C3B",
};

type RankedEntry = { name: string; value: number; color: string; percentage: number };

function transformCategoryWeightTypeStats(
  data: {
    category: string;
    types: { type: string; totalWeight: number; color: string }[];
  }[]
) {
  const colorMap: ChartConfig = {};

  const chartData = data.map((entry) => {
    const row: Record<string, number | string> = { category: entry.category };
    entry.types.forEach((type) => {
      row[type.type] = type.totalWeight;
      colorMap[type.type] = { label: type.type, color: type.color };
    });
    return row;
  });

  return { chartData, colorMap };
}

/** A sorted horizontal bar list — replaces a donut + separate legend list with
 * a single chart where rank and magnitude are both readable at a glance. */
function RankedBarList({
  title,
  subtitle,
  data,
  isLoading,
}: {
  title: string;
  subtitle: string;
  data?: RankedEntry[];
  isLoading?: boolean;
}) {
  const sorted = [...(data ?? [])].sort((a, b) => b.value - a.value);

  return (
    <Card className="border-0 shadow-sm flex-1 min-w-[320px]">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : sorted.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
            Aucune donnée pour cette période
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((entry) => (
              <div key={entry.name}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-sm text-foreground/80">{entry.name}</span>
                  <span className="text-xs font-mono tabular-nums text-muted-foreground">
                    {new Intl.NumberFormat("fr-FR").format(entry.value)} kg
                    <span className="ml-1.5 text-muted-foreground/70">
                      ({entry.percentage}%)
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(entry.percentage, 2)}%`,
                      backgroundColor: entry.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function WeightTypeStackedBars({
  title,
  chartData,
  colorMap,
  isLoading,
}: {
  title: string;
  chartData: Record<string, number | string>[];
  colorMap: ChartConfig;
  isLoading?: boolean;
}) {
  return (
    <Card className="border-0 shadow-sm flex-1 min-w-[320px]">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">Répartition par calibre (kg)</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[260px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-sm text-muted-foreground">
            Aucune donnée pour cette période
          </div>
        ) : (
          <ChartContainer config={colorMap} className="h-[260px] w-full">
            <BarChart data={chartData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis axisLine={false} tickLine={false} fontSize={12} width={40} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} kg`, name]}
              />
              {Object.entries(colorMap).map(([type, cfg]) => (
                <Bar
                  key={type}
                  dataKey={type}
                  stackId="weight"
                  fill={cfg.color}
                  name={type}
                  radius={[0, 0, 0, 0]}
                />
              ))}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default function ChartsSection2({
  period = "month",
  startDate,
  endDate,
}: dashboardComponentsProps) {
  const { data: categoriesInfo } = useCategoriesInfos({ period, startDate, endDate });

  const { data: dailyStats, isLoading: dailyStatsLoading } =
    useDailyReceptionWrappingStats({ period, startDate, endDate });

  const { data: statsRes, isLoading: statsResLoading } =
    useCategoryWeightTypeStatsRes({ period, startDate, endDate });

  const { data: statsWrap, isLoading: statsWrapLoading } =
    useCategoryWeightTypeStatsWrap({ period, startDate, endDate });

  const { chartData: chartDataRes, colorMap: colorMapRes } =
    transformCategoryWeightTypeStats(statsRes ?? []);
  const { chartData: chartDataWrap, colorMap: colorMapWrap } =
    transformCategoryWeightTypeStats(statsWrap ?? []);

  const dailyChartConfig: ChartConfig = {
    receptions: { label: "Réceptions", color: PALETTE.teal },
    wrappings: { label: "Emballages", color: PALETTE.coral },
  };

  return (
    <div className="space-y-6">
      {/* Daily trend — area chart reads as a trend, not a per-day comparison */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Activité quotidienne
          </CardTitle>
          <p className="text-xs text-muted-foreground">Réceptions vs emballages sur la période</p>
        </CardHeader>
        <CardContent>
          {dailyStatsLoading ? (
            <Skeleton className="h-[280px] w-full" />
          ) : !dailyStats || dailyStats.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              Aucune donnée pour cette période
            </div>
          ) : (
            <ChartContainer config={dailyChartConfig} className="h-[280px] w-full">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="fillReceptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.teal} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={PALETTE.teal} stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="fillWrappings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.coral} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={PALETTE.coral} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} interval={0} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  fontSize={12}
                  width={30}
                  tickFormatter={(value) => Math.floor(value).toString()}
                  domain={[0, "dataMax + 1"]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="receptions"
                  stroke={PALETTE.teal}
                  strokeWidth={2}
                  fill="url(#fillReceptions)"
                />
                <Area
                  type="monotone"
                  dataKey="wrappings"
                  stroke={PALETTE.coral}
                  strokeWidth={2}
                  fill="url(#fillWrappings)"
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      {/* Wrapping: calibre breakdown + ranked category comparison, side by side */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Emballage
        </h3>
        <div className="flex gap-4 flex-wrap">
          <WeightTypeStackedBars
            title="Poids emballé par calibre"
            chartData={chartDataWrap}
            colorMap={colorMapWrap}
            isLoading={statsWrapLoading}
          />
          <RankedBarList
            title="Espace emballé par catégorie"
            subtitle="Classé par poids (kg)"
            data={categoriesInfo?.wrapped}
          />
        </div>
      </div>

      {/* Reception: same pairing */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Réception
        </h3>
        <div className="flex gap-4 flex-wrap">
          <WeightTypeStackedBars
            title="Poids reçu par calibre"
            chartData={chartDataRes}
            colorMap={colorMapRes}
            isLoading={statsResLoading}
          />
          <RankedBarList
            title="Espace à la réception par catégorie"
            subtitle="Classé par poids (kg)"
            data={categoriesInfo?.notWrapped}
          />
        </div>
      </div>
    </div>
  );
}