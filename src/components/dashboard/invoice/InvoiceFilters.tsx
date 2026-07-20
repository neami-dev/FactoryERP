import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CalendarDays } from "lucide-react";
type InvoiceFilterKey = "dateRange" | "company" | "category";
interface InvoiceFiltersValues {
  dateRange: string;
  company: string;
  category: string;
}

interface InvoiceFiltersProps {
  filters: {
    dateRange: string;
    company: string;
    category: string;
  };
  onFiltersChange: (filters: InvoiceFiltersValues) => void;
}

export function InvoiceFilters({
  filters,
  onFiltersChange,
}: InvoiceFiltersProps) {
  const handleFilterChange = (key: InvoiceFilterKey, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center space-x-2">
        <Select
          value={filters.dateRange}
          onValueChange={(value) => handleFilterChange("dateRange", value)}
        >
          <SelectTrigger className="w-[180px]">
            <CalendarDays className="h-4 w-4 text-gray-600" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Aujourd&apos;hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="current-month">Ce mois</SelectItem>
            <SelectItem value="last-month">Mois dernier</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
            <SelectItem value="custom">Période personnalisée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select
        value={filters.company}
        onValueChange={(value) => handleFilterChange("company", value)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Entreprise" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes les entreprises</SelectItem>
          <SelectItem value="atlantique">Société Atlantique</SelectItem>
          <SelectItem value="nord">Poissons du Nord</SelectItem>
          <SelectItem value="fraiche">Marée Fraîche</SelectItem>
          <SelectItem value="bleu">Océan Bleu</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.category}
        onValueChange={(value) => handleFilterChange("category", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes catégories</SelectItem>
          <SelectItem value="salmon">Saumon</SelectItem>
          <SelectItem value="tuna">Thon</SelectItem>
          <SelectItem value="cod">Cabillaud</SelectItem>
          <SelectItem value="mackerel">Maquereau</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
