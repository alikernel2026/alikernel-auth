import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/logout') ||
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
  let cleanHtml = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");
  cleanHtml = cleanHtml.replace("href='#' id='logout-btn'", "href='/logout' id='logout-btn'");

  return new Response(cleanHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
