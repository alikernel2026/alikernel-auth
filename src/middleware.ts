import { defineMiddleware } from "astro:middleware";

const GOOGLE_CLIENT_ID = "617149480177-aimcujc67q4307sk43li5m6pr54vj1jv.apps.googleusercontent.com";

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
    url.pathname.startsWith('/contact') ||
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

  // ===== سكريبت مزامنة الهيدر (موجود سابقاً) =====
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

  // ===== Google One Tap - يُحقن في كل صفحات Blogger =====
  const oneTapDiv = `<div id="g_id_onload"
    data-client_id="${GOOGLE_CLIENT_ID}"
    data-callback="handleOneTapCredential"
    data-auto_prompt="true"
    data-cancel_on_tap_outside="false"
    data-context="signin"
    data-itp_support="true"
    style="position:fixed;top:0;right:0;z-index:99999;">
  </div>`;

  const oneTapScript = `<script src="https://accounts.google.com/gsi/client" async defer><\/script>
<script>
window.handleOneTapCredential = async function(googleResponse) {
  // إذا كان المستخدم مسجلاً بالفعل لا نكرر العملية
  if (localStorage.getItem('last_uid')) return;
  try {
    var res = await fetch('/api/auth/sign-in/id-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'google',
        idToken: googleResponse.credential,
        callbackURL: '/account'
      })
    });
    if (res.ok) {
      var data = await res.json();
      // حفظ بيانات المستخدم في localStorage لتحديث الهيدر
      if (data && data.user) {
        localStorage.setItem('last_uid', data.user.id);
        if (data.user.image) localStorage.setItem('userPhotoURL', data.user.image);
        localStorage.setItem('auth_event', Date.now().toString());
        window.location.reload();
      } else {
        // إذا نجح الطلب لكن بدون بيانات، انتقل للحساب
        window.location.href = '/account';
      }
    } else {
      // فشل - أرسل المستخدم لصفحة تسجيل الدخول العادية
      console.error('One Tap failed, status:', res.status);
      window.location.href = '/login';
    }
  } catch(err) {
    console.error('One Tap error:', err);
    window.location.href = '/login';
  }
};
<\/script>`;

  // حقن One Tap بعد <body> مباشرة (إذا وُجد)، وإلا قبل </body>
  if (cleanHtml.includes('<body')) {
    cleanHtml = cleanHtml.replace(/(<body[^>]*>)/, '$1' + oneTapDiv);
  }

  cleanHtml = cleanHtml.replace('</body>', oneTapScript + syncScript + '</body>');

  return new Response(cleanHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
