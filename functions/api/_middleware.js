export async function onRequest(context) {
    const { request, next, env } = context;
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
    };

    // Base URL for the remote third-party API you want to fetch from
    const API_BASE_URL = "https://servicios.ine.es/wstempus/js/";

    // Check if it is an OPTIONS request for CORS preflight
    if (request.method === "OPTIONS") {
        if (
            request.headers.get("Origin") !== null &&
            request.headers.get("Access-Control-Request-Method") !== null &&
            request.headers.get("Access-Control-Request-Headers") !== null
        ) {
            // Handle CORS preflight requests.
            return new Response(null, {
                headers: {
                    ...corsHeaders,
                    "Access-Control-Allow-Headers": request.headers.get(
                        "Access-Control-Request-Headers"
                    ),
                },
            });
        } else {
            // Handle standard OPTIONS request.
            return new Response(null, {
                headers: {
                    Allow: "GET, HEAD, POST, OPTIONS",
                },
            });
        }
    }

    const url = new URL(request.url);

    console.log(url.pathname);

    // Check if the pathname starts with '/api/' and remove it
    let modifiedPathname = url.pathname.startsWith('/api/') ? url.pathname.slice(5) : url.pathname;
    console.log(modifiedPathname);

    // This handles all paths dynamically by reusing the path part of the request URL
    let apiUrl = API_BASE_URL + modifiedPathname + '?' + url.searchParams.toString();

    console.log(apiUrl);

    // Rewrite the request to point to the API URL
    let apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
    });

    // Explicitly set the origin header to the target API
    apiRequest.headers.set("Origin", new URL(apiUrl).origin);

    // Fetch the API response
    let response = await fetch(apiRequest);

    // Recreate the response to modify headers for CORS
    response = new Response(response.body, response);
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.append("Vary", "Origin");

    return response;
}
