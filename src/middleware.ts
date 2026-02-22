import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  
  // 1. استثناء صفحات تسجيل الدخول والحساب ومكتبة Better-Auth
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 2. جلب المحتوى من بلوجر "في الخلفية"
  const targetUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(targetUrl);
  let html = await response.text();

  // 3. السحر: تبديل الروابط "في الهواء" قبل أن يراها الزائر
  // هذا يجعل المتصفح يظن أن كل شيء ينتمي لـ alikernel.com
  const cleanHtml = html.replace(/alikernel\.blogspot\.com/g, 'www.alikernel.com');

  return new NextResponse(cleanHtml, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

// تحديد المسارات التي يعمل عليها الفلتر
export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
