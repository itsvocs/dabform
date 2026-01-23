//app/api/[...path]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = 'http://localhost:8000';

async function proxyRequest(
  request: NextRequest,
  path: string[],
  method: string
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  const pathString = path.join('/');
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/${pathString}${searchParams ? `?${searchParams}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const body = ['POST', 'PUT', 'PATCH'].includes(method)
    ? await request.text()
    : undefined;

  const response = await fetch(url, {
    method,
    headers,
    body,
  });

  const data = await response.json().catch(() => ({}));

  return NextResponse.json(data, {
    status: response.status,
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  return proxyRequest(request, params.path, 'DELETE');
}