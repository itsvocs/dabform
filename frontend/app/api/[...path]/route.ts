//app/api/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  const pathString = path.join("/");
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${pathString}${searchParams ? `?${searchParams}` : ""}`;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  // Content-Type nur für JSON-Requests setzen
  if (["POST", "PUT", "PATCH"].includes(method)) {
    headers["Content-Type"] = "application/json";
  }

  const body = ["POST", "PUT", "PATCH"].includes(method)
    ? await request.text()
    : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  // Content-Type vom Backend prüfen
  const contentType = response.headers.get("Content-Type") || "";

  // PDF oder andere binäre Daten direkt weiterleiten
  if (
    contentType.includes("application/pdf") ||
    contentType.includes("application/octet-stream") ||
    contentType.includes("image/")
  ) {
    const buffer = await response.arrayBuffer();

    // Alle relevanten Headers übernehmen
    const responseHeaders: Record<string, string> = {
      "Content-Type": contentType,
    };

    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      responseHeaders["Content-Disposition"] = contentDisposition;
    }

    return new NextResponse(buffer, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  // JSON-Responses wie bisher
  if (response.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path, "GET");
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path, "POST");
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const params = await context.params;
  return proxyRequest(request, params.path, "DELETE");
}
