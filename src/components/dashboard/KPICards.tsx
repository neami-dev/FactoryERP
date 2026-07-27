"use client";
import { dashboardComponentsProps } from "@/app/dashboard/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useReceptionsInfos } from "@/hooks/useReceptionsInfos";
import { Package, Package2, Scale, DollarSign } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { formatFloat } from "@/lib/utils";

export default function KPICards({
  period = "month",
  startDate,
  endDate,
}: dashboardComponentsProps) {
  const { data, isLoading } = useReceptionsInfos({
    period,
    startDate,
    endDate,
  });

  const kpiData = [
    {
      title: "Total Réceptions",
      value: data?.totalReptions,
      subtitle: "ce mois-ci",
      icon: Package,
      trend: "+12%",
      trendPositive: true,
      color:'#9EBC8A'
    },
    {
      title: "Total Poissons Emballés",
      value: `${data?.totalWeightRWrapped} kg`,
      subtitle: "ce mois-ci",
      icon: Package2,
      trend: "+8%",
      trendPositive: true,
      color:'#FFB22C'
    },
    {
      title: "Restant Non Emballé",
      value: `${data?.totalRNotWrapped}`,
      subtitle: "poids en attente",
      icon: Scale,
      trend: "-5%",
      trendPositive: false,
      color:'#347433'
    },
    {
      title: "Revenus Totaux",
      value: `${formatFloat(data?.totalPrice ?? 0 * 1)} Dh`,
      subtitle: "des factures",
      icon: DollarSign,
      trend: "+23%",
      trendPositive: true,
      color:'#F79B72'
    },
  ];
  return (
    <>
      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                {/* <Skeleton className="h-3 w-16 mb-2" /> */}
                <div className="flex items-center">
                  {/* <Skeleton className="h-3 w-8" /> */}
                  <Skeleton className="h-3 w-16 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 ">
        {data &&
          !isLoading &&
          kpiData.map((kpi, index) => (
            <Card
              key={index}
              className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.title}
                </CardTitle>
                <div className="w-10 h-10 bg-[#3354f4]/10 rounded-lg flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-[#3354f4]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {kpi.value}
                </div>
                <p className="text-xs text-gray-500 mb-2">{kpi.subtitle}</p>
                <div className="flex items-center">
                  <span
                    className={`text-xs font-medium ${
                      kpi.trendPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {/* {kpi.trend} */}
                  </span>
                  {/* <span className="text-xs text-gray-500 ml-1">
                du mois dernier
              </span> */}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </>
  );
}
