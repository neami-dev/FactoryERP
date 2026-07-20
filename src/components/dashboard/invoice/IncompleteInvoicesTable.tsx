
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

 

export function IncompleteInvoicesTable( ) {
  // Données simulées - à remplacer par de vraies données API
  const incompleteData = [
    {
      receptionId: "REC-001",
      date: "2024-01-15",
      company: "Société Atlantique",
      expectedWeight: 1250.5,
      invoicedWeight: 1000.0,
      difference: -250.5,
      coverage: 80.0,
      status: "incomplete"
    },
    {
      receptionId: "REC-004",
      date: "2024-01-18",
      company: "Poissons du Nord",
      expectedWeight: 750.0,
      invoicedWeight: 0,
      difference: -750.0,
      coverage: 0,
      status: "missing"
    },
    {
      receptionId: "REC-007",
      date: "2024-01-20",
      company: "Marée Fraîche",
      expectedWeight: 980.2,
      invoicedWeight: 650.0,
      difference: -330.2,
      coverage: 66.3,
      status: "incomplete"
    },
    {
      receptionId: "REC-012",
      date: "2024-01-22",
      company: "Océan Bleu",
      expectedWeight: 1150.8,
      invoicedWeight: 920.5,
      difference: -230.3,
      coverage: 80.0,
      status: "incomplete"
    },
  ];

  const getStatusBadge = (status: string, coverage: number) => {
    if (status === "missing" || coverage === 0) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Non facturé
        </Badge>
      );
    } else if (coverage < 70) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Critique
        </Badge>
      );
    } else if (coverage < 90) {
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Incomplet
        </Badge>
      );
    } else {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Bon
        </Badge>
      );
    }
  };

  const formatWeight = (weight: number) => {
    return `${weight.toLocaleString('fr-FR')} kg`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR');
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Réceptions avec Factures Incomplètes
        </CardTitle>
        <p className="text-sm text-gray-600">
          Liste des réceptions nécessitant une attention particulière
        </p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Réception</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entreprise</TableHead>
                <TableHead className="text-right">Poids Attendu</TableHead>
                <TableHead className="text-right">Poids Facturé</TableHead>
                <TableHead className="text-right">Différence</TableHead>
                <TableHead className="text-right">% Couverture</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incompleteData.map((item) => (
                <TableRow key={item.receptionId} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{item.receptionId}</TableCell>
                  <TableCell>{formatDate(item.date)}</TableCell>
                  <TableCell>{item.company}</TableCell>
                  <TableCell className="text-right">{formatWeight(item.expectedWeight)}</TableCell>
                  <TableCell className="text-right">{formatWeight(item.invoicedWeight)}</TableCell>
                  <TableCell className={`text-right font-medium ${item.difference < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {item.difference < 0 ? '' : '+'}{formatWeight(item.difference)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={item.coverage < 70 ? 'text-red-600' : item.coverage < 90 ? 'text-yellow-600' : 'text-green-600'}>
                      {item.coverage.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status, item.coverage)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
