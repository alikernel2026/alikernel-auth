import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 1. استثناء صفحات النظام (تترك لـ Astro وفيرسل)
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_astro')) {
    return next();
  }

  // 2. سحب المحتوى من بلوجر في الخلفية
  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(bloggerUrl);
  
  const contentType = response.headers.get("content-type") || "";
  
  // إذا لم يكن المحتوى صفحة HTML (مثل الصور أو ملفات CSS)، مرره كما هو
  if (!contentType.includes("text/html")) {
    return response;
  }

  // 3. تبديل كل روابط بلوجر برابطك الخاص "في الهواء"
  let html = await response.text();
  let cleanHtml = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");

  // 4. حقن سكريبت تسجيل الخروج
  const logoutScript = `<script>
document.addEventListener('click', function(e) {
  var btn = e.target.closest('#logout-btn');
  if (!btn) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  fetch('/api/auth/sign-out', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  }).then(function() {
    ['userDisplayName','userEmail','userPhotoURL','last_uid','userJoinedDate','userSessionsHTMLCache'].forEach(function(k) { localStorage.removeItem(k); });
    window.location.href = '/login';
  });
}, true);
<\/script>`;

  cleanHtml = cleanHtml.replace('</body>', logoutScript + '</body>');

  return new Response(cleanHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
