import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getValidatedUserId } from "@/lib/auth/get-user";

const createClientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  company: z.string().optional(),
  contactInfo: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const clients = await prisma.client.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        company: true,
        contactInfo: true,
        createdAt: true,
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedClients = clients.map(c => ({
      id: c.id,
      name: c.name,
      company: c.company,
      contactInfo: c.contactInfo,
      createdAt: c.createdAt,
      projectCount: c._count.projects,
    }));

    return NextResponse.json({ data: formattedClients }, { status: 200 });
  } catch (error) {
    console.error("GET /api/clients error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getValidatedUserId(request);
    if (!userId) {
      return NextResponse.json(
        { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createClientSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { name, company, contactInfo } = result.data;

    const client = await prisma.client.create({
      data: {
        userId,
        name,
        company,
        contactInfo,
      },
      select: {
        id: true,
        name: true,
        company: true,
        contactInfo: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data: { ...client, projectCount: 0 } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/clients error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
