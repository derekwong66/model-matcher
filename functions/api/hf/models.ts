// Cloudflare Pages Function — proxies /api/hf/models* → https://huggingface.co/api/models*
export const onRequest: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const hfUrl = `https://huggingface.co/api/models${url.search}`;

  const response = await fetch(hfUrl, {
    headers: {
      "User-Agent": "ModelMatcher/1.0",
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300",
    },
  });
};
