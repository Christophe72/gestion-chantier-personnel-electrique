import React, { useState, useEffect } from "react";
import Link from "next/link";
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    clientId: 0,
    electricianId: 0,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIntervention({
      ...form,
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
        clientId: Number(editForm.clientId),
        electricianId: Number(editForm.electricianId),
      });
      setEditId(null);
      setEditForm(form);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(form);
  };

  return (
    <div className="font-sans min-h-screen p-4 md:p-8 bg-gray-50">
      <nav className="flex justify-center gap-4 mb-8">
        <Link
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Accueil
        </Link>
        <Link
          href="/clients"
          className="bg-blue-200 hover:bg-blue-300 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Clients
        </Link>
        <Link
          href="/electricians"
          className="bg-yellow-200 hover:bg-yellow-300 text-yellow-700 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Électriciens
        </Link>
        <Link
          href="/interventions"
          className="bg-green-200 hover:bg-green-300 text-green-700 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Interventions
        </Link>
        <Link
          href="/invoices"
          className="bg-purple-200 hover:bg-purple-300 text-purple-700 px-4 py-2 rounded-lg font-semibold shadow transition"
        >
          Factures
        </Link>
      </nav>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
            Ajouter une intervention
          </h2>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Titre *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Titre"
              value={form.title}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Statut
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            >
              <option value="Planifiée">Planifiée</option>
              <option value="En cours">En cours</option>
              <option value="Terminée">Terminée</option>
              <option value="En retard">En retard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Client *
            </label>
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            >
              {clients.length === 0 && (
                <option value="" disabled>
                  Aucun client disponible
                </option>
              )}
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} (ID {client.id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Électricien *
            </label>
            <select
              name="electricianId"
              value={form.electricianId}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
            >
              {electricians.length === 0 && (
                <option value="" disabled>
                  Aucun électricien disponible
                </option>
              )}
              {electricians.map((electrician) => (
                <option key={electrician.id} value={electrician.id}>
                  {electrician.name} (ID {electrician.id})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Ajouter
          </button>
        </form>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-green-700 text-center">
            Liste des interventions
          </h2>
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="animate-pulse text-green-600 font-bold">
                Chargement...
              </span>
            </div>
          ) : (
            <ul className="space-y-4">
              {interventions.map((intervention) => (
                <li
                  key={intervention.id}
                  className="bg-white shadow rounded-xl p-4 border border-gray-200 flex flex-col gap-2"
                >
                  {editId === intervention.id ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex flex-col gap-2"
                    >
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      />
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      />
                      <input
                        type="date"
                        name="date"
                        value={editForm.date}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      />
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      >
                        <option value="Planifiée">Planifiée</option>
                        <option value="En cours">En cours</option>
                        <option value="Terminée">Terminée</option>
                        <option value="En retard">En retard</option>
                      </select>
                      <select
                        name="clientId"
                        value={editForm.clientId}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      >
                        {clients.length === 0 && (
                          <option value="" disabled>
                            Aucun client disponible
                          </option>
                        )}
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name} (ID {client.id})
                          </option>
                        ))}
                      </select>
                      <select
                        name="electricianId"
                        value={editForm.electricianId}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-green-400 text-black"
                      >
                        {electricians.length === 0 && (
                          <option value="" disabled>
                            Aucun électricien disponible
                          </option>
                        )}
                        {electricians.map((electrician) => (
                          <option key={electrician.id} value={electrician.id}>
                            {electrician.name} (ID {electrician.id})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg font-semibold shadow"
                        >
                          Valider
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 transition text-white px-4 py-2 rounded-lg font-semibold shadow"
                        >
                          Annuler
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <span className="font-bold text-green-700">
                        {intervention.title}
                      </span>
                      <span className="text-gray-600 text-sm">
                        {intervention.description}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Date :{" "}
                        {new Date(intervention.date).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Statut : {intervention.status}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Client ID : {intervention.clientId} | Électricien ID :{" "}
                        {intervention.electricianId}
                      </span>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEdit(intervention)}
                          className="bg-green-400 hover:bg-green-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteIntervention(intervention.id)}
                          className="bg-red-600 hover:bg-red-700 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
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
      </div>
    </div>
  );
}
