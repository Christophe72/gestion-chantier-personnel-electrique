"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Electrician {
  id: number;
  name: string;
}

export function useElectricians() {
  const [electricians, setElectricians] = useState<Electrician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchElectricians = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/electricians");
      const data = await res.json();
      setElectricians(data);
    } catch (e) {
      setError("Erreur lors de la récupération des électriciens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElectricians();
  }, []);

  const addElectrician = async (electrician: Omit<Electrician, "id">) => {
    setError("");
    try {
      const res = await fetch("/api/electricians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(electrician),
      });
      if (res.ok) {
        fetchElectricians();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de l'ajout");
      }
    } catch (e) {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateElectrician = async (electrician: Electrician) => {
    setError("");
    try {
      const res = await fetch("/api/electricians", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(electrician),
      });
      if (res.ok) {
        fetchElectricians();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la modification");
      }
    } catch (e) {
      setError("Erreur lors de la modification");
    }
  };

  const deleteElectrician = async (id: number) => {
    setError("");
    try {
      const res = await fetch("/api/electricians", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchElectricians();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la suppression");
      }
    } catch (e) {
      setError("Erreur lors de la suppression");
    }
  };

  return {
    electricians,
    loading,
    error,
    addElectrician,
    updateElectrician,
    deleteElectrician,
  };
}

export default function ElectricianManager() {
  const {
    electricians,
    loading,
    error,
    addElectrician,
    updateElectrician,
    deleteElectrician,
  } = useElectricians();
  const [form, setForm] = useState<Omit<Electrician, "id">>({ name: "" });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Electrician, "id">>(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addElectrician(form);
    setForm({ name: "" });
  };

  const startEdit = (electrician: Electrician) => {
    setEditId(electrician.id);
    setEditForm({ name: electrician.name || "" });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateElectrician({ id: editId, ...editForm });
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
          Gestion des électriciens
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nom *
            </label>
            <input
              type="text"
              name="name"
              placeholder="Nom"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
            />
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
            {electricians.map((electrician) => (
              <li
                key={electrician.id}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                {editId === electrician.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700">
                        Nom *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                      />
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
                    <span className="text-lg font-bold text-blue-700">
                      {electrician.name}
                    </span>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <button
                        onClick={() => startEdit(electrician)}
                        className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteElectrician(electrician.id)}
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
