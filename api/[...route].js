import { server } from "../dist/server/server.js";

export default async function handler(req, res) {
  try {
    // Get the route from Vercel's params
    const { route } = req.query;
    const path = Array.isArray(route)
      ? "/" + route.join("/")
      : "/" + (route || "");

    // Build the full URL
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = `${protocol}://${host}${path}${req.url.includes("?") ? "?" + req.url.split("?")[1] : ""}`;

    // Convert Node request to Fetch API request
    const init = {
      method: req.method,
      headers: { ...req.headers },
    };

    // Remove host-related headers to avoid conflicts
    delete init.headers.host;

    // Handle request body
    if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
      init.body =
        typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    }

    // Call the React Start server
    const response = await server.fetch(new URL(url), init);

    // Send response back to client
    res.statusCode = response.status;

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Handle response body
    if (response.body) {
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
    }

    res.end();
  } catch (error) {
    console.error("Error in API handler:", error);
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
    );
  }
}
