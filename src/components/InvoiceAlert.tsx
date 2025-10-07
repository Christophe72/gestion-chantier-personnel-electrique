import React from "react";

interface Invoice {
  id: number;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
}

interface InvoiceAlertProps {
  invoices: Invoice[];
}

export default function InvoiceAlert({ invoices }: InvoiceAlertProps) {
  const now = new Date();
  const overdue = invoices.filter(
    (invoice) => invoice.status !== "Payée" && new Date(invoice.dueDate) < now
  );

  if (overdue.length === 0) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 font-semibold shadow text-center">
      ⚠️ {overdue.length} facture{overdue.length > 1 ? "s" : ""} en retard !
      <ul className="mt-2 text-sm list-disc list-inside">
        {overdue.map((invoice) => (
          <li key={invoice.id}>
            Facture #{invoice.id} - Échéance :{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
