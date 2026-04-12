// failEffect.js
// Show a visual effect for quiz failure
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
        failOverlay.style.background = 'rgba(220, 38, 38, 0.85)';
        failOverlay.style.display = 'flex';
        failOverlay.style.justifyContent = 'center';
        failOverlay.style.alignItems = 'center';
        failOverlay.style.zIndex = 10001;
        failOverlay.style.animation = 'fadeInFail 1s';
        failOverlay.innerHTML = '<div style="color:white;font-size:2.2rem;font-weight:bold;text-align:center;">❌ Try Again!<br>Don\'t give up!</div>';
        document.body.appendChild(failOverlay);
        setTimeout(() => {
            failOverlay.style.opacity = 0;
            setTimeout(() => failOverlay.remove(), 1200);
        }, 1800);
    }
}

// Add fadeInFail animation to the page if not present
(function addFailKeyframes() {
    if (!document.getElementById('failKeyframes')) {
        const style = document.createElement('style');
        style.id = 'failKeyframes';
        style.innerHTML = `@keyframes fadeInFail { from { opacity: 0; } to { opacity: 1; } }`;
        document.head.appendChild(style);
    }
})();
