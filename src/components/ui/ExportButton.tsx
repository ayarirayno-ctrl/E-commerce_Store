import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: unknown[];
  filename: string;
  format?: 'csv' | 'json';
  label?: string;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  filename,
  format = 'csv',
  label = 'Exporter',
}) => {
  const exportToCSV = () => {
    if (data.length === 0) return;

    // Récupérer les clés (colonnes)
    const headers = Object.keys(data[0] as object);
    
    // Créer le CSV
    const csvContent = [
      headers.join(','), // En-têtes
      ...data.map(row => 
        headers.map(header => {
          const value = (row as Record<string, unknown>)[header];
          // Échapper les valeurs contenant des virgules ou des guillemets
          const stringValue = String(value ?? '');
          return stringValue.includes(',') || stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue;
        }).join(',')
      ),
    ].join('\n');

    // Télécharger
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.json`;
    link.click();
  };

  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title={`Exporter en ${format.toUpperCase()}`}
    >
      <Download className="w-5 h-5" />
      {label} ({format.toUpperCase()})
    </button>
  );
};

export default ExportButton;
