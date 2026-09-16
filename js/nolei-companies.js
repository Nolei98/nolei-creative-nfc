/**
 * ==============================================================================
 * NOLEI COMPANIES & MODULE MANAGER v1.0
 * Catálogo inteligente de empresas, segmentos e módulos contratuais Phygital.
 * Permite que cada cliente tenha e acesse ESTRITAMENTE o que contratou.
 * ==============================================================================
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.NoleiCompanies = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const STORAGE_KEY = 'nolei_custom_companies';

  // Catálogo completo de segmentos disponíveis
  const SEGMENTS = {
    gastronomia: {
      id: 'gastronomia',
      name: 'Gastronomia & Restaurantes',
      icon: '🍽️',
      color: '#F59E0B',
      desc: 'Bistrôs, restaurantes, pizzarias, hamburguerias e bares com atendimento em mesa ou balcão.'
    },
    hotelaria: {
      id: 'hotelaria',
      name: 'Hotelaria & Pousadas Boutique',
      icon: '🏨',
      color: '#D4A853',
      desc: 'Hotéis, resorts, pousadas e flats com serviços de quarto, governança e concierge.'
    },
    saude: {
      id: 'saude',
      name: 'Saúde, Clínicas & Estética',
      icon: '⭐',
      color: '#A78BFA',
      desc: 'Consultórios, clínicas médicas, dermatologia, odontologia e centros de estética.'
    },
    fidelidade: {
      id: 'fidelidade',
      name: 'Cafeterias, Varejo & Fidelidade',
      icon: '☕',
      color: '#C15D30',
      desc: 'Cafeterias, docerias, tabacarias e lojas de varejo com programa de recompensas e carimbos.'
    },
    artesanato_moda: {
      id: 'artesanato_moda',
      name: 'Moda Autoral & Artesanato Phygital',
      icon: '🧵',
      color: '#E5855A',
      desc: 'Ateliês de couro, calçados artesanais, joias autorais e confecções regionais com storytelling.'
    },
    beleza: {
      id: 'beleza',
      name: 'Barbearias, Salões & Beleza',
      icon: '✂️',
      color: '#38BDF8',
      desc: 'Barbearias tradicionais, salões de cabeleireiro, estúdios de manicure e spa capilar.'
    },
    imobiliaria: {
      id: 'imobiliaria',
      name: 'Imobiliárias, Construtoras & Plantões',
      icon: '🏙️',
      color: '#34D399',
      desc: 'Plantões de venda de loteamentos, empreendimentos residenciais e imobiliárias de alto padrão.'
    }
  };

  // Catálogo de todos os módulos com regras de roteamento e ações
  const MODULES_REGISTRY = {
    // Gastronomia
    cardapio_digital: {
      id: 'cardapio_digital',
      name: 'Cardápio Digital Interativo (Mesa)',
      icon: '📱',
      segments: ['gastronomia'],
      desc: 'Cardápio com fotos, filtros por categoria (entradas, principais, bebidas) e adição ao carrinho com aproximação NFC.',
      clientAction: {
        label: 'Abrir Cardápio na Mesa',
        getUrl: (c) => `demo/cardapio.html?source=nfc&org=${c.slug}&mesa=04`
      },
      isDefault: true
    },
    kds_cozinha: {
      id: 'kds_cozinha',
      name: 'Painel de Pedidos da Cozinha',
      icon: '👨‍🍳',
      segments: ['gastronomia'],
      desc: 'Monitor de comandas e chamados em tempo real para garçons e equipe da cozinha.',
      operatorAction: {
        label: 'Abrir Painel da Cozinha',
        getUrl: (c) => `demo/painel-restaurante.html?org=${c.slug}`
      },
      isDefault: true
    },
    chamado_garcom: {
      id: 'chamado_garcom',
      name: 'Chamado de Garçom & Pedido de Conta',
      icon: '🛎️',
      segments: ['gastronomia'],
      desc: 'Botões de 1 toque no celular do cliente para acionar garçom ou fechar a comanda sem levantar a mão.',
      clientAction: {
        label: 'Testar Chamado de Garçom',
        getUrl: (c) => `demo/cardapio.html?source=nfc&org=${c.slug}&mesa=04#garcom`
      },
      isDefault: true
    },
    dashboard_roi: {
      id: 'dashboard_roi',
      name: 'Relatório Executivo de ROI & Métricas',
      icon: '📈',
      segments: ['gastronomia'],
      desc: 'Painel gerencial de economia de tempo da brigada, giro de mesas e faturamento por comanda.',
      operatorAction: {
        label: 'Abrir Relatório de ROI',
        getUrl: (c) => `demo/dashboard-restaurante.html?org=${c.slug}`
      },
      isDefault: true
    },

    // Hotelaria
    concierge_suite: {
      id: 'concierge_suite',
      name: 'Concierge da Suíte (Cabeceira NFC)',
      icon: '🛌',
      segments: ['hotelaria'],
      desc: 'Portal do hóspede na cabeceira da cama com serviços, horário de café, toalhas e canais.',
      clientAction: {
        label: 'Abrir Concierge Suíte 412',
        getUrl: (c) => `demo/hotel.html?source=nfc&org=${c.slug}&quarto=412`
      },
      isDefault: true
    },
    painel_recepcao: {
      id: 'painel_recepcao',
      name: 'Painel de Recepção & Governança',
      icon: '🛎️',
      segments: ['hotelaria'],
      desc: 'Central da governança para despachar pedidos de hóspedes, toalhas, arrumação e manutenção.',
      operatorAction: {
        label: 'Abrir Painel da Recepção',
        getUrl: (c) => `demo/painel-hotel.html?org=${c.slug}`
      },
      isDefault: true
    },
    room_service: {
      id: 'room_service',
      name: 'Room Service & Pedidos no Quarto',
      icon: '🍽️',
      segments: ['hotelaria'],
      desc: 'Cardápio gourmet 24h para pedidos direto no quarto sem precisar ligar no ramal.',
      clientAction: {
        label: 'Fazer Pedido Room Service',
        getUrl: (c) => `demo/hotel.html?source=nfc&org=${c.slug}&quarto=412#roomservice`
      },
      isDefault: true
    },
    cafe_quarto: {
      id: 'cafe_quarto',
      name: 'Agendamento de Café no Quarto',
      icon: '☕',
      segments: ['hotelaria'],
      desc: 'Hóspede agenda com antecedência o horário de entrega da cesta de café da manhã.',
      clientAction: {
        label: 'Agendar Café no Quarto',
        getUrl: (c) => `demo/hotel.html?source=nfc&org=${c.slug}&quarto=412#cafe`
      },
      isDefault: true
    },
    spa_transfer: {
      id: 'spa_transfer',
      name: 'Reserva de SPA & Transfer Executivo',
      icon: '🧖‍♀️',
      segments: ['hotelaria'],
      desc: 'Reserva de massagens e solicitação de transfer ou táxi para aeroporto direto na tela.',
      clientAction: {
        label: 'Reservar SPA / Transfer',
        getUrl: (c) => `demo/hotel.html?source=nfc&org=${c.slug}&quarto=412#spa`
      },
      isDefault: true
    },

    // Saúde & Estética
    ouvidoria_privada: {
      id: 'ouvidoria_privada',
      name: 'Ouvidoria Privada & Filtro Ético',
      icon: '📋',
      segments: ['saude'],
      desc: 'Captura pacientes insatisfeitos (1-3 estrelas) em canal privado antes que publiquem reclamações públicas.',
      operatorAction: {
        label: 'Abrir Painel de Feedbacks Privados',
        getUrl: (c) => `demo/dashboard-avaliacoes.html?org=${c.slug}`
      },
      isDefault: true
    },
    apresentacao_equipe: {
      id: 'apresentacao_equipe',
      name: 'Apresentação de Especialistas & Tratamentos',
      icon: '👩‍⚕️',
      segments: ['saude'],
      desc: 'Biografia do médico, CRM, protocolos dermatológicos e especialidades na tela de espera.',
      clientAction: {
        label: 'Ver Perfil dos Especialistas',
        getUrl: (c) => `demo/avaliacao.html?source=nfc&org=${c.slug}#medico`
      },
      isDefault: true
    },

    // Fidelidade & Varejo
    cartao_fidelidade: {
      id: 'cartao_fidelidade',
      name: 'Cartela Fidelidade Digital (10 Carimbos)',
      icon: '🎁',
      segments: ['fidelidade', 'beleza'],
      desc: 'Cartela de selos gamificada que abre direto no celular sem precisar instalar aplicativo da Play Store ou App Store.',
      clientAction: {
        label: 'Abrir Cartão Fidelidade do Cliente',
        getUrl: (c) => `demo/fidelidade.html?source=nfc&org=${c.slug}`
      },
      isDefault: true
    },
    balcao_operador: {
      id: 'balcao_operador',
      name: 'Balcão de Pontuação & Validação de Vouchers',
      icon: '🏷️',
      segments: ['fidelidade', 'beleza'],
      desc: 'Terminal do atendente para carimbar o cartão do cliente e validar cupons anti-fraude gerados.',
      operatorAction: {
        label: 'Abrir Balcão do Atendente',
        getUrl: (c) => `demo/painel-fidelidade.html?org=${c.slug}`
      },
      isDefault: true
    },
    catalogo_premios: {
      id: 'catalogo_premios',
      name: 'Catálogo de Recompensas por Pontos',
      icon: '🍰',
      segments: ['fidelidade'],
      desc: 'Lista de brindes e produtos resgatáveis à medida que o cliente acumula pontos nas compras.',
      clientAction: {
        label: 'Ver Catálogo de Prêmios',
        getUrl: (c) => `demo/fidelidade.html?source=nfc&org=${c.slug}#premios`
      },
      isDefault: true
    },

    // Moda & Artesanato
    etiqueta_storytelling: {
      id: 'etiqueta_storytelling',
      name: 'Etiqueta Phygital & Storytelling do Artesão',
      icon: '🏷️',
      segments: ['artesanato_moda'],
      desc: 'Aproximação na tag costurada ou gravada na peça revelando a história do mestre artesão e fotos do processo.',
      clientAction: {
        label: 'Ver Storytelling da Peça #07',
        getUrl: (c) => `demo/storytelling-artesanato.html?source=nfc&org=${c.slug}`
      },
      isDefault: true
    },
    certificado_autenticidade: {
      id: 'certificado_autenticidade',
      name: 'Certificado de Autenticidade Numerado',
      icon: '🛡️',
      segments: ['artesanato_moda'],
      desc: 'Selo anti-cópia comprovando que a peça é original e de tiragem limitada feita à mão.',
      clientAction: {
        label: 'Ver Certificado de Autenticidade',
        getUrl: (c) => `demo/storytelling-artesanato.html?source=nfc&org=${c.slug}#certificado`
      },
      isDefault: true
    },
    catalogo_colecao: {
      id: 'catalogo_colecao',
      name: 'Catálogo de Peças Exclusivas & Preços',
      icon: '👜',
      segments: ['artesanato_moda'],
      desc: 'Vitrine digital dos modelos disponíveis para encomendas sob medida.',
      clientAction: {
        label: 'Ver Coleção Autoral',
        getUrl: (c) => `demo/storytelling-artesanato.html?source=nfc&org=${c.slug}#colecao`
      },
      isDefault: true
    },

    // Imobiliária
    placa_phygital: {
      id: 'placa_phygital',
      name: 'Placa Phygital do Imóvel & Tour Virtual',
      icon: '🏡',
      segments: ['imobiliaria'],
      desc: 'Placa colada no portão ou totem de loteamento onde o comprador vê fotos, plantas e valores.',
      clientAction: {
        label: 'Acessar Ficha do Imóvel',
        getUrl: (c) => `demo/storytelling-artesanato.html?source=nfc&org=${c.slug}&tipo=imovel`
      },
      isDefault: true
    },
    corretor_plantao: {
      id: 'corretor_plantao',
      name: 'Contato Direto com Corretor de Plantão',
      icon: '📞',
      segments: ['imobiliaria'],
      desc: 'Botão de atendimento prioritário via WhatsApp com envio automático do código do lote/imóvel.',
      clientAction: {
        label: 'Falar com Corretor no WhatsApp',
        getUrl: (c) => `https://wa.me/${c.whatsapp || '5587999099937'}?text=Ol%C3%A1%2C%20estou%20em%20frente%20ao%20im%C3%B3vel%20da%20${encodeURIComponent(c.name)}%20e%20gostaria%20de%20informa%C3%A7%C3%B5es`
      },
      isDefault: true
    },

    // Módulos Globais (Disponíveis em todas as áreas)
    google_reviews: {
      id: 'google_reviews',
      name: 'Avaliações Google 5★ (Filtro Inteligente)',
      icon: '⭐',
      segments: ['gastronomia', 'hotelaria', 'saude', 'fidelidade', 'artesanato_moda', 'beleza', 'imobiliaria'],
      desc: 'Direciona clientes muito satisfeitos (4-5 estrelas) direto para o Google Maps da empresa.',
      clientAction: {
        label: 'Avaliar no Google 5★',
        getUrl: (c) => `demo/avaliacao.html?source=nfc&org=${c.slug}`
      },
      isDefault: true
    },
    wifi_connect: {
      id: 'wifi_connect',
      name: 'Conexão Wi-Fi Expressa por Aproximação',
      icon: '📶',
      segments: ['gastronomia', 'hotelaria', 'saude', 'fidelidade', 'beleza'],
      desc: 'Exibe as credenciais de Wi-Fi e botão de cópia rápida para o cliente conectar sem digitar.',
      clientAction: {
        label: 'Ver Conexão Wi-Fi',
        getUrl: (c) => `empresa.html?slug=${c.slug}#wifi`
      },
      isDefault: true
    },
    agendamento_whatsapp: {
      id: 'agendamento_whatsapp',
      name: 'Agendamento Rápido via WhatsApp',
      icon: '📅',
      segments: ['saude', 'beleza', 'imobiliaria'],
      desc: 'Link inteligente com mensagem pré-configurada para marcação de consultas, cortes ou visitas.',
      clientAction: {
        label: 'Agendar via WhatsApp',
        getUrl: (c) => `https://wa.me/${c.whatsapp || '5587999099937'}?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20um%20hor%C3%A1rio%20na%20${encodeURIComponent(c.name)}`
      },
      isDefault: true
    },
    encomendas_whatsapp: {
      id: 'encomendas_whatsapp',
      name: 'Canal Direto para Encomendas Sob Medida',
      icon: '💬',
      segments: ['artesanato_moda'],
      desc: 'Conversa direta com o ateliê para orçamentos e personalizações de peças em couro e joias.',
      clientAction: {
        label: 'Pedir Encomenda no WhatsApp',
        getUrl: (c) => `https://wa.me/${c.whatsapp || '5587999099937'}?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20encomenda%20com%20o%20${encodeURIComponent(c.name)}`
      },
      isDefault: true
    }
  };

  // Base padrão das empresas já configuradas para cada área
  const DEFAULT_ORGANIZATIONS = [
    {
      id: 'org_botanico_bistro',
      slug: 'botanico-bistro',
      name: '🌿 Botânico Bistrô',
      segment: 'gastronomia',
      city: 'Juazeiro do Norte - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'Botanico_5G',
      wifiPass: 'botanicogourmet',
      brandColor: '#F59E0B',
      summary: 'Restaurante com foco em culinária contemporânea orgânica e ambiente biofílico.',
      spots: [
        { code: 'm01', label: 'Mesa 01', type: 'mesa', url: 'demo/cardapio.html?source=nfc&mesa=01' },
        { code: 'm02', label: 'Mesa 02', type: 'mesa', url: 'demo/cardapio.html?source=nfc&mesa=02' },
        { code: 'm03', label: 'Mesa 03', type: 'mesa', url: 'demo/cardapio.html?source=nfc&mesa=03' },
        { code: 'm04', label: 'Mesa 04 (Salão Principal)', type: 'mesa', url: 'demo/cardapio.html?source=nfc&mesa=04' }
      ],
      modules: [
        'cardapio_digital',
        'kds_cozinha',
        'chamado_garcom',
        'dashboard_roi',
        'google_reviews',
        'wifi_connect'
      ]
    },
    {
      id: 'org_hotel_imperial',
      slug: 'hotel-imperial',
      name: '🏨 Hotel Jardim Imperial ★★★★★',
      segment: 'hotelaria',
      city: 'Juazeiro do Norte - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'JardimImperial_VIP',
      wifiPass: 'suite412',
      brandColor: '#D4A853',
      summary: 'Hotel boutique com serviço de concierge e room service digital por aproximação nos quartos.',
      spots: [
        { code: 'q101', label: 'Apartamento 101', type: 'quarto', url: 'demo/hotel.html?source=nfc&quarto=101' },
        { code: 'q204', label: 'Suíte Executiva 204', type: 'quarto', url: 'demo/hotel.html?source=nfc&quarto=204' },
        { code: 'q412', label: 'Suíte 412 Imperial', type: 'quarto', url: 'demo/hotel.html?source=nfc&quarto=412' }
      ],
      modules: [
        'concierge_suite',
        'painel_recepcao',
        'room_service',
        'cafe_quarto',
        'spa_transfer',
        'google_reviews',
        'wifi_connect'
      ]
    },
    {
      id: 'org_clinica_dra_sofia',
      slug: 'clinica-dra-sofia',
      name: '⭐ Clínica Dra. Sofia Santos',
      segment: 'saude',
      city: 'Juazeiro do Norte - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'ClinicaSofia_Pacientes',
      wifiPass: 'saude2026',
      brandColor: '#A78BFA',
      summary: 'Clínica de Dermatologia e Estética Facial com totem de avaliação e reputação no Google Maps.',
      spots: [
        { code: 'totem_rec', label: 'Totem Balcão Recepção', type: 'totem', url: 'demo/avaliacao.html?source=nfc' },
        { code: 'consult_01', label: 'Consultório Principal 01', type: 'consultorio', url: 'demo/avaliacao.html?source=nfc' }
      ],
      modules: [
        'google_reviews',
        'ouvidoria_privada',
        'apresentacao_equipe',
        'agendamento_whatsapp',
        'wifi_connect'
      ]
    },
    {
      id: 'org_cafe_origem',
      slug: 'cafe-origem',
      name: '☕ Café Origem',
      segment: 'fidelidade',
      city: 'Crato - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'CafeOrigem_Wifi',
      wifiPass: 'graosartesanais',
      brandColor: '#C15D30',
      summary: 'Cafeteria de grãos especiais com programa de 10 carimbos digitais e resgate de recompensas.',
      spots: [
        { code: 'fidelidade_balcao', label: 'Display Balcão de Caixa', type: 'balcao', url: 'demo/fidelidade.html?source=nfc' }
      ],
      modules: [
        'cartao_fidelidade',
        'balcao_operador',
        'catalogo_premios',
        'google_reviews',
        'wifi_connect'
      ]
    },
    {
      id: 'org_atelie_raizes',
      slug: 'atelie-raizes',
      name: '🧵 Ateliê Raízes do Cariri',
      segment: 'artesanato_moda',
      city: 'Juazeiro do Norte - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'Atelie_Visitantes',
      wifiPass: 'couroregional',
      brandColor: '#E5855A',
      summary: 'Ateliê de artefatos em couro legítimo com etiquetas NFC costuradas contando a história do artesão.',
      spots: [
        { code: 'etq01', label: 'Bolsa Mandacaru #07', type: 'etiqueta', url: 'demo/storytelling-artesanato.html?source=nfc' }
      ],
      modules: [
        'etiqueta_storytelling',
        'catalogo_colecao',
        'encomendas_whatsapp',
        'certificado_autenticidade',
        'google_reviews'
      ]
    },
    {
      id: 'org_barbearia_dom',
      slug: 'barbearia-dom-corleone',
      name: '✂️ Barbearia Dom Corleone',
      segment: 'beleza',
      city: 'Barbalha - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'BarbeariaDom_VIP',
      wifiPass: 'corteclube',
      brandColor: '#38BDF8',
      summary: 'Barbearia vintage com fidelidade de cortes no espelho e agendamento rápido de navalha e barba.',
      spots: [
        { code: 'cadeira01', label: 'Espelho Cadeira 01', type: 'espelho', url: 'demo/fidelidade.html?source=nfc' },
        { code: 'cadeira02', label: 'Espelho Cadeira 02', type: 'espelho', url: 'demo/fidelidade.html?source=nfc' }
      ],
      modules: [
        'cartao_fidelidade',
        'balcao_operador',
        'google_reviews',
        'agendamento_whatsapp',
        'wifi_connect'
      ]
    },
    {
      id: 'org_horizon_imoveis',
      slug: 'horizon-imoveis',
      name: '🏙️ Horizon Imóveis & Arquitetura',
      segment: 'imobiliaria',
      city: 'Juazeiro do Norte - CE',
      whatsapp: '87999099937',
      googlePlaceUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
      wifiSsid: 'Horizon_Plantao',
      wifiPass: 'imoveis2026',
      brandColor: '#34D399',
      summary: 'Imobiliária inovadora com placas inteligentes em loteamentos para tour virtual e contato imediato de corretor.',
      spots: [
        { code: 'placa_lote01', label: 'Totem Loteamento Jardins #01', type: 'placa', url: 'demo/storytelling-artesanato.html?source=nfc' }
      ],
      modules: [
        'placa_phygital',
        'corretor_plantao',
        'google_reviews',
        'agendamento_whatsapp'
      ]
    }
  ];

  class NoleiCompaniesManager {
    constructor() {
      this.cachedList = null;
    }

    // Retorna todos os segmentos
    getSegments() {
      return SEGMENTS;
    }

    getSegment(segmentId) {
      return SEGMENTS[segmentId] || SEGMENTS.gastronomia;
    }

    // Retorna a lista de módulos disponíveis para um segmento
    getModulesForSegment(segmentId) {
      const list = [];
      for (const modId in MODULES_REGISTRY) {
        const mod = MODULES_REGISTRY[modId];
        if (mod.segments && mod.segments.includes(segmentId)) {
          list.push(mod);
        }
      }
      return list;
    }

    getModule(moduleId) {
      return MODULES_REGISTRY[moduleId] || null;
    }

    // Retorna apenas as empresas DEMO oficiais do mostruário
    getDemoCompanies() {
      return DEFAULT_ORGANIZATIONS.map(org => Object.assign({}, org));
    }

    // Retorna apenas os clientes reais cadastrados (privados)
    getCustomCompanies() {
      if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return [];
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    // Retorna a lista combinada de empresas (padrão + criadas pelo usuário)
    getAll() {
      const custom = this.getCustomCompanies();
      const map = new Map();
      DEFAULT_ORGANIZATIONS.forEach(org => map.set(org.slug, Object.assign({}, org)));
      custom.forEach(org => map.set(org.slug, Object.assign({}, org)));
      return Array.from(map.values());
    }

    // Métodos de autenticação para Área Privada de Novos Clientes
    isAdminAuthenticated() {
      if (typeof sessionStorage === 'undefined') return false;
      return sessionStorage.getItem('nolei_private_auth') === 'true';
    }

    loginAdmin(username, password) {
      const u = (username || '').trim().toLowerCase();
      const p = (password || '').trim();
      if ((u === 'admin' || u === 'nolei') && (p === 'nolei2026' || p === 'admin123' || p === '87999099937')) {
        if (typeof sessionStorage !== 'undefined') {
          sessionStorage.setItem('nolei_private_auth', 'true');
        }
        return true;
      }
      return false;
    }

    logoutAdmin() {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem('nolei_private_auth');
      }
      return true;
    }

    // Busca uma empresa pelo slug
    getBySlug(slug) {
      if (!slug) return null;
      const all = this.getAll();
      return all.find(org => org.slug === slug.toLowerCase()) || null;
    }

    // Gera um slug seguro a partir de um nome
    slugify(text) {
      return text
        .toString()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }

    // Salva ou atualiza uma empresa
    save(data) {
      if (!data || !data.name) throw new Error('Nome da empresa é obrigatório');
      
      const slug = data.slug ? this.slugify(data.slug) : this.slugify(data.name);
      const segment = data.segment || 'gastronomia';
      const segInfo = this.getSegment(segment);
      const customDomain = data.customDomain ? data.customDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '') : '';

      const companyRecord = {
        id: data.id || ('org_' + slug + '_' + Date.now().toString(36)),
        slug: slug,
        name: data.name,
        segment: segment,
        city: data.city || 'Juazeiro do Norte - CE',
        whatsapp: data.whatsapp ? data.whatsapp.replace(/\D/g, '') : '87999099937',
        customDomain: customDomain,
        googlePlaceUrl: data.googlePlaceUrl || 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
        wifiSsid: data.wifiSsid || (slug + '_Wifi'),
        wifiPass: data.wifiPass || 'nolei2026',
        brandColor: data.brandColor || segInfo.color || '#C15D30',
        summary: data.summary || ('Estabelecimento parceiro Nolei no segmento de ' + segInfo.name),
        spots: data.spots || [
          { code: 'spot01', label: 'Ponto Principal / Balcão', type: 'ponto', url: `empresa.html?slug=${slug}` }
        ],
        modules: Array.isArray(data.modules) ? data.modules : []
      };

      // Salva no localStorage (lista de clientes customizados / privados)
      let custom = this.getCustomCompanies();
      const idx = custom.findIndex(c => c.slug === slug);
      if (idx >= 0) {
        custom[idx] = companyRecord;
      } else {
        custom.push(companyRecord);
      }

      if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nolei:company_updated', { detail: companyRecord }));
        }
      }

      return companyRecord;
    }

    // Remove uma empresa personalizada
    delete(slug) {
      if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return false;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        let custom = JSON.parse(raw);
        const filtered = custom.filter(c => c.slug !== slug);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('nolei:company_deleted', { detail: { slug } }));
        }
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  const instance = new NoleiCompaniesManager();
  if (typeof window !== 'undefined') {
    window.NoleiCompanies = instance;
  }

  return instance;
}));
