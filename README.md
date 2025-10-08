<div align="center">

# ⚡ Gestion Chantier Personnel Électrique

### Application complète de gestion pour entreprises d'électricité

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.17.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

[Fonctionnalités](#-fonctionnalités) • [Installation](#-installation) • [Documentation](#-documentation-api) • [Contribution](#-contribution)

</div>

---

## 📖 À propos

**Gestion Chantier Personnel Électrique** est une application web moderne conçue pour simplifier la gestion quotidienne des entreprises d'électricité. Elle permet de gérer efficacement les clients, les électriciens, les interventions sur chantier et la facturation, le tout dans une interface intuitive et responsive.

### 🎯 Objectif du projet

Offrir une solution tout-en-un pour :
- 👥 Gérer un portefeuille de clients avec leurs coordonnées complètes
- 🔧 Suivre les électriciens et leur affectation aux interventions
- 📅 Planifier et suivre les interventions sur chantiers
- 💰 Créer et gérer les factures liées aux interventions
- ⚠️ Recevoir des alertes pour les interventions en retard et les factures impayées

---

## ✨ Fonctionnalités

### 🏗️ Gestion complète (CRUD)

- **Clients** : Nom, adresse, téléphone, email
- **Électriciens** : Gestion du personnel technique
- **Interventions** : Titre, description, date, statut, association client/électricien
- **Factures** : Montant, dates d'émission/échéance, statut, lien avec intervention

### 🎨 Interface utilisateur

- ✅ Interface moderne et responsive avec Tailwind CSS 4
- ✅ Navigation intuitive entre les différentes sections
- ✅ Formulaires de saisie avec validation côté client
- ✅ Édition en ligne des données existantes
- ✅ Confirmation avant suppression

### 🔔 Alertes intelligentes

- ⚠️ **Alertes interventions** : Détection automatique des interventions en retard
- 💳 **Alertes factures** : Notification des factures impayées après échéance

### 🔌 API REST complète

- Endpoints standardisés pour chaque entité
- Support des méthodes HTTP : GET, POST, PUT, DELETE
- Gestion d'erreurs robuste
- Relations entre entités (foreign keys)

### 📊 Fonctionnalités avancées

- Dropdowns intelligents pour la sélection de clients/électriciens
- Relations en cascade (suppression client → suppression interventions)
- Timestamps automatiques (createdAt, updatedAt)
- Base de données SQLite légère et portable

---

## 🛠️ Stack technique

| Technologie | Version | Usage |
|------------|---------|-------|
| **Next.js** | 15.5.4 | Framework React avec App Router |
| **React** | 19.1.0 | Bibliothèque UI |
| **TypeScript** | 5 | Typage statique |
| **Prisma** | 6.17.0 | ORM pour la base de données |
| **SQLite** | - | Base de données embarquée |
| **Tailwind CSS** | 4 | Framework CSS utilitaire |
| **ESLint** | 9 | Linter JavaScript/TypeScript |

---

## 🚀 Installation

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 20 ou supérieure) - [Télécharger](https://nodejs.org/)
- **npm** (inclus avec Node.js)
- **Git** - [Télécharger](https://git-scm.com/)

### Étapes d'installation

#### 1️⃣ Cloner le dépôt

```bash
git clone https://github.com/Christophe72/gestion-chantier-personnel-electrique.git
cd gestion-chantier-personnel-electrique
```

#### 2️⃣ Installer les dépendances

```bash
npm install
```

#### 3️⃣ Configurer la base de données

Créez un fichier `.env` à la racine du projet :

```env
DATABASE_URL="file:./prisma/dev.db"
```

#### 4️⃣ Initialiser Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init
```

#### 5️⃣ Peupler la base avec des données d'exemple

```bash
npx ts-node prisma/seed.ts
```

Cela créera :
- 2 clients (Entreprise Dupont, SCI Les Chênes)
- 2 électriciens (Jean Martin, Sophie Bernard)
- 2 interventions
- 2 factures

#### 6️⃣ Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez votre navigateur à l'adresse : **http://localhost:3000**

---

## 📁 Structure du projet

```
gestion-chantier-personnel-electrique/
├── prisma/
│   ├── schema.prisma          # Modèle de données Prisma
│   ├── seed.ts                # Script de peuplement de la base
│   ├── migrations/            # Historique des migrations
│   └── dev.db                 # Base de données SQLite
├── public/                    # Assets statiques
├── src/
│   ├── app/
│   │   ├── api/               # Routes API REST
│   │   │   ├── clients/route.ts
│   │   │   ├── electricians/route.ts
│   │   │   ├── interventions/route.ts
│   │   │   └── invoices/route.ts
│   │   ├── clients/page.tsx   # Page gestion clients
│   │   ├── electricians/page.tsx
│   │   ├── interventions/page.tsx
│   │   ├── invoices/page.tsx
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── layout.tsx         # Layout principal
│   │   └── globals.css        # Styles globaux
│   ├── components/
│   │   ├── ClientManager.tsx          # Composant CRUD clients + hook
│   │   ├── ElectricianManager.tsx     # Composant CRUD électriciens + hook
│   │   ├── InterventionManager.tsx    # Composant CRUD interventions + hook
│   │   ├── InvoiceManager.tsx         # Composant CRUD factures + hook
│   │   ├── InterventionAlert.tsx      # Alerte interventions en retard
│   │   └── InvoiceAlert.tsx           # Alerte factures impayées
│   └── lib/
│       └── prisma.ts          # Instance Prisma mutualisée
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

### 📋 Description des répertoires clés

- **`prisma/`** : Contient le schéma de données, les migrations et le fichier de seed
- **`src/app/api/`** : Routes API RESTful pour chaque entité (Next.js App Router)
- **`src/components/`** : Composants React réutilisables avec hooks personnalisés
- **`src/lib/`** : Utilitaires et instances partagées (Prisma client)

---

## 🗄️ Schéma de base de données

### Modèles Prisma

#### Client
```prisma
model Client {
  id            Int            @id @default(autoincrement())
  name          String
  address       String?
  phone         String?
  email         String?        @unique
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  interventions Intervention[]
}
```

#### Electrician
```prisma
model Electrician {
  id            Int            @id @default(autoincrement())
  name          String
  interventions Intervention[]
}
```

#### Intervention
```prisma
model Intervention {
  id            Int         @id @default(autoincrement())
  title         String
  description   String?
  date          DateTime
  status        String      // "Planifiée", "En cours", "Terminée", "Facturée"
  client        Client      @relation(fields: [clientId], references: [id], onDelete: Cascade)
  clientId      Int
  electrician   Electrician @relation(fields: [electricianId], references: [id])
  electricianId Int
  invoice       Invoice?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

#### Invoice
```prisma
model Invoice {
  id             Int          @id @default(autoincrement())
  amount         Float
  issueDate      DateTime
  dueDate        DateTime
  status         String       // "Brouillon", "Envoyée", "Payée", "En retard"
  intervention   Intervention @relation(fields: [interventionId], references: [id], onDelete: Cascade)
  interventionId Int          @unique
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}
```

### 🔗 Relations

- Un **Client** peut avoir plusieurs **Interventions** (1:N)
- Un **Électricien** peut avoir plusieurs **Interventions** (1:N)
- Une **Intervention** peut avoir une seule **Facture** (1:1)
- Suppression en cascade : si on supprime un client, ses interventions sont supprimées

---

## 📡 Documentation API

Toutes les routes suivent les conventions REST et acceptent/retournent du JSON.

### Endpoints Clients

| Méthode | Route | Description | Body |
|---------|-------|-------------|------|
| `GET` | `/api/clients` | Liste tous les clients | - |
| `POST` | `/api/clients` | Crée un nouveau client | `{ name, address?, phone?, email? }` |
| `PUT` | `/api/clients` | Modifie un client existant | `{ id, name?, address?, phone?, email? }` |
| `DELETE` | `/api/clients` | Supprime un client | `{ id }` |

### Endpoints Électriciens

| Méthode | Route | Description | Body |
|---------|-------|-------------|------|
| `GET` | `/api/electricians` | Liste tous les électriciens | - |
| `POST` | `/api/electricians` | Crée un nouvel électricien | `{ name }` |
| `PUT` | `/api/electricians` | Modifie un électricien | `{ id, name }` |
| `DELETE` | `/api/electricians` | Supprime un électricien | `{ id }` |

### Endpoints Interventions

| Méthode | Route | Description | Body |
|---------|-------|-------------|------|
| `GET` | `/api/interventions` | Liste toutes les interventions (avec relations) | - |
| `POST` | `/api/interventions` | Crée une nouvelle intervention | `{ title, description?, date, status, clientId, electricianId }` |
| `PUT` | `/api/interventions` | Modifie une intervention | `{ id, title?, description?, date?, status?, clientId?, electricianId? }` |
| `DELETE` | `/api/interventions` | Supprime une intervention | `{ id }` |

### Endpoints Factures

| Méthode | Route | Description | Body |
|---------|-------|-------------|------|
| `GET` | `/api/invoices` | Liste toutes les factures (avec relations) | - |
| `POST` | `/api/invoices` | Crée une nouvelle facture | `{ amount, issueDate, dueDate, status, interventionId }` |
| `PUT` | `/api/invoices` | Modifie une facture | `{ id, amount?, issueDate?, dueDate?, status?, interventionId? }` |
| `DELETE` | `/api/invoices` | Supprime une facture | `{ id }` |

### 📝 Exemples d'appels API

#### Créer un client

```typescript
const response = await fetch("/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Nouveau Client SAS",
    address: "15 rue de la République, Marseille",
    phone: "0612345678",
    email: "contact@nouveauclient.fr"
  }),
});
const client = await response.json();
```

#### Modifier une intervention

```typescript
const response = await fetch("/api/interventions", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    id: 1,
    status: "Terminée"
  }),
});
const intervention = await response.json();
```

#### Supprimer une facture

```typescript
const response = await fetch("/api/invoices", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 3 }),
});
```

---

## 🎨 Composants React

Chaque entité dispose d'un composant Manager avec son hook personnalisé.

### Hooks disponibles

#### `useClients()`
```typescript
const {
  clients,          // Liste des clients
  loading,          // État de chargement
  error,            // Message d'erreur
  addClient,        // Fonction d'ajout
  updateClient,     // Fonction de modification
  deleteClient      // Fonction de suppression
} = useClients();
```

#### `useElectricians()`
```typescript
const {
  electricians,
  loading,
  error,
  addElectrician,
  updateElectrician,
  deleteElectrician
} = useElectricians();
```

#### `useInterventions()`
```typescript
const {
  interventions,
  loading,
  error,
  addIntervention,
  updateIntervention,
  deleteIntervention
} = useInterventions();
```

#### `useInvoices()`
```typescript
const {
  invoices,
  loading,
  error,
  addInvoice,
  updateInvoice,
  deleteInvoice
} = useInvoices();
```

---

## 🔧 Commandes disponibles

```bash
# Développement
npm run dev           # Lance le serveur en mode développement (Turbopack)

