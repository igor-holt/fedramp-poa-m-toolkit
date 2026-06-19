export default {
  async fetch(request, env) {
    if (request.method === 'POST') {
      const data = await request.json();
      
      console.log('DTS Telemetry received:', data);
      
      return new Response(JSON.stringify({
        success: true,
        message: 'DTS event accepted',
        dts: data.metrics?.dts
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response('DTS Telemetry Worker - Genesis Conductor', { status: 200 });
  }
};