import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest) {
  try {
    const interventions = await prisma.intervention.findMany({
      include: { client: true, electrician: true, invoice: true },
    });
    return Response.json(interventions);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la récupération des interventions : ${message}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const intervention = await prisma.intervention.create({ data: body });
    return Response.json(intervention, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la création de l'intervention : ${message}` },
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
    const intervention = await prisma.intervention.update({
      where: { id: body.id },
      data: body,
    });
    return Response.json(intervention);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la modification de l'intervention : ${message}`,
      },
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
    await prisma.intervention.delete({ where: { id: body.id } });
    return Response.json({ message: "Intervention supprimée" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la suppression de l'intervention : ${message}`,
      },
      { status: 500 }
    );
  }
}
