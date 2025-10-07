# Gestion Chantier Personnel Électrique

Application Next.js 15 (App Router) + Prisma + SQLite

## Installation

1. **Cloner le projet**
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Initialiser Prisma et la base SQLite :
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Remplir la base avec des exemples :
   ```bash
   npx ts-node prisma/seed.ts
   ```
5. Lancer le serveur :
   ```bash
   npm run dev
   ```

## Structure du projet

- `src/app/` : App Router Next.js 15
  - `api/[ressource]/route.ts` : routes API REST (GET, POST, PUT, DELETE)
  - `page.tsx` : frontend React CRUD (clients)
- `src/components/` : composants React modulaires pour la gestion CRUD
  - `ClientManager.tsx` : gestion des clients + hook `useClients`
  - `ElectricianManager.tsx` : gestion des électriciens + hook `useElectricians`
  - `InterventionManager.tsx` : gestion des interventions + hook `useInterventions` (dropdowns pour clés étrangères)
  - `InvoiceManager.tsx` : gestion des factures + hook `useInvoices`
- `prisma/` : schéma et seed de la base SQLite
- `src/lib/prisma.ts` : instance Prisma mutualisée

## Fonctionnalités

- **CRUD complet** sur clients, électriciens, interventions, factures
- **Composants React modulaires** pour chaque entité, avec hooks dédiés
- **Dropdowns** pour sélectionner les clients et électriciens lors de la création d'une intervention (évite les erreurs de clé étrangère)
- **API REST** : `/api/clients`, `/api/electricians`, `/api/interventions`, `/api/invoices`
- **Base SQLite** persistante

## Exemple d'appel API (fetch)

```ts
// POST
fetch("/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Nouveau client" }),
});
// PUT
fetch("/api/clients", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1, name: "Modifié" }),
});
// DELETE
fetch("/api/clients", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1 }),
});
```

## Pour aller plus loin

- Adapter le frontend pour les autres entités (tous les managers sont prêts à être utilisés)
- Ajouter des validations, des filtres, des exports
- Déployer sur Vercel ou autre

---

**Auteur :** Christophe72
