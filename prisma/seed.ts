import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Création de quelques clients
  const client1 = await prisma.client.create({
    data: {
      name: "Entreprise Dupont",
      address: "12 rue des Fleurs, Paris",
      phone: "0601020304",
      email: "contact@dupont.fr",
    },
  });
  const client2 = await prisma.client.create({
    data: {
      name: "SCI Les Chênes",
      address: "5 avenue des Chênes, Lyon",
      phone: "0611223344",
      email: "info@chenes.fr",
    },
  });

  // Création d'électriciens
  const electrician1 = await prisma.electrician.create({
    data: { name: "Jean Martin" },
  });
  const electrician2 = await prisma.electrician.create({
    data: { name: "Sophie Bernard" },
  });

  // Création d'interventions
  const intervention1 = await prisma.intervention.create({
    data: {
      title: "Remplacement tableau électrique",
      description: "Remplacement complet du tableau principal",
      date: new Date("2025-10-01"),
      status: "Terminée",
      clientId: client1.id,
      electricianId: electrician1.id,
    },
  });
  const intervention2 = await prisma.intervention.create({
    data: {
      title: "Installation prise extérieure",
      description: "Ajout d’une prise étanche sur terrasse",
      date: new Date("2025-10-05"),
      status: "Planifiée",
      clientId: client2.id,
      electricianId: electrician2.id,
    },
  });

  // Création de factures
  await prisma.invoice.create({
    data: {
      amount: 350.0,
      issueDate: new Date("2025-10-02"),
      dueDate: new Date("2025-10-15"),
      status: "Payée",
      interventionId: intervention1.id,
    },
  });
  await prisma.invoice.create({
    data: {
      amount: 120.0,
      issueDate: new Date("2025-10-06"),
      dueDate: new Date("2025-10-20"),
      status: "Brouillon",
      interventionId: intervention2.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
