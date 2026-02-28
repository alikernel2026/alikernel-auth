import { betterAuth } from "better-auth";
import { d1 } from "@better-auth/d1";

export const auth = (db: any) => betterAuth({
    database: d1(db),
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
