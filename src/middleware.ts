import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

if (url.pathname.startsWith('/login') || 
    url.pathname.startsWith('/logout') ||
    url.pathname.startsWith('/account') || 
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/_astro') ||
    url.pathname.startsWith('/about') ||
    url.pathname.startsWith('/privacy') ||
    url.pathname.startsWith('/terms') ||
    url.pathname.startsWith('/content-transfer') ||
    url.pathname.startsWith('/content-center')) {
  return next();
  }

  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(bloggerUrl);
  
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) { return response; }

  let html = await response.text();
  let cleanHtml = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");
  cleanHtml = cleanHtml.replace("href='#' id='logout-btn'", "href='/logout' id='logout-btn'");

  const syncScript = `<script>
function updateHeaderUI() {
  var photoURL = localStorage.getItem('userPhotoURL');
  var lastUid = localStorage.getItem('last_uid');
  var avatarIcon = document.getElementById('user-avatar-icon');
  var profileIcon = document.getElementById('profile-icon');
  var userMenu = document.getElementById('user-menu');
  var guestMenu = document.getElementById('guest-menu');
  if (lastUid && photoURL) {
    if (avatarIcon) { avatarIcon.src = photoURL; avatarIcon.style.setProperty('display','block','important'); avatarIcon.classList.remove('hidden'); }
    if (profileIcon) { profileIcon.style.setProperty('display','none','important'); }
    if (userMenu) userMenu.style.setProperty('display','block','important');
    if (guestMenu) guestMenu.style.setProperty('display','none','important');
  } else {
    if (avatarIcon) { avatarIcon.style.setProperty('display','none','important'); }
    if (profileIcon) { profileIcon.style.setProperty('display','block','important'); }
    if (userMenu) userMenu.style.setProperty('display','none','important');
    if (guestMenu) guestMenu.style.setProperty('display','block','important');
  }
}
updateHeaderUI();
window.addEventListener('storage', function(e) {
  if (e.key === 'auth_event') { updateHeaderUI(); }
});
<\/script>`;

  cleanHtml = cleanHtml.replace('</body>', syncScript + '</body>');
  return new Response(cleanHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
