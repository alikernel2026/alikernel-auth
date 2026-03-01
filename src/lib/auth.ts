import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client/web";

export function createAuth(env: any) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });

  return betterAuth({
    baseURL: "https://www.alikernel.com",
    secret: env.BETTER_AUTH_SECRET,
    database: {
      db: client,
      type: "sqlite",
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    trustedOrigins: ["https://www.alikernel.com"],
  });
}
