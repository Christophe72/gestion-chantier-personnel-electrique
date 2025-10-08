import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { intervention: true },
    });
    return Response.json(invoices);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la récupération des factures : ${message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoice = await prisma.invoice.create({ data: body });
    return Response.json(invoice, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la création de la facture : ${message}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return Response.json(
        { message: "ID manquant pour la modification" },
        { status: 400 }
      );
    }
    // Correction du format des dates
    const updateData = { ...body };
    if (updateData.issueDate && updateData.issueDate.length === 10) {
      updateData.issueDate = new Date(updateData.issueDate).toISOString();
    }
    if (updateData.dueDate && updateData.dueDate.length === 10) {
      updateData.dueDate = new Date(updateData.dueDate).toISOString();
    }
    const invoice = await prisma.invoice.update({
      where: { id: body.id },
      data: updateData,
    });
    return Response.json(invoice);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la modification de la facture : ${message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.id) {
      return Response.json(
        { message: "ID manquant pour la suppression" },
        { status: 400 }
      );
    }
    await prisma.invoice.delete({ where: { id: body.id } });
    return Response.json({ message: "Facture supprimée" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la suppression de la facture : ${message}` },
      { status: 500 }
    );
  }
}
