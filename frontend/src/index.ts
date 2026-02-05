import { serve } from "bun";
import index from "./index.html";

const server = serve({
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
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
