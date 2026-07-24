"use client";
import { useState, useEffect } from "react";
import { InvoiceDashboardSkeleton } from "./InvoiceDashboardSkeleton";
import { InvoiceFilters } from "./InvoiceFilters";
import { InvoiceKPICards } from "./InvoiceKPICardsProps";
import { InvoiceComparison } from "./InvoiceComparison";
import { InvoiceCharts } from "./InvoiceCharts";
import { IncompleteInvoicesTable } from "./IncompleteInvoicesTable";

export function InvoiceDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: "current-month",
    company: "all",
    category: "all",
  });

  useEffect(() => {
    // Simuler un chargement de données
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <InvoiceDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Tableau de Bord Factures
          </h1>
          <p className="text-gray-600">
            Suivi des factures et analyse des revenus
          </p>
        </div>
        {/* <InvoiceFilters filters={filters} onFiltersChange={setFilters} /> */}
      </div>

      {/* KPI Cards */}
      <InvoiceKPICards />

      {/* Comparison Widget */}
      <InvoiceComparison />

      {/* Charts Section */}
      <InvoiceCharts />

      {/* Incomplete Invoices Table */}
      <IncompleteInvoicesTable />
    </div>
  );
}
