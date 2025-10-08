# ⚡ Gestion Chantier Personnel Électrique

![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green?logo=prisma)
![SQLite](https://img.shields.io/badge/SQLite-DB-lightgrey?logo=sqlite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-UI-blue?logo=tailwindcss)

Application de gestion de chantiers et personnel électrique, moderne et responsive, basée sur Next.js 15, Prisma et SQLite.

---

## 🖥️ Aperçu

![Aperçu du dashboard](./public/dashboard.png)

---

## 🚀 Fonctionnalités principales

- Gestion **CRUD** complète : clients, électriciens, interventions, factures
- **API REST** Next.js (App Router)
- **Dropdowns intelligents** pour les relations (clé étrangère)
- **UI moderne** avec Tailwind CSS
- **Base SQLite** persistante et facile à déployer
- **Hooks React** pour chaque entité
- **Seed de données** pour démarrer rapidement

---

## 🛠️ Technologies

- **Next.js 15** (App Router)
- **Prisma ORM**
- **SQLite**
- **Tailwind CSS**
- **TypeScript**

---

## 📦 Installation rapide

```bash
git clone https://github.com/Christophe72/gestion-chantier-personnel-electrique.git
cd gestion-chantier-personnel-electrique
npm install
npx prisma migrate dev --name init
npx prisma generate
npx ts-node prisma/seed.ts
npm run dev
```

---

## 🗂️ Structure du projet

- `src/app/` : App Router Next.js
  - `api/[ressource]/route.ts` : routes API REST (GET, POST, PUT, DELETE)
  - `[ressource]/page.tsx` : frontend React CRUD
- `src/components/` : composants React modulaires
  - `ClientManager.tsx`, `ElectricianManager.tsx`, `InterventionManager.tsx`, `InvoiceManager.tsx`
- `prisma/` : schéma, migrations et seed
- `src/lib/prisma.ts` : instance Prisma mutualisée

---

## 🔗 Endpoints API

- `/api/clients`
- `/api/electricians`
- `/api/interventions`
- `/api/invoices`

Exemple d'appel :

```ts
fetch("/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Nouveau client" }),
});
```

---

## ✨ Pour aller plus loin

- Ajouter des validations, filtres, exports PDF/Excel
- Déployer sur Vercel, Azure ou autre
- Ajouter l’authentification et la gestion des rôles
- Intégrer des notifications ou emails

---

## 📄 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)

---

**Auteur :** Christophe72
