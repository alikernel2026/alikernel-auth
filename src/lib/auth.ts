import { betterAuth } from "better-auth";

export function createAuth(env: any) {
    return betterAuth({
        database: {
            url: env.TURSO_DATABASE_URL || "",
            authToken: env.TURSO_AUTH_TOKEN || "",
        },
        baseURL: "https://www.alikernel.com",
        trustedOrigins: ["https://www.alikernel.com"],
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID || "",
                clientSecret: env.GOOGLE_CLIENT_SECRET || "",
            },
            github: {
                clientId: env.GITHUB_CLIENT_ID || "",
                clientSecret: env.GITHUB_CLIENT_SECRET || "",
            },
        }
    });
}
