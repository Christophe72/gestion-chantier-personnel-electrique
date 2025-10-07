import React, { useState, useEffect } from "react";

interface Client {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      setClients(data);
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      setError("Erreur lors de la suppression");
    }
  };

  return { clients, loading, error, addClient, updateClient, deleteClient };
}

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
    <div className="font-sans min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-extrabold mb-8 text-blue-700 text-center drop-shadow">
          Gestion des clients
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Adresse
              </label>
              <input
                type="text"
                name="address"
                placeholder="Adresse"
                value={form.address}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Téléphone
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Téléphone"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
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
            {clients.map((client) => (
              <li
                key={client.id}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                {editId === client.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        />
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
                        {client.name}
                      </span>
                      <div className="text-gray-600 text-sm">
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
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <button
                        onClick={() => startEdit(client)}
                        className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteClient(client.id)}
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
