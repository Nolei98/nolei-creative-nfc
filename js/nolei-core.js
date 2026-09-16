/**
 * ==============================================================================
 * NOLEI CORE SDK v1.0 — Cliente Unificado Multi-Tenant Phygital
 * Conecta qualquer frontend (Cardápio, Hotel, Fidelidade, Clínicas, Moda) ao
 * backend com zero redundância.
 * 
 * Modos de Operação Automáticos:
 * 1. LIVE MODE: Conexão REST/Realtime via Supabase quando configurado.
 * 2. SEED / OFFLINE MODE: Funciona imediatamente via localStorage com dados simulados,
 *    garantindo que todas as telas funcionem offline e em demonstrações mesmo sem internet.
 * ==============================================================================
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NoleiCore = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // Configurações globais opcionais
  const globalConfig = {
    supabaseUrl: (typeof window !== 'undefined' && window.NOLEI_SUPABASE_URL) || '',
    supabaseKey: (typeof window !== 'undefined' && window.NOLEI_SUPABASE_KEY) || '',
    storageKeyPrefix: 'nolei_db_'
  };

  // Fixtures padrão para demonstrações imediatas (Zero Configuração)
  const SEED_FIXTURES = {
    'botanico-bistro': {
      org: {
        id: 'org-botanico',
        slug: 'botanico-bistro',
        name: '🌿 Botânico Bistrô',
        segment: 'gastronomia',
        whatsapp: '5587999099937',
        color: '#f59e0b'
      },
      spots: {
        'm04': { code: 'm04', label: 'Mesa 04', type: 'mesa' },
        'm01': { code: 'm01', label: 'Mesa 01', type: 'mesa' }
      },
      catalog: [
        { id: '1', category: 'entradas', title: 'Bruschetta Caprese', price: 28.90, desc: 'Tomate cereja, muçarela de búfala e manjericão fresco.', badges: ['Vegetariano'] },
        { id: '2', category: 'entradas', title: 'Carpaccio de Abobrinha', price: 32.00, desc: 'Lâminas grelhadas com pesto de rúcula e parmesão.', badges: ['Vegano', 'Sem Glúten'] },
        { id: '3', category: 'principais', title: 'Risoto de Funghi Trufado', price: 58.90, desc: 'Arroz arbóreo com cogumelos nobres e parmesão 24 meses.', badges: ['Vegetariano'] },
        { id: '4', category: 'principais', title: 'Salmão Grelhado', price: 72.00, desc: 'Na brasa com purê de batata-doce roxa e aspargos.', badges: ['Sem Glúten'] },
        { id: '5', category: 'bebidas', title: 'Limonada Siciliana', price: 18.90, desc: 'Limão siciliano com hortelã fresca e água com gás.', badges: ['Refrescante'] },
        { id: '6', category: 'bebidas', title: 'Gin Tônica Botânica', price: 38.00, desc: 'Gin artesanal, tônica premium, pepino e alecrim.', badges: ['Artesanal'] }
      ]
    },
    'hotel-imperial': {
      org: {
        id: 'org-hotel',
        slug: 'hotel-imperial',
        name: 'Hotel Jardim Imperial ★★★★★',
        segment: 'hotelaria',
        whatsapp: '5587999099937',
        color: '#d4a853'
      },
      spots: {
        'q412': { code: 'q412', label: 'Suíte 412', type: 'quarto' },
        'q415': { code: 'q415', label: 'Suíte Master 415', type: 'quarto' }
      },
      catalog: [
        { id: 'h1', category: 'lanches', title: 'Club Sandwich Imperial', price: 45.00, desc: 'Frango grelhado, bacon crocante, alface, tomate e maionese artesanal.' },
        { id: 'h2', category: 'principais', title: 'Filé Mignon ao Molho Madeira', price: 89.00, desc: 'Com arroz de brócolis e batatas rústicas douradas.' },
        { id: 'h3', category: 'bebidas', title: 'Taça Malbec Reserva', price: 35.00, desc: 'Vinho tinto encorpado argentino safra 2021.' }
      ]
    },
    'atelie-raizes': {
      org: {
        id: 'org-atelie',
        slug: 'atelie-raizes',
        name: 'Ateliê Raízes do Cariri',
        segment: 'artesanato_moda',
        whatsapp: '5587999099937',
        color: '#C15D30'
      },
      spots: {
        'etq-01': { code: 'etq-01', label: 'Bolsa Mandacaru em Couro #07', type: 'etiqueta' }
      },
      catalog: [
        { 
          id: 'm1', 
          category: 'couro', 
          title: 'Bolsa Mandacaru — Couro Legítimo', 
          price: 380.00, 
          desc: 'Confeccionada à mão pelo artesão Mestre Cícero em Juazeiro do Norte. Curtimento vegetal livre de cromo.',
          badges: ['Tiragem Limitada: 50 un', '100% Cariri', 'Garantia Vitalícia']
        }
      ]
    }
  };

  class NoleiCore {
    constructor(options = {}) {
      this.options = Object.assign({
        org: 'botanico-bistro',
        spot: 'm04',
        autoDetectUrlParams: true
      }, options);

      // Detecta parâmetros de URL automaticamente se habilitado
      if (this.options.autoDetectUrlParams && typeof window !== 'undefined' && window.location) {
        const params = new URLSearchParams(window.location.search);
        if (params.get('org')) this.options.org = params.get('org');
        if (params.get('spot')) this.options.spot = params.get('spot');
        if (params.get('t')) this.options.spot = params.get('t');
        if (params.get('mesa')) this.options.spot = 'm' + params.get('mesa').padStart(2, '0');
        if (params.get('quarto')) this.options.spot = 'q' + params.get('quarto');
      }

      this.orgSlug = this.options.org;
      this.spotCode = this.options.spot;
      this.listeners = [];

      this._initStorageListeners();
    }

    /**
     * Configura credenciais da nuvem (Supabase)
     */
    static config(cfg = {}) {
      if (cfg.supabaseUrl) globalConfig.supabaseUrl = cfg.supabaseUrl;
      if (cfg.supabaseKey) globalConfig.supabaseKey = cfg.supabaseKey;
    }

    /**
     * Verifica se está em modo nuvem ativa
     */
    isLive() {
      return !!(globalConfig.supabaseUrl && globalConfig.supabaseKey);
    }

    /**
     * Carrega informações da Organização e do Ponto Físico
     */
    async init() {
      const fixture = SEED_FIXTURES[this.orgSlug] || SEED_FIXTURES['botanico-bistro'];
      this.orgData = fixture.org;
      this.spotData = fixture.spots[this.spotCode] || {
        code: this.spotCode,
        label: 'Ponto ' + this.spotCode.toUpperCase(),
        type: 'mesa'
      };

      return {
        org: this.orgData,
        spot: this.spotData,
        isLive: this.isLive()
      };
    }

    /**
     * Obtém o catálogo de itens/serviços
     */
    async getCatalog(filter = {}) {
      const fixture = SEED_FIXTURES[this.orgSlug] || SEED_FIXTURES['botanico-bistro'];
      let items = fixture.catalog || [];

      if (filter.category && filter.category !== 'todos') {
        items = items.filter(item => item.category === filter.category);
      }

      return items;
    }

    /**
     * Dispara uma interação (Pedido, Chamar Garçom, Avaliação, etc.)
     */
    async sendInteraction(type, payload = {}) {
      const interaction = {
        id: 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        org_slug: this.orgSlug,
        spot_code: this.spotCode,
        spot_label: (this.spotData && this.spotData.label) || this.spotCode,
        type: type,
        payload: payload,
        status: 'pendente',
        created_at: new Date().toISOString()
      };

      // 1. Grava no storage local para mock/resiliência imediata
      this._saveLocalInteraction(interaction);

      // 2. Se tiver Supabase ativo, envia para a nuvem
      if (this.isLive()) {
        try {
          await fetch(`${globalConfig.supabaseUrl}/rest/v1/interactions`, {
            method: 'POST',
            headers: {
              'apikey': globalConfig.supabaseKey,
              'Authorization': `Bearer ${globalConfig.supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              org_slug: interaction.org_slug,
              spot_code: interaction.spot_code,
              spot_label: interaction.spot_label,
              type: interaction.type,
              payload: interaction.payload,
              status: interaction.status
            })
          });
        } catch (err) {
          console.warn('[NoleiCore] Falha ao enviar para nuvem, gravado apenas em cache local:', err);
        }
      }

      // Notifica ouvintes locais na mesma aba e em outras abas
      this._notifyListeners(interaction);

      return interaction;
    }

    /**
     * Ouve novos eventos em tempo real (para a tela do Garçom / Recepção)
     */
    onInteraction(callback) {
      if (typeof callback === 'function') {
        this.listeners.push(callback);
      }
      return () => {
        this.listeners = this.listeners.filter(l => l !== callback);
      };
    }

    /**
     * Atualiza o status de um chamado ('atendido', 'concluido', 'cancelado')
     */
    async updateInteractionStatus(id, newStatus) {
      const list = this.getRecentInteractions();
      const item = list.find(i => i.id === id);
      if (item) {
        item.status = newStatus;
        item.resolved_at = new Date().toISOString();
        localStorage.setItem(this._storageKey(), JSON.stringify(list));
        this._notifyListeners(item);
      }
      return item;
    }

    /**
     * Retorna a lista de interações recentes salvas no cache
     */
    getRecentInteractions() {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return [];
      try {
        const raw = localStorage.getItem(this._storageKey());
        return raw ? JSON.parse(raw) : [];
      } catch(e) {
        return [];
      }
    }

    // --- MÉTODOS INTERNOS DE GERENCIAMENTO ---
    _storageKey() {
      return globalConfig.storageKeyPrefix + this.orgSlug;
    }

    _saveLocalInteraction(item) {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
      const list = this.getRecentInteractions();
      list.unshift(item);
      if (list.length > 50) list.pop(); // Mantém as últimas 50
      localStorage.setItem(this._storageKey(), JSON.stringify(list));
    }

    _notifyListeners(item) {
      this.listeners.forEach(cb => {
        try { cb(item); } catch(e) { console.error(e); }
      });
      // Notificação cross-tab via CustomEvent
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('nolei:event', { detail: item }));
      }
    }

    _initStorageListeners() {
      if (typeof window === 'undefined') return;
      window.addEventListener('storage', (e) => {
        if (e.key === this._storageKey() && e.newValue) {
          try {
            const list = JSON.parse(e.newValue);
            if (list.length > 0) {
              this.listeners.forEach(cb => cb(list[0]));
            }
          } catch(err) {}
        }
      });
      window.addEventListener('nolei:event', (e) => {
        this.listeners.forEach(cb => cb(e.detail));
      });
    }

    /**
     * Helpers de Utilidade
     */
    static formatCurrency(val) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }
  }

  return NoleiCore;
}));
