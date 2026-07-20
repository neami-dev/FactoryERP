"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QualityTable } from "./QualityTable";
import { CreateQualityModal } from "./CreateQualityModal";
import { IQuality } from "@/interfaces";
 

export default function Quality({ qualities }: { qualities?: IQuality[] }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Qualités
          </h1>
          <p className="text-gray-600">
            Gérez les différents niveaux de qualité des produits
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#3354f4] hover:bg-[#2c4bb2] cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle Qualité
        </Button>
      </div>

      {/* Search and Table */}
      <Card className="shadow-sm w-full mx-auto">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Liste des Qualités
            </CardTitle>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par titre ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QualityTable qualities={qualities} searchTerm={searchTerm} />
        </CardContent>
      </Card>

      {/* Create Quality Modal */}
      <CreateQualityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
