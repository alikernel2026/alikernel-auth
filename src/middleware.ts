import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_astro') ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css')) {
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

  const logoutScript = '<script src="/logout.js"></script>';
  
  if (html.includes('</head>')) {
    html = html.replace('</head>', logoutScript + '</head>');
  } else if (html.includes('</body>')) {
    html = html.replace('</body>', logoutScript + '</body>');
  }

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
