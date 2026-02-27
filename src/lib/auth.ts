import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        url: import.meta.env.TURSO_DATABASE_URL || "",
        authToken: import.meta.env.TURSO_AUTH_TOKEN || "",
    },
    baseURL: "https://www.alikernel.com",
    trustedOrigins: ["https://www.alikernel.com"],
    socialProviders: {
        google: {
            clientId: import.meta.env.GOOGLE_CLIENT_ID || "",
            clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET || "",
        },
        github: {
            clientId: import.meta.env.GITHUB_CLIENT_ID || "",
            clientSecret: import.meta.env.GITHUB_CLIENT_SECRET || "",
        },
    }
});
