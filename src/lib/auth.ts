import { betterAuth } from "better-auth";
import { libsqlAdapter } from "better-auth/adapters/libsql";
import { createClient } from "@libsql/client";

const libsqlClient = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
});

export const auth = betterAuth({
    database: libsqlAdapter(libsqlClient),
    baseURL: process.env.BETTER_AUTH_URL, 
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, 
        updateAge: 60 * 60 * 24, 
    },
});
