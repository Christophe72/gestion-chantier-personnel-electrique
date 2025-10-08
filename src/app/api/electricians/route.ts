import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const electricians = await prisma.electrician.findMany();
    return Response.json(electricians);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la récupération des électriciens : ${message}`,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const electrician = await prisma.electrician.create({ data: body });
    return Response.json(electrician, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      { message: `Erreur lors de la création de l'électricien : ${message}` },
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
    // Correction préventive du format de date
    const updateData = { ...body };
    if (updateData.createdAt && updateData.createdAt.length === 10) {
      updateData.createdAt = new Date(updateData.createdAt).toISOString();
    }
    if (updateData.updatedAt && updateData.updatedAt.length === 10) {
      updateData.updatedAt = new Date(updateData.updatedAt).toISOString();
    }
    const electrician = await prisma.electrician.update({
      where: { id: body.id },
      data: updateData,
    });
    return Response.json(electrician);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la modification de l'électricien : ${message}`,
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
    await prisma.electrician.delete({ where: { id: body.id } });
    return Response.json({ message: "Électricien supprimé" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return Response.json(
      {
        message: `Erreur lors de la suppression de l'électricien : ${message}`,
      },
      { status: 500 }
    );
  }
}
