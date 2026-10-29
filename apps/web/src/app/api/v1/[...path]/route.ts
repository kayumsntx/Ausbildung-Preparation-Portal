import { NextRequest, NextResponse } from 'next/server';

function getCandidateBaseUrls(): string[] {
  const configured = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    ''
  )
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/api\/v1$/, '');

  const prodUrl = 'https://ausbildung-preparation-portal.onrender.com';
  const localUrl = 'http://localhost:4000';

  if (
    process.env.RENDER ||
    (process.env.NODE_ENV === 'production' && (!configured || configured.includes('localhost')))
  ) {
    return [configured && !configured.includes('localhost') ? configured : prodUrl];
  }

  if (configured) {
    return configured === prodUrl ? [prodUrl] : [configured, prodUrl];
  }

  // In local development without explicit env var, try local NestJS backend first, then Render
  return [localUrl, prodUrl];
}

async function proxyRequest(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const joinedPath = Array.isArray(path) ? path.join('/') : '';
  const search = req.nextUrl.search || '';
  const baseUrls = getCandidateBaseUrls();

  const headers = new Headers();
  const contentType = req.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);

  const accept = req.headers.get('accept');
  if (accept) headers.set('Accept', accept);

  const auth = req.headers.get('authorization');
  if (auth) headers.set('Authorization', auth);

  const cookie = req.headers.get('cookie');
  if (cookie) headers.set('Cookie', cookie);

  const correlationId = req.headers.get('x-correlation-id');
  if (correlationId) headers.set('X-Correlation-ID', correlationId);

  const method = req.method.toUpperCase();
  const hasBody = method !== 'GET' && method !== 'HEAD';
  const bodyText = hasBody ? await req.text() : undefined;

  let lastError: any = null;

  for (const baseUrl of baseUrls) {
    const targetUrl = `${baseUrl}/api/v1/${joinedPath}${search}`;
    try {
      const upstreamResponse = await fetch(targetUrl, {
        method,
        headers,
        body: hasBody && bodyText ? bodyText : undefined,
        cache: 'no-store',
      });

      const responseText = await upstreamResponse.text();
      const responseHeaders = new Headers();

      const upstreamContentType = upstreamResponse.headers.get('content-type');
      if (upstreamContentType) {
        responseHeaders.set('Content-Type', upstreamContentType);
      }

      const upstreamCorrelationId = upstreamResponse.headers.get('x-correlation-id');
      if (upstreamCorrelationId) {
        responseHeaders.set('X-Correlation-ID', upstreamCorrelationId);
      }

      const setCookie = upstreamResponse.headers.get('set-cookie');
      if (setCookie) {
        responseHeaders.set('Set-Cookie', setCookie);
      }

      return new NextResponse(responseText, {
        status: upstreamResponse.status,
        headers: responseHeaders,
      });
    } catch (err: any) {
      lastError = err;
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'UPSTREAM_UNREACHABLE',
        message:
          lastError?.message ||
          'Unable to reach the backend API service. Please try again in a moment.',
      },
    },
    { status: 502 },
  );
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(req, context);
}

