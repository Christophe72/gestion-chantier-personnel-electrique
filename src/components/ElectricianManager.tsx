"use client";
import React, { useEffect, useState } from "react";

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
    <div className="font-sans min-h-screen p-8 pb-20">
      <h2 className="text-xl font-bold mb-6">Gestion des électriciens</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Nom"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
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
          {electricians.map((electrician) => (
            <li key={electrician.id} className="border p-2 rounded">
              {editId === electrician.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
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
                  <strong>{electrician.name}</strong>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(electrician)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteElectrician(electrician.id)}
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
