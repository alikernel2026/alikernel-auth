import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        provider: "libsql",
        // قمت بتعديل اسم المتغير ليطابق ما وضعناه في فيرسل
        url: process.env.TURSO_CONNECTION_URL || "", 
        authToken: process.env.TURSO_AUTH_TOKEN || "",
    },
    // تأكدي أن BETTER_AUTH_URL في فيرسل هو https://www.alikernel.com
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
