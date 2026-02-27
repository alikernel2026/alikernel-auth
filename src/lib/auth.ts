import { betterAuth } from "better-auth";
import { d1Adapter } from "better-auth/adapters/d1";

export const auth = (env: { DB: D1Database, BETTER_AUTH_SECRET: string, GOOGLE_CLIENT_ID: string, GOOGLE_CLIENT_SECRET: string, GITHUB_CLIENT_ID: string, GITHUB_CLIENT_SECRET: string }) => betterAuth({
    database: d1Adapter(env.DB), 
    secret: env.BETTER_AUTH_SECRET,
    baseURL: "https://www.alikernel.com",
    trustedOrigins: [
        "https://www.alikernel.com",
        "https://alikernel.com",
        "https://alikernel-auth.pages.dev"
    ],
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        },
    }
});
