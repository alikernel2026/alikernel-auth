import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client";

const client = createClient({
    url: import.meta.env.TURSO_DATABASE_URL || "",
    authToken: import.meta.env.TURSO_AUTH_TOKEN || "",
});

export const auth = betterAuth({
    database: {
        db: client,
        type: "sqlite"
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
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
    },
});
