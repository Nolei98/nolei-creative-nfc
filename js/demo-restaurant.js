/**
 * demo-restaurant.js
 * Lógica interativa para a demonstração do Cardápio Digital do Restaurante Nolei
 */

(function () {
  const menuData = {
    entradas: [
      { name: 'Bruschetta Caprese', price: 'R$ 28,90', description: 'Tomate cereja, muçarela de búfala, manjericão fresco e redução de balsâmico', badges: ['vegetariano'], emoji: '🍅' },
      { name: 'Carpaccio de Abobrinha', price: 'R$ 32,00', description: 'Lâminas finas de abobrinha grelhada com pesto de rúcula e lascas de parmesão', badges: ['vegano', 'sem-gluten'], emoji: '🥒' },
      { name: 'Croquetas de Jamón', price: 'R$ 34,90', description: 'Croquetes crocantes recheados com presunto ibérico e molho aioli', badges: [], emoji: '🧆' }
    ],
    principais: [
      { name: 'Risoto de Funghi', price: 'R$ 58,90', description: 'Arroz arbóreo cremoso com mix de cogumelos frescos, trufa negra e parmesão 24 meses', badges: ['vegetariano', 'sem-gluten'], emoji: '🍄' },
      { name: 'Salmão Grelhado', price: 'R$ 72,00', description: 'Salmão fresco grelhado na brasa com purê de batata-doce e aspargos', badges: ['sem-gluten'], emoji: '🐟' },
      { name: 'Burger Artesanal', price: 'R$ 45,90', description: 'Blend de carnes nobres, queijo gruyère, cebola caramelizada no brioche artesanal', badges: [], emoji: '🍔' }
    ],
    bebidas: [
      { name: 'Limonada Siciliana', price: 'R$ 18,90', description: 'Limão siciliano fresco com hortelã e água com gás', badges: ['vegano'], emoji: '🍋' },
      { name: 'Gin Tônica Botânica', price: 'R$ 38,00', description: 'Gin artesanal, tônica premium, pepino, alecrim e zimbro', badges: [], emoji: '🍸' },
      { name: 'Suco Detox Verde', price: 'R$ 22,00', description: 'Couve, maçã verde, gengibre, limão e hortelã', badges: ['vegano', 'sem-gluten'], emoji: '🥤' }
    ],
    sobremesas: [
      { name: 'Petit Gâteau', price: 'R$ 32,00', description: 'Bolo quente de chocolate belga com centro derretido, sorvete de baunilha', badges: ['vegetariano'], emoji: '🍫' },
      { name: 'Cheesecake de Frutas Vermelhas', price: 'R$ 28,90', description: 'Cheesecake cremoso com calda de frutas vermelhas frescas da estação', badges: ['vegetariano'], emoji: '🍰' }
    ]
  };

  const badgeMapping = {
    'vegano': { label: '🌱 Vegano', class: 'badge-vegano' },
    'vegetariano': { label: '🥬 Vegetariano', class: 'badge-vegetariano' },
    'sem-gluten': { label: '🚫 Sem Glúten', class: 'badge-sem-gluten' }
  };

  let restaurantContainer = null;
  let deviceScreen = null;
  let menuItemsContainer = null;
  let tabs = [];
  let actionButtons = [];
  let orderButton = null;
  let activeToast = null;
  let toastTimeout = null;

  function initRestaurantDemo() {
    restaurantContainer = document.querySelector('#demo-restaurant-content');
    deviceScreen = document.querySelector('.device-screen');
    
    if (!restaurantContainer) return;

    menuItemsContainer = restaurantContainer.querySelector('.menu-items');
    if (!menuItemsContainer) {
      // Cria o container se não existir no HTML inicial
      menuItemsContainer = document.createElement('div');
      menuItemsContainer.className = 'menu-items';
      restaurantContainer.appendChild(menuItemsContainer);
    }

    // Configuração das abas
    tabs = Array.from(restaurantContainer.querySelectorAll('.menu-tab'));
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = e.target.dataset.category;
        if (category) {
          handleTabClick(category, e.target);
        }
      });
    });

    // Ações de mesa
    actionButtons = Array.from(restaurantContainer.querySelectorAll('.table-action-btn'));
    actionButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const text = e.target.textContent.trim().toLowerCase();
        if (text.includes('garçom')) {
          showToast('Garçom notificado! ✅');
        } else if (text.includes('conta')) {
          showToast('Conta solicitada! ✅');
        } else if (text.includes('wi-fi') || text.includes('wifi')) {
          showToast('Rede: Botanico_5G | Senha: bemvindo2024');
        }
      });
    });

    // Botão de fazer pedido
    orderButton = restaurantContainer.querySelector('.btn-order');
    if (orderButton) {
      orderButton.addEventListener('click', (e) => {
        const originalText = orderButton.textContent;
        orderButton.textContent = 'Abrindo WhatsApp... 📱';
        setTimeout(() => {
          orderButton.textContent = originalText;
        }, 1000);
      });
    }

    // Estilos dinâmicos necessários para a demo
    addDynamicStyles();
  }

  function handleTabClick(category, activeTabElement) {
    // Atualiza styling
    tabs.forEach(t => t.classList.remove('active'));
    if (activeTabElement) activeTabElement.classList.add('active');
    
    renderMenuItems(category);
  }

  function renderMenuItems(category) {
    if (!menuItemsContainer) return;
    
    menuItemsContainer.innerHTML = '';
    const items = menuData[category] || [];
    
    items.forEach((item, index) => {
      const delay = index * 80; // 80ms de stagger
      
      const card = document.createElement('div');
      card.className = 'menu-item-card fade-in-up';
      card.style.animationDelay = `${delay}ms`;
      
      let badgesHtml = '';
      item.badges.forEach(badge => {
        const b = badgeMapping[badge];
        if (b) {
          badgesHtml += `<span class="badge ${b.class}">${b.label}</span>`;
        }
      });

      card.innerHTML = `
        <div class="item-emoji">${item.emoji}</div>
        <div class="item-info">
          <div class="item-header">
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price}</span>
          </div>
          <p class="item-description">${item.description}</p>
          <div class="item-badges">${badgesHtml}</div>
        </div>
      `;

      // Efeito 3D Tilt
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);

      menuItemsContainer.appendChild(card);
    });
  }

  function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max rotation 8 degrees
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    
    requestAnimationFrame(() => {
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease-out';
    });
  }

  function resetTilt(e) {
    const card = e.currentTarget;
    requestAnimationFrame(() => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.4s ease-out';
    });
  }

  function showToast(message) {
    if (!deviceScreen) return;
    
    if (activeToast) {
      activeToast.remove();
      clearTimeout(toastTimeout);
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    deviceScreen.appendChild(toast);
    
    // Force reflow for animation
    void toast.offsetWidth;
    toast.classList.add('show');
    
    activeToast = toast;
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
        if (activeToast === toast) activeToast = null;
      }, 300);
    }, 2500);
  }

  function activateRestaurantDemo() {
    if (!restaurantContainer) {
      initRestaurantDemo();
    }
    
    restaurantContainer = document.querySelector('#demo-restaurant-content');
    if (restaurantContainer) {
      restaurantContainer.style.display = 'block';
      // Animação de entrada
      restaurantContainer.style.opacity = '0';
      restaurantContainer.style.transform = 'translateY(20px)';
      restaurantContainer.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      void restaurantContainer.offsetWidth; // reflow
      
      restaurantContainer.style.opacity = '1';
      restaurantContainer.style.transform = 'translateY(0)';
      
      // Render default tab
      handleTabClick('entradas', tabs.find(t => t.dataset.category === 'entradas') || tabs[0]);
    }
  }

  function resetRestaurantDemo() {
    if (restaurantContainer) {
      restaurantContainer.style.display = 'none';
      restaurantContainer.style.opacity = '0';
      restaurantContainer.style.transform = 'translateY(20px)';
    }
    
    if (activeToast) {
      activeToast.remove();
      activeToast = null;
      clearTimeout(toastTimeout);
    }
    
    if (menuItemsContainer) {
      menuItemsContainer.innerHTML = '';
    }
  }

  function addDynamicStyles() {
    // Add dynamic styles for animations and badges if not present
    if (!document.getElementById('demo-restaurant-styles')) {
      const style = document.createElement('style');
      style.id = 'demo-restaurant-styles';
      style.textContent = `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }
        .badge-vegano { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .badge-vegetariano { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .badge-sem-gluten { background-color: rgba(245, 158, 11, 0.15); color: #fbbf24; }
        .toast {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%) translateY(50px);
          background: rgba(30, 30, 30, 0.9);
          backdrop-filter: blur(8px);
          color: white;
          padding: 10px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 1000;
          white-space: nowrap;
          pointer-events: none;
        }
        .toast.show {
          transform: translateX(-50%) translateY(0);
          opacity: 1;
        }
        .menu-item-card {
          will-change: transform;
          transform-style: preserve-3d;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Expor globalmente
  window.activateRestaurantDemo = activateRestaurantDemo;
  window.initRestaurantDemo = initRestaurantDemo;
  window.resetRestaurantDemo = resetRestaurantDemo;

})();
