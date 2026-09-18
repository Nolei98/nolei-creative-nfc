/**
 * ==============================================================================
 * NOLEI CORE SDK v1.1 — Cliente Unificado Multi-Tenant Phygital
 * Conecta qualquer frontend (Cardápio, Hotel, Fidelidade, Clínicas, Moda) ao
 * backend Supabase com zero redundância e suporte offline completo.
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

  // Configurações globais com fallback para window.NOLEI_CONFIG
  function getGlobalConfig() {
    const fromWindow = (typeof window !== 'undefined' && window.NOLEI_CONFIG) || {};
    return {
      supabaseUrl: fromWindow.supabaseUrl || (typeof window !== 'undefined' && window.NOLEI_SUPABASE_URL) || '',
      supabaseKey: fromWindow.supabaseKey || (typeof window !== 'undefined' && window.NOLEI_SUPABASE_KEY) || '',
      storageKeyPrefix: 'nolei_db_',
      defaultOrg: fromWindow.defaultOrg || 'botanico-bistro'
    };
  }

  // Fixtures padrão para demonstrações imediatas (Zero Configuração)
  const SEED_FIXTURES = {
    'botanico-bistro': {
      org: {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-000000000001',
        slug: 'botanico-bistro',
        name: '🌿 Botânico Bistrô',
        segment: 'gastronomia',
        whatsapp: '5587999099937',
        brand_color: '#f59e0b'
      },
      spots: {
        'm04': { code: 'm04', label: 'Mesa 04', type: 'mesa' },
        'm01': { code: 'm01', label: 'Mesa 01', type: 'mesa' },
        'm02': { code: 'm02', label: 'Mesa 02', type: 'mesa' }
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
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-000000000002',
        slug: 'hotel-imperial',
        name: 'Hotel Jardim Imperial ★★★★★',
        segment: 'hotelaria',
        whatsapp: '5587999099937',
        brand_color: '#d4a853'
      },
      spots: {
        'q412': { code: 'q412', label: 'Suíte 412 Imperial', type: 'quarto' },
        'q415': { code: 'q415', label: 'Suíte Master 415', type: 'quarto' }
      },
      catalog: [
        { id: 'h1', category: 'lanches', title: 'Club Sandwich Imperial', price: 45.00, desc: 'Frango grelhado, bacon crocante, alface, tomate e maionese.' },
        { id: 'h2', category: 'principais', title: 'Filé Mignon ao Madeira', price: 89.00, desc: 'Com arroz de brócolis e batatas rústicas douradas.' },
        { id: 'h3', category: 'bebidas', title: 'Taça Malbec Reserva', price: 35.00, desc: 'Vinho tinto encorpado argentino safra 2021.' }
      ]
    },
    'atelie-raizes': {
      org: {
        id: 'a1b2c3d4-e5f6-4a5b-8c9d-000000000003',
        slug: 'atelie-raizes',
        name: 'Ateliê Raízes do Cariri',
        segment: 'artesanato_moda',
        whatsapp: '5587999099937',
        brand_color: '#0055FF'
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
          desc: 'Feita à mão em Juazeiro do Norte com curtimento vegetal.',
          badges: ['Tiragem Limitada: 50 un', '100% Cariri', 'Garantia Vitalícia']
        }
      ]
    }
  };

  class NoleiCore {
    constructor(options = {}) {
      const cfg = getGlobalConfig();
      this.options = Object.assign({
        org: cfg.defaultOrg,
        spot: 'm04',
        autoDetectUrlParams: true
      }, options);

      // Detecta parâmetros de URL automaticamente
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
      this.realtimeWs = null;

      this._initStorageListeners();
      this._initRealtimeIfConfigured();
    }

    /**
     * Configura credenciais dinamicamente
     */
    static config(cfg = {}) {
      if (typeof window !== 'undefined') {
        window.NOLEI_CONFIG = Object.assign(window.NOLEI_CONFIG || {}, cfg);
      }
    }

    /**
     * Retorna se a nuvem Supabase está com credenciais preenchidas
     */
    isLive() {
      const cfg = getGlobalConfig();
      return !!(cfg.supabaseUrl && cfg.supabaseKey);
    }

    getSupabaseConfig() {
      return getGlobalConfig();
    }

    /**
     * Inicializa a sessão carregando dados da organização e do ponto
     */
    async init() {
      const fixture = SEED_FIXTURES[this.orgSlug] || SEED_FIXTURES['botanico-bistro'];

      if (this.isLive()) {
        try {
          const cfg = getGlobalConfig();
          const res = await fetch(`${cfg.supabaseUrl}/rest/v1/organizations?slug=eq.${this.orgSlug}&select=*`, {
            headers: {
              'apikey': cfg.supabaseKey,
              'Authorization': `Bearer ${cfg.supabaseKey}`
            }
          });
          if (res.ok) {
            const orgs = await res.json();
            if (orgs && orgs.length > 0) {
              this.orgData = orgs[0];
            }
          }
        } catch(e) {
          console.warn('[NoleiCore] Erro ao buscar organização na nuvem, usando cache:', e);
        }
      }

      if (!this.orgData) {
        this.orgData = fixture.org;
      }

      this.spotData = (fixture.spots && fixture.spots[this.spotCode]) || {
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
     * Retorna itens do catálogo (cardápio, serviços ou produtos)
     */
    async getCatalog(filter = {}) {
      const fixture = SEED_FIXTURES[this.orgSlug] || SEED_FIXTURES['botanico-bistro'];

      if (this.isLive()) {
        try {
          const cfg = getGlobalConfig();
          let url = `${cfg.supabaseUrl}/rest/v1/catalog_items?is_available=eq.true`;
          if (filter.category && filter.category !== 'todos') {
            url += `&category=eq.${filter.category}`;
          }
          const res = await fetch(url, {
            headers: {
              'apikey': cfg.supabaseKey,
              'Authorization': `Bearer ${cfg.supabaseKey}`
            }
          });
          if (res.ok) {
            const items = await res.json();
            if (items && items.length > 0) {
              return items;
            }
          }
        } catch(e) {
          console.warn('[NoleiCore] Usando catálogo local:', e);
        }
      }

      let items = fixture.catalog || [];
      if (filter.category && filter.category !== 'todos') {
        items = items.filter(item => item.category === filter.category);
      }
      return items;
    }

    /**
     * Dispara uma interação (pedido, chamado, avaliação, etc.)
     */
    async sendInteraction(type, payload = {}) {
      const spotLabel = (this.spotData && this.spotData.label) || ('Ponto ' + this.spotCode);
      const interaction = {
        id: 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        org_slug: this.orgSlug,
        spot_code: this.spotCode,
        spot_label: spotLabel,
        type: type,
        payload: payload,
        status: 'pendente',
        created_at: new Date().toISOString()
      };

      // 1. Grava no cache local
      this._saveLocalInteraction(interaction);

      // 2. Ponte de compatibilidade retroativa com nolei_service_alerts
      this._syncToLegacyAlerts(interaction);

      // 3. Envia para o Supabase se configurado
      if (this.isLive()) {
        try {
          const cfg = getGlobalConfig();
          await fetch(`${cfg.supabaseUrl}/rest/v1/interactions`, {
            method: 'POST',
            headers: {
              'apikey': cfg.supabaseKey,
              'Authorization': `Bearer ${cfg.supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              org_id: this.orgData ? this.orgData.id : null,
              spot_code: interaction.spot_code,
              spot_label: interaction.spot_label,
              type: interaction.type,
              payload: interaction.payload,
              status: interaction.status
            })
          });
        } catch (err) {
          console.warn('[NoleiCore] Falha ao enviar ao Supabase, salvo localmente:', err);
        }
      }

      // Notifica ouvintes locais
      this._notifyListeners(interaction);

      return interaction;
    }

    /**
     * Ouve eventos em tempo real
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
     * Atualiza o status de um chamado
     */
    async updateInteractionStatus(id, newStatus) {
      const list = this.getRecentInteractions();
      const item = list.find(i => i.id === id);
      if (item) {
        item.status = newStatus;
        item.resolved_at = new Date().toISOString();
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem(this._storageKey(), JSON.stringify(list));
        }
        this._notifyListeners(item);
      }

      // Atualiza também na nuvem se ativo
      if (this.isLive()) {
        try {
          const cfg = getGlobalConfig();
          await fetch(`${cfg.supabaseUrl}/rest/v1/interactions?id=eq.${id}`, {
            method: 'PATCH',
            headers: {
              'apikey': cfg.supabaseKey,
              'Authorization': `Bearer ${cfg.supabaseKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus, resolved_at: new Date().toISOString() })
          });
        } catch(e) {}
      }

      return item;
    }

    getRecentInteractions() {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return [];
      try {
        const raw = localStorage.getItem(this._storageKey());
        return raw ? JSON.parse(raw) : [];
      } catch(e) {
        return [];
      }
    }

    // --- MÉTODOS INTERNOS & RETROCOMPATIBILIDADE ---

    _syncToLegacyAlerts(interaction) {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
      if (interaction.type === 'chamado_garcom' || interaction.type === 'pedido_conta') {
        try {
          const existing = JSON.parse(localStorage.getItem('nolei_service_alerts') || '[]');
          const legacyType = interaction.type === 'chamado_garcom' ? 'garcom' : 'conta';
          const tableStr = interaction.spot_label.toLowerCase();
          
          // Evita duplicar alerta pendente da mesma mesa
          if (!existing.some(a => a.table === tableStr && a.type === legacyType)) {
            existing.unshift({
              id: interaction.id,
              table: tableStr,
              type: legacyType,
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            });
            localStorage.setItem('nolei_service_alerts', JSON.stringify(existing));
          }
        } catch(e) {}
      }
    }

    _storageKey() {
      const cfg = getGlobalConfig();
      return cfg.storageKeyPrefix + this.orgSlug;
    }

    _saveLocalInteraction(item) {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
      const list = this.getRecentInteractions();
      list.unshift(item);
      if (list.length > 50) list.pop();
      localStorage.setItem(this._storageKey(), JSON.stringify(list));
    }

    _notifyListeners(item) {
      this.listeners.forEach(cb => {
        try { cb(item); } catch(e) { console.error(e); }
      });
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

    _initRealtimeIfConfigured() {
      if (!this.isLive() || typeof WebSocket === 'undefined') return;
      const cfg = getGlobalConfig();
      try {
        // Extrai o host do supabase para websocket realtime
        const url = new URL(cfg.supabaseUrl);
        const wsUrl = `wss://${url.host}/realtime/v1/websocket?apikey=${cfg.supabaseKey}&vsn=1.0.0`;
        
        this.realtimeWs = new WebSocket(wsUrl);
        this.realtimeWs.onopen = () => {
          if (cfg.debug) console.log('[NoleiCore] Conectado ao Realtime Supabase!');
          // Join interactions channel
          this.realtimeWs.send(JSON.stringify({
            topic: 'realtime:public:interactions',
            event: 'phx_join',
            payload: {},
            ref: '1'
          }));
        };

        this.realtimeWs.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data);
            if (data.event === 'INSERT' && data.payload && data.payload.record) {
              this._notifyListeners(data.payload.record);
            }
          } catch(err) {}
        };
      } catch(err) {
        console.warn('[NoleiCore] Realtime websocket não pôde ser iniciado, operando via polling/storage:', err);
      }
    }

    static formatCurrency(val) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    }
  }

  // Instância singleton global pronta para uso nas páginas
  if (typeof window !== 'undefined') {
    window.noleiClient = new NoleiCore();
  }

  return NoleiCore;
}));
