/**
 * 🌌 NOLEI CREATIVE — INTERACTIVE SHADERS & 3D NFC SIGNAL WAVE (v2.0)
 * 1. 3D WebGL NFC Signal Wave Sculpture (Three.js)
 * 2. Dynamic Cursor Spotlights on Glassmorphic Cards
 * 3. Circuit Tracer Scroll Progress Indicator
 */

(function () {
  'use strict';

  // --- 1. CURSOR SPOTLIGHT TRACKING (LIGHT THEME) ---
  function initSpotlights() {
    const cards = document.querySelectorAll('.solution-card, .gk-card-glass, .hardware-card, .infra-card, .demo-card');

    cards.forEach(card => {
      let layer = card.querySelector('.gk-spotlight-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'gk-spotlight-layer';
        card.prepend(layer);
      }

      // Cores suaves para o fundo claro
      let spotlightColor = 'rgba(0, 85, 255, 0.08)';
      const metaText = (card.textContent || '').toLowerCase();
      if (metaText.includes('saúde') || metaText.includes('clínica') || metaText.includes('moda') || metaText.includes('artesanato')) {
        spotlightColor = 'rgba(13, 148, 136, 0.08)'; // Cyber Teal
      } else if (metaText.includes('hotel') || metaText.includes('fidelidade') || metaText.includes('ia')) {
        spotlightColor = 'rgba(109, 40, 217, 0.08)'; // Deep AI Violet
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        layer.style.background = `radial-gradient(350px circle at ${x}px ${y}px, ${spotlightColor}, transparent 75%)`;
      });

      card.addEventListener('mouseleave', () => {
        layer.style.background = 'none';
      });
    });
  }

  // --- 2. CIRCUIT TRACER (SCROLL PROGRESS) ---
  function initCircuitTracer() {
    if (document.querySelector('.gk-circuit-tracer')) return;
    if (window.innerWidth < 900) return;

    const tracer = document.createElement('div');
    tracer.className = 'gk-circuit-tracer';
    tracer.innerHTML = `
      <div class="gk-circuit-fill" id="gk-circuit-fill"></div>
      <div class="gk-circuit-label">Nolei Creative • NFC</div>
    `;
    document.body.appendChild(tracer);

    const fill = document.getElementById('gk-circuit-fill');

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (fill) fill.style.height = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
  }

  // --- 3. 3D NFC SIGNAL WAVE SCULPTURE (THREE.JS) ---
  function initHero3D() {
    const container = document.getElementById('gk-hero-3d-canvas');
    if (!container) return;

    // Se Three.js não estiver carregado, desenha fallback em Canvas 2D
    if (typeof THREE === 'undefined') {
      renderFallbackNfcCanvas(container);
      return;
    }

    try {
      const width = container.clientWidth || 340;
      const height = container.clientHeight || 280;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 0, 4.8);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // --- TAG NFC CENTRAL (Chip Phygital Cristalino) ---
      const chipGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.08, 36);
      const chipMat = new THREE.MeshPhysicalMaterial({
        color: 0x0055FF,
        emissive: 0x0D9488,
        emissiveIntensity: 0.45,
        metalness: 0.3,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.92
      });
      const chipMesh = new THREE.Mesh(chipGeo, chipMat);
      chipMesh.rotation.x = Math.PI / 2;
      rootGroup.add(chipMesh);

      // Anel metálico ao redor do chip central
      const ringGeo = new THREE.TorusGeometry(0.48, 0.025, 16, 48);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x38BDF8,
        metalness: 0.8,
        roughness: 0.2
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      rootGroup.add(ringMesh);

      // --- 3 ARCOS CONCÊNTRICOS DE SINAL / ONDAS DE RÁDIO NFC ---
      const waveConfigs = [
        { radius: 0.95, tube: 0.045, color: 0x0055FF, emissive: 0x0055FF, delay: 0 },
        { radius: 1.45, tube: 0.040, color: 0x0D9488, emissive: 0x0D9488, delay: 1 },
        { radius: 1.95, tube: 0.035, color: 0x6D28D9, emissive: 0x7C3AED, delay: 2 }
      ];

      const waveMeshes = [];

      waveConfigs.forEach((cfg, index) => {
        // Arco de onda de aprox. 110 graus (Math.PI * 0.62)
        const arcGeo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 64, Math.PI * 0.62);
        const arcMat = new THREE.MeshPhysicalMaterial({
          color: cfg.color,
          emissive: cfg.emissive,
          emissiveIntensity: 0.5,
          metalness: 0.2,
          roughness: 0.08,
          clearcoat: 1.0,
          transparent: true,
          opacity: 0.85
        });

        // Onda Direita
        const waveRight = new THREE.Mesh(arcGeo, arcMat);
        waveRight.rotation.z = -Math.PI * 0.31; // Centraliza a abertura para a direita
        rootGroup.add(waveRight);
        waveMeshes.push({ mesh: waveRight, baseRadius: cfg.radius, baseScale: 1, delay: cfg.delay, index: index });

        // Onda Esquerda (simetria de transmissão phygital)
        const waveLeft = new THREE.Mesh(arcGeo, arcMat.clone());
        waveLeft.rotation.z = Math.PI - Math.PI * 0.31;
        rootGroup.add(waveLeft);
        waveMeshes.push({ mesh: waveLeft, baseRadius: cfg.radius, baseScale: 1, delay: cfg.delay, index: index });
      });

      // --- ILUMINAÇÃO DE ESPECTRO NOLEI ---
      const lightBlue = new THREE.PointLight(0x0055FF, 3.2, 20);
      lightBlue.position.set(3, 2, 3);
      scene.add(lightBlue);

      const lightTeal = new THREE.PointLight(0x0D9488, 2.8, 20);
      lightTeal.position.set(-3, -1, 2);
      scene.add(lightTeal);

      const lightViolet = new THREE.PointLight(0x6D28D9, 3.0, 20);
      lightViolet.position.set(0, 3, -1);
      scene.add(lightViolet);

      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9);
      scene.add(ambientLight);

      // --- MOUSE TILT INÉRCIA ---
      let mouseX = 0, mouseY = 0;
      let targetRotX = 0, targetRotY = 0;

      window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX = (e.clientX - cx) / cx;
        mouseY = (e.clientY - cy) / cy;
      }, { passive: true });

      const clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Pulsação contínua de ondas de radiofrequência NFC
        waveMeshes.forEach(w => {
          const pulse = Math.sin(elapsedTime * 2.8 - w.delay * 0.7);
          const scaleMod = 1 + pulse * 0.04;
          w.mesh.scale.set(scaleMod, scaleMod, 1);
          
          if (w.mesh.material && w.mesh.material.emissiveIntensity !== undefined) {
            w.mesh.material.emissiveIntensity = 0.35 + (pulse * 0.5 + 0.5) * 0.45;
            w.mesh.material.opacity = 0.65 + (pulse * 0.5 + 0.5) * 0.3;
          }
        });

        // Pulso do chip central
        const chipPulse = Math.sin(elapsedTime * 3.5);
        chipMesh.scale.set(1 + chipPulse * 0.03, 1 + chipPulse * 0.03, 1);

        // Balanço orgânico Float
        rootGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.08;

        // Rotação suave contínua no eixo Y & inclinação com o cursor
        targetRotY += (mouseX * 0.45 - targetRotY) * 0.06;
        targetRotX += (mouseY * 0.35 - targetRotX) * 0.06;

        rootGroup.rotation.y = Math.sin(elapsedTime * 0.4) * 0.18 + targetRotY;
        rootGroup.rotation.x = Math.cos(elapsedTime * 0.3) * 0.12 - targetRotX * 0.6;
        rootGroup.rotation.z = Math.sin(elapsedTime * 0.25) * 0.05;

        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        const w = container.clientWidth || 340;
        const h = container.clientHeight || 280;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, { passive: true });

    } catch (e) {
      console.warn('Erro ao inicializar Three.js NFC Signal:', e);
      renderFallbackNfcCanvas(container);
    }
  }

  // --- FALLBACK INTERATIVO EM CANVAS 2D CASO WEBGL ESTEJA DESATIVADO ---
  function renderFallbackNfcCanvas(container) {
    const canvas = document.createElement('canvas');
    canvas.width = container.clientWidth || 340;
    canvas.height = container.clientHeight || 280;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let frame = 0;

    function drawFallback() {
      requestAnimationFrame(drawFallback);
      frame += 0.04;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Chip central
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, Math.PI * 2);
      ctx.fillStyle = '#0055FF';
      ctx.shadowColor = 'rgba(0, 85, 255, 0.4)';
      ctx.shadowBlur = 16;
      ctx.fill();

      // Ondas concêntricas NFC
      const radii = [50, 80, 110];
      radii.forEach((r, i) => {
        const pulse = (Math.sin(frame - i * 0.7) + 1) / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + pulse * 6, -Math.PI * 0.35, Math.PI * 0.35);
        ctx.strokeStyle = i === 0 ? '#0055FF' : (i === 1 ? '#0D9488' : '#6D28D9');
        ctx.lineWidth = 4.5;
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 12;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, r + pulse * 6, Math.PI - Math.PI * 0.35, Math.PI + Math.PI * 0.35);
        ctx.stroke();
      });
    }

    drawFallback();
  }

  // --- INICIALIZAÇÃO NO CARREGAMENTO DO DOM ---
  function init() {
    initSpotlights();
    initCircuitTracer();
    initHero3D();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
