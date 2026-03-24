import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // استثناء المسارات الخاصة
  if (url.pathname.startsWith('/login') || 
      url.pathname.startsWith('/logout') ||
      url.pathname.startsWith('/account') || 
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_astro') ||
      url.pathname.startsWith('/about') ||
      url.pathname.startsWith('/privacy') ||
      url.pathname.startsWith('/terms') ||
      url.pathname.startsWith('/contact')) {
    return next();
  }

  // الدومين الصحيح بدون حرف L زائد
  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  
  try {
    const response = await fetch(bloggerUrl);
    const contentType = response.headers.get("content-type") || "";
    
    if (!contentType.includes("text/html")) { 
      return response; 
    }

    let html = await response.text();
    let cleanHtml = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");
    cleanHtml = cleanHtml.replace("href='#' id='logout-btn'", "href='/logout' id='logout-btn'");

    // السكربت الذكي: يتحقق من تسجيل الخروج قبل إظهار ون تاب
    const syncScript = `
<script src="https://accounts.google.com/gsi/client" async defer><\/script>
<div id="one-tap-container"><\/div>

<script>
function handleOneTap(response) {
  fetch('/api/auth/google-one-tap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: response.credential })
  }).then(res => {
    if (res.ok) {
       // تخزين بيانات تجريبية لتحديث الواجهة فوراً
       localStorage.setItem('auth_event', 'login_' + Date.now());
       window.location.reload();
    }
  });
}

function initGoogleOneTap() {
  const lastUid = localStorage.getItem('last_uid');
  // إذا لا يوجد UID يعني المستخدم مسجل خروج -> أظهر المربع
  if (!lastUid) {
    window.onload = function () {
      google.accounts.id.initialize({
        client_id: "617149480177-aimcujc67q4307sk43li5m6pr54vj1jv.apps.googleusercontent.com",
        callback: handleOneTap,
        auto_prompt: true,
        itp_support: true
      });
      google.accounts.id.prompt(); 
    };
  }
}

function updateHeaderUI() {
  var photoURL = localStorage.getItem('userPhotoURL');
  var lastUid = localStorage.getItem('last_uid');
  var avatarIcon = document.getElementById('user-avatar-icon');
  var profileIcon = document.getElementById('profile-icon');
  var userMenu = document.getElementById('user-menu');
  var guestMenu = document.getElementById('guest-menu');
  
  if (lastUid && photoURL) {
    if (avatarIcon) { avatarIcon.src = photoURL; avatarIcon.style.display = 'block'; }
    if (profileIcon) profileIcon.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (guestMenu) guestMenu.style.display = 'none';
  } else {
    if (avatarIcon) avatarIcon.style.display = 'none';
    if (profileIcon) profileIcon.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
    if (guestMenu) guestMenu.style.display = 'block';
  }
}

// تشغيل الوظائف
updateHeaderUI();
initGoogleOneTap();

window.addEventListener('storage', function(e) {
  if (e.key === 'auth_event' || e.key === 'last_uid') { updateHeaderUI(); }
});
<\/script>`;

    cleanHtml = cleanHtml.replace('</body>', syncScript + '</body>');
    return new Response(cleanHtml, { headers: { "content-type": "text/html; charset=utf-8" } });

  } catch (error) {
    return next();
  }
});
