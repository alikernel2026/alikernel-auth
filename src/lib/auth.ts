import { betterAuth } from "better-auth";
import { LibsqlDialect } from "@libsql/kysely-libsql";

export const auth = betterAuth({
    database: {
        dialect: new LibsqlDialect({
            // ملاحظة: استخدمي process.env لضمان التوافق مع Cloudflare
            url: process.env.TURSO_CONNECTION_URL || "",
            authToken: process.env.TURSO_AUTH_TOKEN || "",
        }),
        type: "sqlite"
    },
    // الرابط الأساسي هو دومين موقعك الرسمي
    baseURL: "https://www.alikernel.com",
    
    trustedOrigins: [
        "https://www.alikernel.com",
        "https://alikernel.com"
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        },
    }
});
