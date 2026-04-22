import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

const updateClientSchema = z.object({
  name: z.string().min(1, "Client name is required").optional(),
  company: z.string().optional(),
  contactInfo: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: clientId } = await params;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
      select: {
        id: true,
        name: true,
        company: true,
        contactInfo: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            photoCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!client) {
      return NextResponse.json(
        { error: { message: "Client not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: client }, { status: 200 });
  } catch (error) {
    console.error("GET /api/clients/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: clientId } = await params;

    const existingClient = await prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: { message: "Client not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const result = updateClientSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { name, company, contactInfo } = result.data;

    const updatedClient = await prisma.client.update({
      where: { id: clientId },
      data: {
        name: name ?? existingClient.name,
        company: company ?? existingClient.company,
        contactInfo: contactInfo ?? existingClient.contactInfo,
      },
      select: {
        id: true,
        name: true,
        company: true,
        contactInfo: true,
        createdAt: true,
        updatedAt: true,
        projects: {
          select: {
            id: true,
            name: true,
            status: true,
            photoCount: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ data: updatedClient }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/clients/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const { id: clientId } = await params;

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!client) {
      return NextResponse.json(
        { error: { message: "Client not found", code: "NOT_FOUND" } },
        { status: 404 }
      );
    }

    await prisma.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json({ data: { success: true } }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/clients/[id] error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
