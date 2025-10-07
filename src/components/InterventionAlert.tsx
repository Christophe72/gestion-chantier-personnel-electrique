import React from "react";

interface Intervention {
  id: number;
  title: string;
  date: string;
  status: string;
}

interface InterventionAlertProps {
  interventions: Intervention[];
}

export default function InterventionAlert({
  interventions,
}: InterventionAlertProps) {
  const now = new Date();
  const lateInterventions = interventions.filter(
    (intervention) =>
      new Date(intervention.date) < now && intervention.status !== "Terminée"
  );

  if (lateInterventions.length === 0) return null;

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6 font-semibold shadow text-center">
      ⚠️ {lateInterventions.length} intervention
      {lateInterventions.length > 1 ? "s" : ""} en retard !
      <ul className="mt-2 text-sm list-disc list-inside">
        {lateInterventions.map((intervention) => (
          <li key={intervention.id}>
            {intervention.title} - Date prévue :{" "}
            {new Date(intervention.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
