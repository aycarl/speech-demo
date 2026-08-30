export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API endpoint to process audio
    if (url.pathname === "/api/transcribe" && request.method === "POST") {
      try {
        const blob = await request.arrayBuffer();
        const input = {
          audio: [...new Uint8Array(blob)]
        };

        // Run Whisper on Cloudflare's serverless edge GPUs
        const response = await env.AI.run("@cf/openai/whisper", input);

        return Response.json(response);
      } catch (err) {
        return Response.json({ error: err.message }, { status: 500 });
      }
    }

    // Return 404 for unmatched non-asset routes
    return new Response("Not Found", { status: 404 });
  },
};
