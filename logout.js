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
