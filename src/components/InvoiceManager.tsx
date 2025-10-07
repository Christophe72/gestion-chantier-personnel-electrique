"use client";
import React, { useEffect, useState } from "react";

interface Invoice {
  id: number;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: string;
  interventionId: number;
}

const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch {
      setError("Erreur lors de la récupération des factures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const addInvoice = async (invoice: Omit<Invoice, "id">) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (res.ok) {
        fetchInvoices();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateInvoice = async (invoice: Invoice) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (res.ok) {
        fetchInvoices();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la modification");
      }
    } catch {
      setError("Erreur lors de la modification");
    }
  };

  const deleteInvoice = async (id: number) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchInvoices();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la suppression");
      }
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  return { invoices, loading, error, addInvoice, updateInvoice, deleteInvoice };
};

export default function InvoiceManager() {
  const { invoices, loading, error, addInvoice, updateInvoice, deleteInvoice } =
    useInvoices();
  const [form, setForm] = useState<Omit<Invoice, "id">>({
    amount: 0,
    issueDate: "",
    dueDate: "",
    status: "Brouillon",
    interventionId: 0,
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Invoice, "id">>(form);

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
    // Si la date est déjà au format ISO, on la garde, sinon on la convertit
    if (!date) return "";
    if (date.length > 10) return date;
    return new Date(date).toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      ...form,
      amount: Number(form.amount),
      issueDate: toISODate(form.issueDate),
      dueDate: toISODate(form.dueDate),
      interventionId: Number(form.interventionId),
    });
    setForm({
      amount: 0,
      issueDate: "",
      dueDate: "",
      status: "Brouillon",
      interventionId: 0,
    });
  };

  const startEdit = (invoice: Invoice) => {
    setEditId(invoice.id);
    setEditForm({
      amount: invoice.amount,
      issueDate: invoice.issueDate.slice(0, 10),
      dueDate: invoice.dueDate.slice(0, 10),
      status: invoice.status,
      interventionId: invoice.interventionId,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      updateInvoice({
        id: editId,
        ...editForm,
        amount: Number(editForm.amount),
        issueDate: toISODate(editForm.issueDate),
        dueDate: toISODate(editForm.dueDate),
        interventionId: Number(editForm.interventionId),
      });
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
          Gestion des factures
        </h2>
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Montant *
              </label>
              <input
                type="number"
                name="amount"
                placeholder="Montant"
                value={form.amount}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Date émission *
              </label>
              <input
                type="date"
                name="issueDate"
                placeholder="Date émission"
                value={form.issueDate}
                onChange={handleChange}
                required
                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-400 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Date échéance *
              </label>
              <input
                type="date"
                name="dueDate"
                placeholder="Date échéance"
                value={form.dueDate}
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
                <option value="Brouillon">Brouillon</option>
                <option value="Envoyée">Envoyée</option>
                <option value="Payée">Payée</option>
                <option value="En retard">En retard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                ID intervention *
              </label>
              <input
                type="number"
                name="interventionId"
                placeholder="ID intervention"
                value={form.interventionId}
                onChange={handleChange}
                required
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
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="bg-white shadow rounded-xl p-4 border border-gray-200"
              >
                {editId === invoice.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Montant *
                        </label>
                        <input
                          type="number"
                          name="amount"
                          value={editForm.amount}
                          onChange={handleEditChange}
                          required
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Date émission *
                        </label>
                        <input
                          type="date"
                          name="issueDate"
                          value={editForm.issueDate}
                          onChange={handleEditChange}
                          required
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          Date échéance *
                        </label>
                        <input
                          type="date"
                          name="dueDate"
                          value={editForm.dueDate}
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
                          <option value="Brouillon">Brouillon</option>
                          <option value="Envoyée">Envoyée</option>
                          <option value="Payée">Payée</option>
                          <option value="En retard">En retard</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">
                          ID intervention *
                        </label>
                        <input
                          type="number"
                          name="interventionId"
                          value={editForm.interventionId}
                          onChange={handleEditChange}
                          required
                          className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-green-400"
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
                        Montant : {invoice.amount} €
                      </span>
                      <div className="text-gray-600 text-sm mt-1">
                        <span>
                          Émise le :{" "}
                          {new Date(invoice.issueDate).toLocaleDateString()}
                          <br />
                        </span>
                        <span>
                          Échéance :{" "}
                          {new Date(invoice.dueDate).toLocaleDateString()}
                          <br />
                        </span>
                        <span>
                          Statut : {invoice.status}
                          <br />
                        </span>
                        <span>ID intervention : {invoice.interventionId}</span>
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0 flex gap-2">
                      <button
                        onClick={() => startEdit(invoice)}
                        className="bg-yellow-400 hover:bg-yellow-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => deleteInvoice(invoice.id)}
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
