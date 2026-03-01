import { betterAuth } from "better-auth";

export function createAuth(env: any) {
  return betterAuth({
    baseURL: "https://www.alikernel.com",
    secret: env.BETTER_AUTH_SECRET,
    database: env.DB,
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
