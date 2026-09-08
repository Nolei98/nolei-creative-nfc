/**
 * app.js — Controlador principal
 */

document.addEventListener('DOMContentLoaded', () => {
    // Splash
    if (typeof initSplash === 'function') initSplash();
    else if (typeof window.initSplash === 'function') window.initSplash();

    // Analytics
    if (typeof detectAccessChannel === 'function') detectAccessChannel();
    else if (typeof window.detectAccessChannel === 'function') window.detectAccessChannel();
    if (typeof renderChannelBadge === 'function') renderChannelBadge();
    else if (typeof window.renderChannelBadge === 'function') window.renderChannelBadge();

    // Demo modules
    if (typeof window.initClinicDemo === 'function') window.initClinicDemo();
    if (typeof window.initRestaurantDemo === 'function') window.initRestaurantDemo();

    initDemoSwitcher();
    initScrollAnimations();
    initMobileMenu();
    initWhatsAppCTAs();
    initSmoothScroll();
});

// === DEMO SWITCHER ===
function initDemoSwitcher() {
    const switchBtns = document.querySelectorAll('.demo-switch-btn');
    const btnSimulate = document.getElementById('btn-simulate-tap');
    let activeDemo = 'clinic';

    switchBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.demo;
            if (target === activeDemo) return;

            switchBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            // Reset device to idle when switching demos
            const idle = document.getElementById('device-idle-state');
            const clinic = document.getElementById('demo-clinic-content');
            const restaurant = document.getElementById('demo-restaurant-content');

            if (clinic) { clinic.style.display = 'none'; clinic.style.opacity = '0'; }
            if (restaurant) { restaurant.style.display = 'none'; restaurant.style.opacity = '0'; }
            if (idle) idle.style.display = 'flex';

            if (typeof window.resetClinicDemo === 'function') window.resetClinicDemo();
            if (typeof window.resetRestaurantDemo === 'function') window.resetRestaurantDemo();

            activeDemo = target;

            // Update explainer text
            const explainer = document.getElementById('explanation-text');
            if (explainer) {
                explainer.innerHTML = '👆 Clique em <strong>"Simular Toque NFC"</strong> para iniciar a demonstração.';
            }
        });
    });

    if (btnSimulate) {
        btnSimulate.addEventListener('click', () => {
            const frame = document.getElementById('device-frame');
            const idle = document.getElementById('device-idle-state');

            // Visual feedback on device frame
            if (frame) {
                frame.classList.add('device-active');
                setTimeout(() => frame.classList.remove('device-active'), 1500);
            }

            // Hide idle
            if (idle) idle.style.display = 'none';

            // Hide both demos
            const clinic = document.getElementById('demo-clinic-content');
            const restaurant = document.getElementById('demo-restaurant-content');
            if (clinic) clinic.style.display = 'none';
            if (restaurant) restaurant.style.display = 'none';

            // Activate correct demo
            if (activeDemo === 'clinic' && typeof window.activateClinicDemo === 'function') {
                window.activateClinicDemo();
            } else if (activeDemo === 'restaurant' && typeof window.activateRestaurantDemo === 'function') {
                window.activateRestaurantDemo();
            }

            // Update explainer
            const explainer = document.getElementById('explanation-text');
            if (explainer) {
                if (activeDemo === 'clinic') {
                    explainer.innerHTML = '⭐ <strong>Clínica</strong>: Notas 4-5★ → Google. Notas 1-3★ → feedback privado. Ranking protegido.';
                } else {
                    explainer.innerHTML = '🍽️ <strong>Restaurante</strong>: Cardápio completo, ações de mesa e pedido via WhatsApp. Tudo num toque.';
                }
            }
        });
    }
}

// === SCROLL ANIMATIONS ===
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.roi-card').forEach((el, i) => {
        el.style.transitionDelay = `${i * 0.12}s`;
        observer.observe(el);
    });
}

// === MOBILE MENU ===
function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const nav = document.getElementById('nav-links');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => nav.classList.remove('active'));
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header')) nav.classList.remove('active');
    });
}

// === WHATSAPP CTAs ===
function initWhatsAppCTAs() {
    const PHONE = '5511999999999';
    const buttons = document.querySelectorAll('.btn-whatsapp, .btn-cta-whatsapp, .btn-order, .btn-primary[href="#contato"]');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Only intercept anchor/button clicks, not real links
            if (btn.tagName === 'A' && btn.getAttribute('href') !== '#') {
                // Let smooth scroll handle #contato etc. unless it's a whatsapp button
                if (!btn.classList.contains('btn-whatsapp') && 
                    !btn.classList.contains('btn-cta-whatsapp')) return;
            }
            e.preventDefault();

            const activeSwitch = document.querySelector('.demo-switch-btn.active');
            const demo = activeSwitch ? activeSwitch.dataset.demo : 'general';
            let source = 'general';
            if (btn.closest('.footer')) source = 'footer';
            else if (btn.closest('.hero')) source = 'hero';
            else if (btn.closest('.cta-section')) source = 'cta';
            else if (btn.closest('.demo-section')) source = 'demo';

            if (typeof window.createWhatsAppLink === 'function') {
                window.open(window.createWhatsAppLink(PHONE, demo, source), '_blank');
            }
        });
    });
}

// === SMOOTH SCROLL ===
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const headerH = document.querySelector('.header')?.offsetHeight || 0;
            const pos = target.getBoundingClientRect().top + window.pageYOffset - headerH;
            window.scrollTo({ top: pos, behavior: 'smooth' });
        });
    });
}
