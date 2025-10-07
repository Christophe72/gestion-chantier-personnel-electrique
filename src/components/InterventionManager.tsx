import React, { useState, useEffect } from "react";
import { useClients } from "./ClientManager";
import { useElectricians } from "./ElectricianManager";

interface Intervention {
  id: number;
  title: string;
  description?: string;
  date: string;
  status: string;
  clientId: number;
  electricianId: number;
}

export function useInterventions() {
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/interventions");
      const data = await res.json();
      setInterventions(data);
    } catch (e) {
      setError("Erreur lors de la récupération des interventions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  const addIntervention = async (intervention: Omit<Intervention, "id">) => {
    setError("");
    try {
      const res = await fetch("/api/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intervention),
      });
      if (res.ok) {
        fetchInterventions();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de l'ajout");
      }
    } catch (e) {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateIntervention = async (intervention: Intervention) => {
    setError("");
    try {
      const res = await fetch("/api/interventions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(intervention),
      });
      if (res.ok) {
        fetchInterventions();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la modification");
      }
    } catch (e) {
      setError("Erreur lors de la modification");
    }
  };

  const deleteIntervention = async (id: number) => {
    setError("");
    try {
      const res = await fetch("/api/interventions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchInterventions();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la suppression");
      }
    } catch (e) {
      setError("Erreur lors de la suppression");
    }
  };

  return {
    interventions,
    loading,
    error,
    addIntervention,
    updateIntervention,
    deleteIntervention,
  };
}

export default function InterventionManager() {
  const {
    interventions,
    loading,
    error,
    addIntervention,
    updateIntervention,
    deleteIntervention,
  } = useInterventions();
  const { clients } = useClients();
  const { electricians } = useElectricians();
  const [form, setForm] = useState<Omit<Intervention, "id">>({
    title: "",
    description: "",
    date: "",
    status: "Planifiée",
    clientId: clients.length > 0 ? clients[0].id : 0,
    electricianId: electricians.length > 0 ? electricians[0].id : 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Intervention, "id">>(form);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const toISODate = (date: string) => {
    if (!date) return "";
    if (date.length > 10) return date;
    return new Date(date).toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIntervention({
      ...form,
      date: toISODate(form.date),
      clientId: Number(form.clientId),
      electricianId: Number(form.electricianId),
    });
    setForm({
      title: "",
      description: "",
      date: "",
      status: "Planifiée",
      clientId: 0,
      electricianId: 0,
    });
  };

  const startEdit = (intervention: Intervention) => {
    setEditId(intervention.id);
    setEditForm({
      title: intervention.title,
      description: intervention.description || "",
      date: intervention.date.slice(0, 10),
      status: intervention.status,
      clientId: intervention.clientId,
      electricianId: intervention.electricianId,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateIntervention({
        id: editId,
        ...editForm,
        date: toISODate(editForm.date),
        clientId: Number(editForm.clientId),
        electricianId: Number(editForm.electricianId),
      });
      setEditId(null);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <h2 className="text-xl font-bold mb-6">Gestion des interventions</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-2">
        <input
          type="text"
          name="title"
          placeholder="Titre"
          value={form.title}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={form.date}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="Planifiée">Planifiée</option>
          <option value="En cours">En cours</option>
          <option value="Terminée">Terminée</option>
          <option value="Facturée">Facturée</option>
        </select>
        <select
          name="clientId"
          value={form.clientId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <select
          name="electricianId"
          value={form.electricianId}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          {electricians.map((electrician) => (
            <option key={electrician.id} value={electrician.id}>
              {electrician.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </form>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul className="space-y-2">
          {interventions.map((intervention) => (
            <li key={intervention.id} className="border p-2 rounded">
              {editId === intervention.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  >
                    <option value="Planifiée">Planifiée</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Facturée">Facturée</option>
                  </select>
                  <select
                    name="clientId"
                    value={editForm.clientId}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  >
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="electricianId"
                    value={editForm.electricianId}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  >
                    {electricians.map((electrician) => (
                      <option key={electrician.id} value={electrician.id}>
                        {electrician.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Annuler
                  </button>
                </form>
              ) : (
                <>
                  <strong>{intervention.title}</strong> — {intervention.status}
                  <br />
                  {intervention.description && (
                    <span>
                      {intervention.description}
                      <br />
                    </span>
                  )}
                  <span>
                    Date : {new Date(intervention.date).toLocaleDateString()}
                    <br />
                  </span>
                  <span>
                    ID client : {intervention.clientId} | ID électricien :{" "}
                    {intervention.electricianId}
                  </span>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(intervention)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteIntervention(intervention.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Supprimer
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
