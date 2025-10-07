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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice({
      ...form,
      amount: Number(form.amount),
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
        interventionId: Number(editForm.interventionId),
      });
      setEditId(null);
    }
  };

  const cancelEdit = () => {
    setEditId(null);
  };

  return (
    <div className="font-sans min-h-screen p-8 pb-20">
      <h2 className="text-xl font-bold mb-6">Gestion des factures</h2>
      <form onSubmit={handleSubmit} className="mb-8 space-y-2">
        <input
          type="number"
          name="amount"
          placeholder="Montant"
          value={form.amount}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="issueDate"
          placeholder="Date émission"
          value={form.issueDate}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          name="dueDate"
          placeholder="Date échéance"
          value={form.dueDate}
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
          <option value="Brouillon">Brouillon</option>
          <option value="Envoyée">Envoyée</option>
          <option value="Payée">Payée</option>
          <option value="En retard">En retard</option>
        </select>
        <input
          type="number"
          name="interventionId"
          placeholder="ID intervention"
          value={form.interventionId}
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
          {invoices.map((invoice) => (
            <li key={invoice.id} className="border p-2 rounded">
              {editId === invoice.id ? (
                <form onSubmit={handleEditSubmit} className="space-y-2">
                  <input
                    type="number"
                    name="amount"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    name="issueDate"
                    value={editForm.issueDate}
                    onChange={handleEditChange}
                    required
                    className="border p-2 rounded w-full"
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={editForm.dueDate}
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
                    <option value="Brouillon">Brouillon</option>
                    <option value="Envoyée">Envoyée</option>
                    <option value="Payée">Payée</option>
                    <option value="En retard">En retard</option>
                  </select>
                  <input
                    type="number"
                    name="interventionId"
                    value={editForm.interventionId}
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
                  <strong>Montant :</strong> {invoice.amount} €<br />
                  <strong>Émise le :</strong>{" "}
                  {new Date(invoice.issueDate).toLocaleDateString()}
                  <br />
                  <strong>Échéance :</strong>{" "}
                  {new Date(invoice.dueDate).toLocaleDateString()}
                  <br />
                  <strong>Statut :</strong> {invoice.status}
                  <br />
                  <strong>ID intervention :</strong> {invoice.interventionId}
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => startEdit(invoice)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteInvoice(invoice.id)}
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
