import { serve } from "bun";
import index from "./index.html";

const server = serve({
<<<<<<< HEAD
  routes: {
    "/public/*": async (req) => {
      const url = new URL(req.url);
      const file = Bun.file(`./src${url.pathname}`);

      if (await file.exists()) {
        return new Response(file);
      }

      return new Response("Not found", { status: 404 });
    },

    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT(req) {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({ message: `Hello, ${name}!` });
    },
=======
  async fetch(req) {
    const url = new URL(req.url);

    // API routes
    if (url.pathname === "/api/hello") {
      return Response.json({ message: "Hello, world!" });
    }
    if (url.pathname.startsWith("/api/hello/")) {
      const name = url.pathname.split("/").pop();
      return Response.json({ message: `Hello, ${name}!` });
    }

    // Serve static files from public/ with proper content types
    if (
      url.pathname.startsWith("/public/") ||
      url.pathname.startsWith("/src/public/")
    ) {
      const filePath = `.${url.pathname}`;
      const file = Bun.file(filePath);

      if (await file.exists()) {
        // Set proper content type based on file extension
        let contentType = "application/octet-stream";
        if (filePath.endsWith(".gltf")) {
          contentType = "model/gltf+json";
        } else if (filePath.endsWith(".bin")) {
          contentType = "application/octet-stream";
        } else if (filePath.endsWith(".glb")) {
          contentType = "model/gltf-binary";
        }

        return new Response(file, {
          headers: { "Content-Type": contentType },
        });
      }
    }

    // Serve and transpile TypeScript/TSX files
    if (
      url.pathname.startsWith("/src/") &&
      (url.pathname.endsWith(".ts") || url.pathname.endsWith(".tsx"))
    ) {
      const filePath = `.${url.pathname}`;
      const file = Bun.file(filePath);

      if (await file.exists()) {
        const transpiled = await Bun.build({
          entrypoints: [filePath],
          target: "browser",
        });

        const output = await transpiled.outputs[0].text();
        return new Response(output, {
          headers: { "Content-Type": "application/javascript" },
        });
      }
    }

    // Default to index.html
    return new Response(Bun.file("./src/index.html"));
>>>>>>> 632b6ef (Added earth)
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
