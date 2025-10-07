"use client";
import React, { useEffect, useState } from "react";

interface Client {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [message, setMessage] = useState<string>("");

  // Ajout pour modification et suppression
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setMessage("Erreur lors de la récupération des clients");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ name: "", address: "", phone: "", email: "" });
        setMessage("Client ajouté !");
        fetchClients();
      } else {
        const error = await res.json();
        setMessage(error.message || "Erreur lors de l'ajout");
      }
    } catch {
      setMessage("Erreur lors de l'ajout");
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
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

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: "", address: "", phone: "", email: "" });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setMessage("");
    try {
      const res = await fetch("/api/clients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...editForm }),
      });
      if (res.ok) {
        setMessage("Client modifié !");
        fetchClients();
        cancelEdit();
      } else {
        const error = await res.json();
        setMessage(error.message || "Erreur lors de la modification");
      }
    } catch {
      setMessage("Erreur lors de la modification");
    }
  };

  const handleDelete = async (id: number) => {
    setMessage("");
    try {
      const res = await fetch("/api/clients", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage("Client supprimé !");
        fetchClients();
      } else {
        const error = await res.json();
        setMessage(error.message || "Erreur lors de la suppression");
      }
    } catch {
      setMessage("Erreur lors de la suppression");
    }
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
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
      {message && <div className="mb-4 text-red-600">{message}</div>}
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
                    placeholder="Nom"
                    value={editForm.name}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={editForm.address}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Téléphone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                      onClick={() => handleDelete(client.id)}
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
