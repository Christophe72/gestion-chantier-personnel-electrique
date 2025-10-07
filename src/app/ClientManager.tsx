"use client";
import React, { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    } catch {
      setError("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (client: Omit<Client, "id">) => {
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (res.ok) {
        fetchClients();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateClient = async (client: Client) => {
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(client),
      });
      if (res.ok) {
        fetchClients();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la modification");
      }
    } catch {
      setError("Erreur lors de la modification");
    }
  };

  const deleteClient = async (id: number) => {
    setError("");
    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchClients();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  return { clients, loading, error, addClient, updateClient, deleteClient };
};

export default function ClientManager() {
  const { clients, loading, error, addClient, updateClient, deleteClient } =
    useClients();
  const [form, setForm] = useState<Omit<Client, "id">>({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Client, "id">>(form);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addClient(form);
    setForm({ name: "", address: "", phone: "", email: "" });
  };

  const startEdit = (client: Client) => {
    setEditId(client.id);
    setEditForm({
      name: client.name || "",
      address: client.address || "",
      phone: client.phone || "",
      email: client.email || "",
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateClient({ id: editId, ...editForm });
      setEditId(null);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <h2 className="text-xl font-bold mb-6">Gestion des clients</h2>
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
        <input
          type="text"
          name="address"
          placeholder="Adresse"
          value={form.address}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={form.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
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
          {clients.map((client) => (
            <li key={client.id} className="border p-2 rounded">
              {editId === client.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
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
                  <strong>{client.name}</strong> <br />
                  {client.address && (
                    <span>
                      {client.address} <br />
                    </span>
                  )}
                  {client.phone && (
                    <span>
                      {client.phone} <br />
                    </span>
                  )}
                  {client.email && <span>{client.email}</span>}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(client)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteClient(client.id)}
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
