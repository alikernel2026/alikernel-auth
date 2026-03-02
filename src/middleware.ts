import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_astro')) {
    return next();
  }

  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(bloggerUrl);
  
  const contentType = response.headers.get("content-type") || "";
  
  if (!contentType.includes("text/html")) {
    return response;
  }

  let html = await response.text();
  html = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");

  const logoutScript = '<script>document.addEventListener("click",function(e){var t=e.target.closest("#logout-btn");if(t){e.preventDefault();fetch("/api/auth/sign-out",{method:"POST",credentials:"include"}).then(function(){localStorage.clear();window.location.href="/login"}).catch(function(){localStorage.clear();window.location.href="/login"})}});</script>';

  // إضافة بعد <body> مباشرة
  html = html.replace(/<body[^>]*>/i, function(match) {
    return match + logoutScript;
  });

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
