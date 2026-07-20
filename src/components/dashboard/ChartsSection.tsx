"use client";
import { dashboardComponentsProps } from "@/app/dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategoriesInfos } from "@/hooks/useCategoriesInfos";
import { useDailyReceptionWrappingStats } from "@/hooks/useDailyReceptionWrappingStats";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "../ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { useCategoryWeightTypeStatsRes } from "@/hooks/useCategoryWeightTypeStatsRes";
import { useCategoryWeightTypeStatsWrap } from "@/hooks/useCategoryWeightTypeStatsWrap";

export default function ChartsSection({
  period = "month",
  startDate,
  endDate,
}: dashboardComponentsProps) {
  const { data: categoriesInfo } = useCategoriesInfos({
    period,
    startDate,
    endDate,
  });

  const {
    data: dailyReceptionWrappingStats,
    isLoading: dailyRWStatsIsLoading,
  } = useDailyReceptionWrappingStats({
    period,
    startDate,
    endDate,
  });

  const { data: categoryWeightTypeStatsRes } = useCategoryWeightTypeStatsRes({
    period,
    startDate,
    endDate,
  });

  const { data: categoryWeightTypeStatsWrap } = useCategoryWeightTypeStatsWrap({
    period,
    startDate,
    endDate,
  });
 

  const transformCategoryWeightTypeStats = (
    data: {
      category: string;
      types: { type: string; totalWeight: number; color: string }[];
    }[]
  ) => {
    const colorMap: Record<
      string,
      {
        label?: React.ReactNode;
        icon?: React.ComponentType<unknown>;
      } & (
        | { color: string; theme?: undefined }
        | { color?: undefined; theme: Record<"light" | "dark", string> }
      )
    > = {};

    const chartData = data.map((entry) => {
      const row: Record<string, number | string> = { category: entry.category };
      entry.types.forEach((type) => {
        row[type.type] = type.totalWeight;
        colorMap[type.type] = { color: type.color }; // Only 'color', no 'theme'
      });
      return row;
    });

    return { chartData, colorMap };
  };
  const { chartData: chartDataRes, colorMap: colorMapRes } =
    transformCategoryWeightTypeStats(categoryWeightTypeStatsRes ?? []);

  const { chartData: chartDataWrap, colorMap: colorMapWrap } =
    transformCategoryWeightTypeStats(categoryWeightTypeStatsWrap ?? []);
 
  const wrappedfishCategories = categoriesInfo?.wrapped;
  const notWrappedfishCategories = categoriesInfo?.notWrapped;
  return (
    <div>
      <div className=" my-8">
        {/* Daily Receptions vs Wrappings */}
        <Card className="border-0 shadow-sm ">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Activité quotidienne
            </CardTitle>
            <p className="text-sm text-gray-500">Réceptions vs Réceptions</p>
          </CardHeader>
          <CardContent>
            {dailyReceptionWrappingStats ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyReceptionWrappingStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" stroke="#64748b" interval={0} />
                  <YAxis
                    stroke="#64748b"
                    tickFormatter={(value) => Math.floor(value).toString()}
                    domain={[0, "dataMax + 1"]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="receptions"
                    fill="#3354f4"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="wrappings"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : dailyRWStatsIsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : null}
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-around gap-6 my-8 flex-wrap border rounded-lg shadow-md ">
        <Card className="shadow-none border-0">
          <h3 className="text-lg font-semibold">
            Poids de la taille d&apos;espase Emballé
          </h3>
          <p className="text-sm text-gray-500">Partage en poids (kg)</p>
          <div className="w-full">
            <ChartContainer config={colorMapWrap} className="h-[300px]">
              <BarChart data={chartDataWrap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value} kg `, name]}
                />
                {Object.entries(colorMapWrap).map(([type, color]) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    fill={color.color}
                    name={type}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
        {/* Fish Categories wrapped */}
        <Card className="shadow-none border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Espase Emballé
            </CardTitle>
            <p className="text-sm text-gray-500">Partage en poids (%)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={wrappedfishCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {wrappedfishCategories?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {wrappedfishCategories?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.percentage} %
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {category.value} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div
        className={`flex justify-around gap-6 my-8 flex-wrap border rounded-lg shadow-md `}
      >
        <Card className="shadow-none border-0 ">
          <h3 className="text-lg font-semibold">
            Poids de la taille d&apos;espase resption
          </h3>
          <p className="text-sm text-gray-500">Partage en poids (kg)</p>
          <div className="w-full">
            <ChartContainer config={colorMapRes} className="h-[300px]">
              <BarChart data={chartDataRes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`${value} kg `, name]}
                />
                {Object.entries(colorMapRes).map(([type, color]) => (
                  <Bar
                    key={type}
                    dataKey={type}
                    fill={color.color}
                    name={type}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ChartContainer>
          </div>
        </Card>
        {/* Fish Categories not wrapped */}
        <Card className="shadow-none border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Espace à la réception
            </CardTitle>
            <p className="text-sm text-gray-500">Partage en poids (%)</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                <Pie
                  data={notWrappedfishCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="percentage"
                >
                  {notWrappedfishCategories?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {notWrappedfishCategories?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {category.percentage} %
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {category.value} kg
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