# Build
npm run build         # Compile l'application pour la production

# Production
npm start             # Lance le serveur en mode production

# Linting
npm run lint          # Vérifie le code avec ESLint

# Prisma
npx prisma studio     # Interface graphique pour la base de données
npx prisma generate   # Génère le client Prisma
npx prisma migrate    # Gère les migrations de base de données
```

---

## 🌐 Déploiement

### Déploiement sur Vercel (recommandé)

1. Créez un compte sur [Vercel](https://vercel.com)
2. Importez votre dépôt GitHub
3. Vercel détectera automatiquement Next.js
4. Configurez la variable d'environnement `DATABASE_URL`
5. Déployez !

> **Note** : Pour la production, remplacez SQLite par PostgreSQL ou MySQL pour plus de robustesse.

### Autres plateformes

- **Netlify** : Compatible avec Next.js
- **Railway** : Support PostgreSQL intégré
- **Render** : Déploiement avec base de données PostgreSQL

---

## 🐛 Dépannage

### Problème : Erreur Prisma Client

```bash
# Régénérer le client Prisma
npx prisma generate
```

### Problème : Base de données verrouillée

```bash
# Supprimer et recréer la base
rm prisma/dev.db
npx prisma migrate dev --name init
npx ts-node prisma/seed.ts
```

### Problème : Port 3000 déjà utilisé

```bash
# Utiliser un autre port
PORT=3001 npm run dev
```

### Problème : Erreurs TypeScript

```bash
# Nettoyer et reconstruire
rm -rf .next
npm run build
```

---

## 🚀 Améliorations futures

- [ ] Authentification et autorisation (NextAuth.js)
- [ ] Tableau de bord avec statistiques et graphiques
- [ ] Export PDF des factures
- [ ] Recherche et filtres avancés
- [ ] Upload de documents (devis, photos de chantier)
- [ ] Notifications par email
- [ ] Application mobile (React Native)
- [ ] Mode hors ligne (PWA)
- [ ] Multi-tenant (plusieurs entreprises)
- [ ] Intégration calendrier (Google Calendar, Outlook)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. **Fork** le projet
2. Créez une **branche** pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. **Committez** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Pushez** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Standards de code

- Utiliser TypeScript pour tout nouveau code
- Respecter les conventions ESLint
- Commenter le code complexe
- Écrire des tests pour les nouvelles fonctionnalités

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier `LICENSE` pour plus de détails.

---

## 👨‍💻 Auteur

**Christophe72**

- GitHub: [@Christophe72](https://github.com/Christophe72)

---

## 🙏 Remerciements

- [Next.js](https://nextjs.org/) - Framework React
- [Prisma](https://www.prisma.io/) - ORM moderne
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel](https://vercel.com/) - Plateforme de déploiement

---

<div align="center">

**⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile ! ⭐**

</div>
