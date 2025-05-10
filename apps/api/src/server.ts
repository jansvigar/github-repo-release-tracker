import Fastify, { FastifyInstance } from "fastify";
import mercurius from "mercurius";
import { schema } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import "dotenv/config";

export const fastify: FastifyInstance = Fastify({
  logger:
    process.env.NODE_ENV !== "production"
      ? {
          transport: {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          },
        }
      : true,
});

fastify.register(mercurius, {
  schema,
  resolvers,
  graphiql: process.env.NODE_ENV !== "production",
});

fastify.get("/health-check", async (request, reply) => {
  reply.send({ status: "ok" });
});

try {
  await fastify.listen({ port: 3001 });
} catch (err) {
  fastify.log.error(err);
  console.error("Error starting server:", err);
  process.exit(1);
}
