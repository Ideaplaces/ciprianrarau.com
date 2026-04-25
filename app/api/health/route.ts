export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export function GET(): Response {
  return new Response(
    JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  );
}
