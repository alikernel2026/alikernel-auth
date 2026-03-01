import { betterAuth } from "better-auth";
import { drizzle } from "drizzle-orm/d1";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export function createAuth(env: any) {
  if (!env?.DB) throw new Error("Missing D1 binding: DB");

  const db = drizzle(env.DB);

  return betterAuth({
    baseURL: "https://www.alikernel.com",
    // هذا السطر ضروري جداً ولولاه سيفشل المشروع
    secret: env.BETTER_AUTH_SECRET, 
    
    database: drizzleAdapter(db, {
      provider: "sqlite", // لأن D1 تعمل بنظام sqlite
    }),

    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
    // لإصلاح مشاكل الكوكيز في النطاقات المخصصة
    trustedOrigins: ["https://www.alikernel.com"],
  });
}
