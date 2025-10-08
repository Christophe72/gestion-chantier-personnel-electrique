"use client";
import React, { useEffect, useState } from "react";
import { useInterventions } from "./InterventionManager";
import InvoiceAlert from "./InvoiceAlert";
import Link from "next/link";

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

  const addInvoice = async (
    invoice: Omit<Invoice, "id">,
    onSuccess?: () => void
  ) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (res.ok) {
        await fetchInvoices();
        if (onSuccess) onSuccess();
        window.location.reload();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de l'ajout");
      }
    } catch {
      setError("Erreur lors de l'ajout");
    }
  };

  const updateInvoice = async (invoice: Invoice, onSuccess?: () => void) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoice),
      });
      if (res.ok) {
        await fetchInvoices();
        if (onSuccess) onSuccess();
        window.location.reload();
      } else {
        const err = await res.json();
        setError(err.message || "Erreur lors de la modification");
      }
    } catch {
      setError("Erreur lors de la modification");
    }
  };

  const deleteInvoice = async (id: number, onSuccess?: () => void) => {
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        await fetchInvoices();
        if (onSuccess) onSuccess();
        window.location.reload();
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
  const { interventions } = useInterventions();
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
          <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">
            Ajouter une facture
          </h2>
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
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-purple-400 text-black"
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
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-purple-400 text-black"
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
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-purple-400 text-black"
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
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-purple-400 text-black"
            >
              <option value="Brouillon">Brouillon</option>
              <option value="Envoyée">Envoyée</option>
              <option value="Payée">Payée</option>
              <option value="En retard">En retard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Intervention liée *
            </label>
            <select
              name="interventionId"
              value={form.interventionId}
              onChange={handleChange}
              required
              className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-purple-400 text-black"
            >
              {interventions.length === 0 && (
                <option value="" disabled>
                  Aucune intervention disponible
                </option>
              )}
              {interventions.map((intervention) => (
                <option key={intervention.id} value={intervention.id}>
                  {intervention.title} (ID {intervention.id})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow"
          >
            Ajouter
          </button>
        </form>
        <div>
          <h2 className="text-2xl font-bold mb-4 text-purple-700 text-center">
            Liste des factures
          </h2>
          {error && (
            <div className="mb-4 text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <span className="animate-pulse text-purple-600 font-bold">
                Chargement...
              </span>
            </div>
          ) : (
            <ul className="space-y-4">
              {invoices.map((invoice) => (
                <li
                  key={invoice.id}
                  className="bg-white shadow rounded-xl p-4 border border-gray-200 flex flex-col gap-2"
                >
                  {editId === invoice.id ? (
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex flex-col gap-2"
                    >
                      <input
                        type="number"
                        name="amount"
                        value={editForm.amount}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400 text-black"
                      />
                      <input
                        type="date"
                        name="issueDate"
                        value={editForm.issueDate}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400 text-black"
                      />
                      <input
                        type="date"
                        name="dueDate"
                        value={editForm.dueDate}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400 text-black"
                      />
                      <select
                        name="status"
                        value={editForm.status}
                        onChange={handleEditChange}
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400 text-black"
                      >
                        <option value="Brouillon">Brouillon</option>
                        <option value="Envoyée">Envoyée</option>
                        <option value="Payée">Payée</option>
                        <option value="En retard">En retard</option>
                      </select>
                      <select
                        name="interventionId"
                        value={editForm.interventionId}
                        onChange={handleEditChange}
                        required
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-purple-400 text-black"
                      >
                        {interventions.length === 0 && (
                          <option value="" disabled>
                            Aucune intervention disponible
                          </option>
                        )}
                        {interventions.map((intervention) => (
                          <option key={intervention.id} value={intervention.id}>
                            {intervention.title} (ID {intervention.id})
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 transition text-white px-4 py-2 rounded-lg font-semibold shadow"
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
                      <span className="font-bold text-purple-700">
                        Montant : {invoice.amount} €
                      </span>
                      <span className="text-gray-600 text-sm">
                        Émise le :{" "}
                        {new Date(invoice.issueDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Échéance :{" "}
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Statut : {invoice.status}
                      </span>
                      <span className="text-gray-600 text-sm">
                        Intervention ID : {invoice.interventionId}
                      </span>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => startEdit(invoice)}
                          className="bg-purple-400 hover:bg-purple-500 transition text-white px-3 py-1 rounded-lg font-semibold shadow"
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
