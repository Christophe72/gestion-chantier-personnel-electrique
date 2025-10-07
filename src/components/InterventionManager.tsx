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
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">
          Gestion des interventions
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
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
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Date *
              </label>
              <input
                type="date"
                name="date"
                placeholder="Date"
                value={form.date}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
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
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              >
                <option value="Planifiée">Planifiée</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="Facturée">Facturée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Client
              </label>
              <select
                name="clientId"
                value={form.clientId}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Électricien
              </label>
              <select
                name="electricianId"
                value={form.electricianId}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              >
                {electricians.map((electrician) => (
                  <option key={electrician.id} value={electrician.id}>
                    {electrician.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Ajouter
          </button>
        </form>
        {error && (
          <div className="mb-4 text-red-600 text-center font-semibold">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <span className="animate-pulse text-blue-600 font-bold">
              Chargement...
            </span>
          </div>
        ) : (
          <ul className="space-y-4">
            {interventions.map((intervention) => (
              <li
                key={intervention.id}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                {editId === intervention.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Titre *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
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
                          value={editForm.description}
                          onChange={handleEditChange}
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
                          value={editForm.date}
                          onChange={handleEditChange}
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
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        >
                          <option value="Planifiée">Planifiée</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminée">Terminée</option>
                          <option value="Facturée">Facturée</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Client
                        </label>
                        <select
                          name="clientId"
                          value={editForm.clientId}
                          onChange={handleEditChange}
                          required
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400"
                        >
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Électricien
                        </label>
                        <select
                          name="electricianId"
                          value={editForm.electricianId}
                          onChange={handleEditChange}
                          required
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400"
                        >
                          {electricians.map((electrician) => (
                            <option key={electrician.id} value={electrician.id}>
                              {electrician.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
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
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-700">
                        {intervention.title}
                      </span>
                      <span className="ml-2 text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                        {intervention.status}
                      </span>
                      <div className="text-gray-600 text-sm mt-1">
                        {intervention.description && (
                          <span>
                            {intervention.description}
                            <br />
                          </span>
                        )}
                        <span>
                          Date :{" "}
                          {new Date(intervention.date).toLocaleDateString()}
                          <br />
                        </span>
                        <span>
                          Client :{" "}
                          {clients.find((c) => c.id === intervention.clientId)
                            ?.name || intervention.clientId}
                          <br />
                        </span>
                        <span>
                          Électricien :{" "}
                          {electricians.find(
                            (e) => e.id === intervention.electricianId
                          )?.name || intervention.electricianId}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <button
                        onClick={() => startEdit(intervention)}
                        className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
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
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
