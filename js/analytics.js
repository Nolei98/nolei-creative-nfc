/**
 * d:\Workspace\Colonizacao\js\analytics.js
 * Detecção de canal de acesso e trackeamento.
 */

window.detectAccessChannel = function() {
    // Não sobrescrever se já existir
    const existing = sessionStorage.getItem('nolei_attribution');
    if (existing) {
        return JSON.parse(existing);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const source = urlParams.get('source') || urlParams.get('utm_source');
    const medium = urlParams.get('medium') || urlParams.get('utm_medium');
    const loc = urlParams.get('loc') || urlParams.get('table') || urlParams.get('room');
    
    let channel = 'direct';

    if (source === 'nfc' || source === 'tap') {
        channel = 'nfc';
    } else if (source === 'qr' || source === 'scan') {
        channel = 'qr';
    } else if (document.referrer) {
        if (document.referrer.includes('instagram') || document.referrer.includes('facebook')) {
            channel = 'social';
        } else {
            channel = 'referral';
        }
    }

    const attribution = {
        channel: channel,
        medium: medium || null,
        locationId: loc || null,
        timestamp: new Date().toISOString()
    };

    sessionStorage.setItem('nolei_attribution', JSON.stringify(attribution));
    return attribution;
};

window.renderChannelBadge = function() {
    const attributionData = sessionStorage.getItem('nolei_attribution');
    if (!attributionData) return;
    
    const attribution = JSON.parse(attributionData);
    
    if (attribution.channel === 'direct') {
        return; // Não mostrar badge para direto
    }

    let badgeText = '';
    let accentClass = '';

    if (attribution.channel === 'nfc') {
        badgeText = '📡 NFC';
        accentClass = 'badge-mint';
    } else if (attribution.channel === 'qr') {
        badgeText = '📱 QR Code';
        accentClass = 'badge-cyan';
    } else if (attribution.channel === 'social') {
        badgeText = '📲 Social';
        accentClass = 'badge-purple';
    } else {
        badgeText = '🔗 Indicação';
        accentClass = 'badge-muted';
    }

    const badge = document.createElement('div');
    badge.className = `channel-badge ${accentClass}`;
    badge.textContent = badgeText;
    
    // Estilos inline caso não exista no CSS principal (ajuste conforme necessário)
    badge.style.position = 'fixed';
    badge.style.bottom = '20px';
    badge.style.right = '20px';
    badge.style.padding = '8px 16px';
    badge.style.borderRadius = '20px';
    badge.style.backgroundColor = 'rgba(25, 25, 25, 0.8)';
    badge.style.color = '#fff';
    badge.style.backdropFilter = 'blur(10px)';
    badge.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    badge.style.zIndex = '9999';
    badge.style.fontSize = '14px';
    badge.style.fontWeight = '500';
    badge.style.boxShadow = '0 4px 6px rgba(0,0,0,0.3)';

    if (accentClass === 'badge-mint') badge.style.border = '1px solid #00f2fe';
    if (accentClass === 'badge-cyan') badge.style.border = '1px solid #4facfe';

    document.body.appendChild(badge);
};

window.createWhatsAppLink = function(phone, selectedDemo, customerSource) {
    let message = '';
    
    if (selectedDemo === 'clinic') {
        message = `Olá! 👋 Testei a demo de Avaliações Google para Clínicas no site da Nolei Creative.\n\nGostaria de saber mais sobre as placas NFC. (Origem: ${customerSource})`;
    } else if (selectedDemo === 'restaurant') {
        message = `Olá! 👋 Testei a demo de Cardápio Digital para Restaurantes no site da Nolei Creative.\n\nGostaria de saber mais sobre as opções para meu estabelecimento. (Origem: ${customerSource})`;
    } else {
        message = `Olá! 👋 Visitei o site da Nolei Creative e me interessei pelas soluções NFC.\n\nGostaria de mais informações. (Origem: ${customerSource})`;
    }

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${phone}?text=${encodedMessage}`;
};
