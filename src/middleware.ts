import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // 1. استثناء صفحات النظام
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_astro')) {
    return next();
  }

  // 2. سحب المحتوى من بلوجر
  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(bloggerUrl);
  
  const contentType = response.headers.get("content-type") || "";
  
  if (!contentType.includes("text/html")) {
    return response;
  }

  // 3. معالجة HTML
  let html = await response.text();
  html = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");

  // 4. إضافة سكربت تسجيل الخروج تلقائياً
  const logoutScript = `
<script>
document.addEventListener('click', function(e) {
    var target = e.target.closest('#logout-btn');
    if (!target) return;
    e.preventDefault();
    fetch('/api/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    })
    .then(function() {
        localStorage.clear();
        window.location.href = '/login';
    })
    .catch(function() {
        localStorage.clear();
        window.location.href = '/login';
    });
});
</script>`;

  html = html.replace('</body>', logoutScript + '</body>');

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
