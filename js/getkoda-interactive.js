/**
 * 🌌 GETKODA — INTERACTIVE EFFECTS & SHADERS (v2.0)
 * 1. Dynamic Cursor Spotlights on Glassmorphic Cards
 * 2. Circuit Tracer Scroll Progress Line
 * 3. Hero 3D Iridescent Glass Sculpture (WebGL / Three.js lightweight)
 */

(function () {
  'use strict';

  // --- 1. CURSOR SPOTLIGHT TRACKING ---
  function initSpotlights() {
    const cards = document.querySelectorAll('.solution-card, .gk-card-glass, .hardware-card, .infra-card, .demo-card');

    cards.forEach(card => {
      // Cria a camada de spotlight se ainda não existir
      let layer = card.querySelector('.gk-spotlight-layer');
      if (!layer) {
        layer = document.createElement('div');
        layer.className = 'gk-spotlight-layer';
        card.prepend(layer);
      }

      // Identifica a cor do pilar
      let spotlightColor = 'rgba(0, 85, 255, 0.16)';
      const metaText = (card.textContent || '').toLowerCase();
      if (metaText.includes('saúde') || metaText.includes('clínica') || metaText.includes('moda') || metaText.includes('artesanato')) {
        spotlightColor = 'rgba(13, 148, 136, 0.18)'; // Cyber Teal
      } else if (metaText.includes('hotel') || metaText.includes('fidelidade') || metaText.includes('ia')) {
        spotlightColor = 'rgba(109, 40, 217, 0.18)'; // Deep AI Violet
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        layer.style.background = `radial-gradient(380px circle at ${x}px ${y}px, ${spotlightColor}, transparent 75%)`;
      });

      card.addEventListener('mouseleave', () => {
        layer.style.background = 'none';
      });
    });
  }

  // --- 2. CIRCUIT TRACER (BARRA LATERAL DE SCROLL) ---
  function initCircuitTracer() {
    if (document.querySelector('.gk-circuit-tracer')) return;
    if (window.innerWidth < 900) return;

    const tracer = document.createElement('div');
    tracer.className = 'gk-circuit-tracer';
    tracer.innerHTML = `
      <div class="gk-circuit-fill" id="gk-circuit-fill"></div>
      <div class="gk-circuit-label">GetKoda • Phygital</div>
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

  // --- 3. HERO 3D IRIDESCENT TRANSLUCENT GLASS SCULPTURE ---
  function initHero3D() {
    const container = document.getElementById('gk-hero-3d-canvas');
    if (!container) return;

    // Se Three.js não estiver disponível, desenhamos um canvas interativo caustics de alta performance
    if (typeof THREE === 'undefined') {
      renderFallbackCaustics(container);
      return;
    }

    try {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 320;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 4.2;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Geometria Poliédrica de Luxo (Icosaedro Chanfrado / Torus Knot minimalista)
      const geometry = new THREE.IcosahedronGeometry(1.4, 0);
      
      // Material Translúcido com Brilho Cromado e Reflexão Cáustica (GetKoda Spec)
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x0055FF,
        emissive: 0x0D9488,
        emissiveIntensity: 0.28,
        metalness: 0.85,
        roughness: 0.12,
        transparent: true,
        opacity: 0.82,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        wireframe: false
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Wireframe sutil sobreposto para estética futurista
      const wireGeo = new THREE.WireframeGeometry(geometry);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.22 });
      const wireframe = new THREE.LineSegments(wireGeo, wireMat);
      mesh.add(wireframe);

      // Luzes do Espectro GetKoda
      const lightBlue = new THREE.PointLight(0x0055FF, 3.5, 50);
      lightBlue.position.set(4, 4, 4);
      scene.add(lightBlue);

      const lightTeal = new THREE.PointLight(0x0D9488, 3.0, 50);
      lightTeal.position.set(-4, -2, 3);
      scene.add(lightTeal);

      const lightViolet = new THREE.PointLight(0x6D28D9, 3.5, 50);
      lightViolet.position.set(0, -4, -2);
      scene.add(lightViolet);

      const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.6);
      scene.add(ambLight);

      // Mouse Inertia Tilt
      let mouseX = 0, mouseY = 0;
      let targetX = 0, targetY = 0;

      window.addEventListener('mousemove', (e) => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouseX = (e.clientX - cx) / cx;
        mouseY = (e.clientY - cy) / cy;
      }, { passive: true });

      let clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotação suave contínua
        mesh.rotation.y = elapsedTime * 0.35;
        mesh.rotation.x = Math.sin(elapsedTime * 0.25) * 0.25;

        // Balanço orgânico Float
        mesh.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

        // Inércia com o ponteiro do mouse
        targetX += (mouseX * 0.45 - targetX) * 0.05;
        targetY += (mouseY * 0.45 - targetY) * 0.05;
        mesh.rotation.z = targetX;
        mesh.rotation.x += targetY * 0.3;

        renderer.render(scene, camera);
      }

      animate();

      window.addEventListener('resize', () => {
        const w = container.clientWidth || 320;
        const h = container.clientHeight || 320;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, { passive: true });

    } catch (err) {
      console.warn('Three.js initialization skipped, rendering caustics fallback:', err);
      renderFallbackCaustics(container);
    }
  }

  // Fallback Canvas Caustics (para quando WebGL Three.js não for carregado)
  function renderFallbackCaustics(container) {
    if (!container) return;
    container.innerHTML = `
      <div style="position:relative; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:220px; height:220px; border-radius:50%; background:radial-gradient(circle, rgba(0,85,255,0.4) 0%, rgba(13,148,136,0.3) 50%, rgba(109,40,217,0.4) 100%); filter:blur(36px); animation:gk-pulse-glow 6s infinite alternate ease-in-out;"></div>
        <div style="position:relative; width:160px; height:160px; border-radius:36px; background:linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.02) 100%); border:1px solid rgba(255,255,255,0.4); backdrop-filter:blur(24px); box-shadow:0 20px 50px rgba(0,85,255,0.3), inset 0 1.5px 0 rgba(255,255,255,0.8); display:flex; align-items:center; justify-content:center; transform:rotate(-8deg);">
          <svg width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="url(#gk-grad-icon)" stroke-width="2.2" stroke-linecap="round">
            <defs>
              <linearGradient id="gk-grad-icon" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0055FF"/>
                <stop offset="50%" stop-color="#0D9488"/>
                <stop offset="100%" stop-color="#8B5CF6"/>
              </linearGradient>
            </defs>
            <path d="M6 8.32a7.43 7.43 0 0 1 0 7.36"/><path d="M9.46 6.21a11.76 11.76 0 0 1 0 11.58"/><path d="M12.91 4.1a16.1 16.1 0 0 1 0 15.8"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes gk-pulse-glow {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.35; }
          100% { transform: scale(1.15) rotate(45deg); opacity: 0.65; }
        }
      </style>
    `;
  }

  // Inicialização no DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSpotlights();
      initCircuitTracer();
      initHero3D();
    });
  } else {
    initSpotlights();
    initCircuitTracer();
    initHero3D();
  }
})();
