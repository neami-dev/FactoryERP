
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Pie, Cell } from "recharts";

 

export function InvoiceCharts( ) {
  // Données simulées - à remplacer par de vraies données API
  const monthlyRevenue = [
    { month: "Jan", revenue: 35000 },
    { month: "Fév", revenue: 42000 },
    { month: "Mar", revenue: 38000 },
    { month: "Avr", revenue: 45000 },
    { month: "Mai", revenue: 52000 },
    { month: "Jun", revenue: 48000 },
  ];

  const topCompanies = [
    { name: "Société Atlantique", invoices: 45, revenue: 18500 },
    { name: "Poissons du Nord", invoices: 32, revenue: 15200 },
    { name: "Marée Fraîche", invoices: 28, revenue: 12800 },
    { name: "Océan Bleu", invoices: 22, revenue: 9600 },
    { name: "Autres", invoices: 15, revenue: 6900 },
  ];

  const categoryData = [
    { name: "Saumon", weight: 4500, color: "#3354f4" },
    { name: "Thon", weight: 3200, color: "#60a5fa" },
    { name: "Cabillaud", weight: 2800, color: "#34d399" },
    { name: "Maquereau", weight: 2250, color: "#fbbf24" },
  ];

  const chartConfig = {
    revenue: {
      label: "Chiffre d'affaires",
      color: "#3354f4",
    },
    invoices: {
      label: "Factures",
      color: "#60a5fa",
    },
    weight: {
      label: "Poids",
      color: "#34d399",
    },
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Évolution mensuelle du CA */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Évolution Mensuelle du CA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Top entreprises */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Top Entreprises
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={topCompanies} layout="horizontal">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Répartition par catégorie */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Répartition par Catégorie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="weight"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tendance des facturations */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Tendance des Facturations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={monthlyRevenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-revenue)" 
                strokeWidth={3}
                dot={{ fill: "var(--color-revenue)", strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
