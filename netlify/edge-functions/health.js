// test edge functions only, run  curl -X POST ..../.netlify/functions/edge-functions/health to test this
export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }
  if (request.method !== 'GET' && request.method !== 'POST') {
    return new Response(
      JSON.stringify({
        error: 'Method not allowed',
        allowedMethods: ['GET', 'POST']
      }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
  const response = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    method: request.method,
    environment: typeof Deno !== 'undefined' ? 'edge' : 'development'
  };
  return new Response(
    JSON.stringify(response, null, 2),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    }
  );
};