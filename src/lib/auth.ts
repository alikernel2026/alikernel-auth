import { betterAuth } from "better-auth";
import { createClient } from "@libsql/client/web";

const client = createClient({
    url: import.meta.env.TURSO_DATABASE_URL || "",
    authToken: import.meta.env.TURSO_AUTH_TOKEN || "",
});

export const auth = betterAuth({
    database: {
        db: client,
        type: "sqlite"
    },
    // التعديل: ربط الكود بالمفتاح السري لمنع انهيار السيرفر (Error 500)
    secret: import.meta.env.BETTER_AUTH_SECRET, 
    baseURL: "https://www.alikernel.com",
    // التعديل: إضافة كل الروابط الموثوقة لضمان عمل الأزرار في كل مكان
    trustedOrigins: [
        "https://www.alikernel.com",
        "https://alikernel.com",
        "https://alikernel-auth.pages.dev"
    ],
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
