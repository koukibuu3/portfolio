export function GET() {
  return new Response('Preview is no longer available.', {
    status: 410,
    headers: { 'Cache-Control': 'no-store' },
  })
}
