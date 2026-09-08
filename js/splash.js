/**
 * splash.js
 * Splash screen para acessos via NFC ou QR Code.
 * Rastreia cada canal separadamente para permitir demonstrações alternadas.
 */

window.initSplash = function() {
    const splashScreen = document.getElementById('splash-screen');
    if (!splashScreen) return;

    const urlParams = new URLSearchParams(window.location.search);
    const source = (urlParams.get('source') || '').toLowerCase();
    const splashText = document.getElementById('splash-text');

    // Se não tem source válido, esconde splash
    if (source !== 'nfc' && source !== 'qr') {
        splashScreen.style.display = 'none';
        return;
    }

    // Rastreia cada canal separadamente — permite demonstrar NFC e QR na mesma sessão
    const viewedKey = `nolei_splash_${source}`;
    if (sessionStorage.getItem(viewedKey) === 'true') {
        splashScreen.style.display = 'none';
        return;
    }

    // Texto contextualizado
    if (splashText) {
        splashText.textContent = source === 'nfc'
            ? 'Experiência ativada por NFC ✨'
            : 'QR Code escaneado com sucesso ✨';
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function dismissSplash() {
        if (splashScreen.classList.contains('fade-out')) return;
        splashScreen.classList.add('fade-out');
        sessionStorage.setItem(viewedKey, 'true');
        setTimeout(() => splashScreen.remove(), prefersReducedMotion ? 0 : 450);
    }

    // Auto dismiss
    setTimeout(dismissSplash, prefersReducedMotion ? 50 : 1200);

    // Hard timeout de segurança
    setTimeout(() => {
        if (document.getElementById('splash-screen')) {
            splashScreen.remove();
            sessionStorage.setItem(viewedKey, 'true');
        }
    }, 1500);
};
