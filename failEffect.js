// failEffect.js
// عرض تأثير بصري عند فشل الاختبار (مع نص مُشكَّل)
function launchFailEffect() {
    // Create or select a fail overlay
    let failOverlay = document.getElementById('failOverlay');
    if (!failOverlay) {
        failOverlay = document.createElement('div');
        failOverlay.id = 'failOverlay';
        failOverlay.style.position = 'fixed';
        failOverlay.style.top = 0;
        failOverlay.style.left = 0;
        failOverlay.style.width = '100vw';
        failOverlay.style.height = '100vh';
        failOverlay.style.background = 'rgba(185, 28, 28, 0.92)';
        failOverlay.style.display = 'flex';
        failOverlay.style.justifyContent = 'center';
        failOverlay.style.alignItems = 'center';
        failOverlay.style.zIndex = 10001;
        failOverlay.style.animation = 'fadeInFail 0.9s ease-out';
        failOverlay.innerHTML = '<div style="color:#fff;font-size:2.2rem;font-weight:700;text-align:center;font-family: Amiri, \"Traditional Arabic\", Tajawal;">❌ لَا تَسْتَسْلِمْ!<br>حَاوِلْ مَرَّةً أُخْرَى</div>';
        document.body.appendChild(failOverlay);
        setTimeout(() => {
            failOverlay.style.transition = 'opacity 0.6s ease';
            failOverlay.style.opacity = 0;
            setTimeout(() => failOverlay.remove(), 800);
        }, 1600);
    }
}

// Add fadeInFail animation to the page if not present
(function addFailKeyframes() {
    if (!document.getElementById('failKeyframes')) {
        const style = document.createElement('style');
        style.id = 'failKeyframes';
        style.innerHTML = `@keyframes fadeInFail { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }`;
        document.head.appendChild(style);
    }
})();
