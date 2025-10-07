"use client";
import InterventionManager from "../../components/InterventionManager";
import InterventionAlert from "../../components/InterventionAlert";
import { useInterventions } from "../../components/InterventionManager";

export default function InterventionsPage() {
  const { interventions } = useInterventions();

  return (
    <div>
      <InterventionAlert interventions={interventions} />
      <InterventionManager />
    </div>
  );
}
