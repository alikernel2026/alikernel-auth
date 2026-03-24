import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);

  // استثناء المسارات الخاصة بـ Astro والصفحات الثابتة
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

  // جلب المحتوى من Blogger (مع التأكد من اسم الدومين الصحيح alikernel)
  const bloggerUrl = `https://alikernel.blogspot.com${url.pathname}${url.search}`;
  const response = await fetch(bloggerUrl);
  
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) { return response; }

  let html = await response.text();
  
  // تنظيف الروابط وتعديل زر الخروج
  let cleanHtml = html.replace(/alikernel\.blogspot\.com/g, "www.alikernel.com");
  cleanHtml = cleanHtml.replace("href='#' id='logout-btn'", "href='/logout' id='logout-btn'");

  // السكربت المدمج الذي يحتوي على تحديث الـ UI وخاصية Google One Tap
  const syncScript = `
<script src="https://accounts.google.com/gsi/client" async defer><\/script>
<div id="g_id_onload"
     data-client_id="617149480177-aimcujc67q4307sk43li5m6pr54vj1jv.apps.googleusercontent.com"
     data-callback="handleOneTap"
     data-auto_prompt="true">
</div>

<script>
// معالجة تسجيل الدخول التلقائي من المربع
function handleOneTap(response) {
  fetch('/api/auth/google-one-tap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential: response.credential })
  }).then(res => {
    if (res.ok) window.location.reload(); // تحديث الصفحة عند النجاح
  });
}

// تحديث واجهة المستخدم (Header) بناءً على بيانات التخزين
function updateHeaderUI() {
  var photoURL = localStorage.getItem('userPhotoURL');
  var lastUid = localStorage.getItem('last_uid');
  var avatarIcon = document.getElementById('user-avatar-icon');
  var profileIcon = document.getElementById('profile-icon');
  var userMenu = document.getElementById('user-menu');
  var guestMenu = document.getElementById('guest-menu');
  
  if (lastUid && photoURL) {
    if (avatarIcon) { 
      avatarIcon.src = photoURL; 
      avatarIcon.style.setProperty('display','block','important'); 
      avatarIcon.classList.remove('hidden'); 
    }
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

// تشغيل التحديث فور التحميل وعند أي تغيير في التخزين
updateHeaderUI();
window.addEventListener('storage', function(e) {
  if (e.key === 'auth_event' || e.key === 'last_uid') { updateHeaderUI(); }
});
<\/script>`;

  // حقن السكربت قبل إغلاق وسام الـ body
  cleanHtml = cleanHtml.replace('</body>', syncScript + '</body>');
  
  return new Response(cleanHtml, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
});
