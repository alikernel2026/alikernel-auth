import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";

export const auth = betterAuth({
    database: {
        // هنا نستخدم المترجم الصحيح للاتصال بـ Turso
        dialect: new LibsqlDialect({
            url: process.env.TURSO_CONNECTION_URL || "", 
            authToken: process.env.TURSO_AUTH_TOKEN || "",
        }),
        type: "sqlite" // نخبر النظام أن نوع القاعدة هو SQLite
    },
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
