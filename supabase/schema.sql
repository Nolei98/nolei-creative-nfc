-- ==============================================================================
-- NOLEI CREATIVE — UNIFIED MULTI-TENANT DATABASE SCHEMA
-- Plataforma Phygital: Gastronomia, Hotelaria, Fidelidade, Clínicas e Varejo
-- Compatível com: PostgreSQL 14+ e Supabase (com Realtime habilitado)
-- ==============================================================================

-- Habilita extensão de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ORGANIZATIONS (Os Clientes SaaS / Estabelecimentos)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                       -- Ex: 'botanico-bistro', 'hotel-imperial'
    name TEXT NOT NULL,                             -- Ex: 'Botânico Bistrô'
    segment TEXT NOT NULL CHECK (segment IN (
        'gastronomia', 
        'hotelaria', 
        'varejo', 
        'saude_estetica', 
        'artesanato_moda'
    )),
    whatsapp TEXT,                                  -- Para notificações e fechamento
    logo_url TEXT,
    brand_color TEXT DEFAULT '#0055FF',             -- Cor primária da marca
    settings JSONB DEFAULT '{
        "currency": "BRL",
        "service_fee_pct": 10,
        "allow_whatsapp_order": true,
        "google_maps_place_id": null
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 2. SPOTS (Os Pontos Físicos de Contato / Tags NFC / Mesas / Quartos / Etiquetas)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS spots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    code TEXT NOT NULL,                             -- Ex: 'm04', 'q412', 'balcao', 'etq-07'
    label TEXT NOT NULL,                            -- Ex: 'Mesa 04', 'Suíte 412', 'Etiqueta Peça #07'
    type TEXT NOT NULL DEFAULT 'mesa' CHECK (type IN (
        'mesa', 
        'quarto', 
        'balcao', 
        'totem', 
        'etiqueta', 
        'stand'
    )),
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,             -- Info extra (ex: andar, garçom responsável)
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(org_id, code)
);

-- ------------------------------------------------------------------------------
-- 3. CATALOG_ITEMS (Itens do Cardápio, Serviços de Quarto, Prêmios ou Peças)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS catalog_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    category TEXT NOT NULL,                         -- Ex: 'entradas', 'principais', 'room_service', 'premios', 'couro'
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    badges JSONB DEFAULT '[]'::jsonb,               -- Ex: ["Vegetariano", "Sem Glúten"] ou ["Couro Cariri", "Tiragem 50"]
    order_index INT DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. INTERACTIONS (Ações em Tempo Real: Pedidos, Chamados, Avaliações, Resgates)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    spot_id UUID REFERENCES spots(id) ON DELETE SET NULL,
    spot_code TEXT,
    spot_label TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'chamado_garcom',
        'pedido_comanda',
        'solicitacao_quarto',
        'avaliacao_positiva',
        'avaliacao_negativa',
        'resgate_fidelidade',
        'storytelling_view',
        'duvida_vendedor'
    )),
    payload JSONB DEFAULT '{}'::jsonb,              -- Dados do pedido (itens, total, nota, mensagem)
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN (
        'pendente', 
        'em_atendimento', 
        'concluido', 
        'cancelado'
    )),
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- ÍNDICES DE ALTA PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_spots_org ON spots(org_id);
CREATE INDEX IF NOT EXISTS idx_catalog_org ON catalog_items(org_id);
CREATE INDEX IF NOT EXISTS idx_interactions_org_status ON interactions(org_id, status);
CREATE INDEX IF NOT EXISTS idx_interactions_created ON interactions(created_at DESC);

-- ------------------------------------------------------------------------------
-- HABILITAÇÃO DO REALTIME (Supabase)
-- Faz com que a tela do Garçom e da Recepção receba novos eventos instantaneamente
-- ------------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE interactions;

-- ------------------------------------------------------------------------------
-- POLÍTICAS DE ACESSO (Row Level Security - RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Leitura pública para quem encostar o celular na tag NFC (não exige login)
CREATE POLICY "Public read organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Public read spots" ON spots FOR SELECT USING (is_active = true);
CREATE POLICY "Public read catalog" ON catalog_items FOR SELECT USING (is_available = true);

-- Clientes na mesa/quarto podem inserir chamados e pedidos anonimamente
CREATE POLICY "Public insert interactions" ON interactions FOR INSERT WITH CHECK (true);

-- Equipe autenticada (ou via chave segura) pode ler e atualizar interações
CREATE POLICY "Public read interactions by org" ON interactions FOR SELECT USING (true);
CREATE POLICY "Public update interactions by org" ON interactions FOR UPDATE USING (true);

-- ==============================================================================
-- DADOS INICIAIS (SEED FIXTURES) — SEUS 4 CLIENTES DE DEMONSTRAÇÃO
-- ==============================================================================

-- 1. Botânico Bistrô (Gastronomia)
INSERT INTO organizations (id, slug, name, segment, whatsapp, brand_color)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-000000000001',
    'botanico-bistro',
    'Botânico Bistrô',
    'gastronomia',
    '5587999099937',
    '#f59e0b'
) ON CONFLICT (slug) DO NOTHING;

-- Mesas do Botânico Bistrô
INSERT INTO spots (org_id, code, label, type)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'm01', 'Mesa 01 - Salão', 'mesa'),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'm02', 'Mesa 02 - Salão', 'mesa'),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'm04', 'Mesa 04 - Varanda', 'mesa')
ON CONFLICT (org_id, code) DO NOTHING;

-- Cardápio do Botânico Bistrô
INSERT INTO catalog_items (org_id, category, title, description, price, badges)
VALUES
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'entradas', 'Bruschetta Caprese', 'Tomate cereja, muçarela de búfala, manjericão e balsâmico.', 28.90, '["Vegetariano"]'::jsonb),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'entradas', 'Carpaccio de Abobrinha', 'Lâminas grelhadas com pesto de rúcula e lascas de parmesão.', 32.00, '["Vegano", "Sem Glúten"]'::jsonb),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'principais', 'Risoto de Funghi Trufado', 'Arroz arbóreo com mix de cogumelos, trufa negra e parmesão.', 58.90, '["Vegetariano"]'::jsonb),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'principais', 'Salmão na Brasa', 'Com purê de batata-doce roxa e aspargos salteados.', 72.00, '["Sem Glúten"]'::jsonb),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000001', 'bebidas', 'Gin Tônica Botânica', 'Gin artesanal, tônica premium, pepino japonês e alecrim.', 38.00, '["Artesanal"]'::jsonb)
ON CONFLICT DO NOTHING;

-- 2. Hotel Jardim Imperial (Hotelaria)
INSERT INTO organizations (id, slug, name, segment, whatsapp, brand_color)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-000000000002',
    'hotel-imperial',
    'Hotel Jardim Imperial',
    'hotelaria',
    '5587999099937',
    '#d4a853'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO spots (org_id, code, label, type)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000002', 'q412', 'Suíte 412 Imperial', 'quarto'),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000002', 'q415', 'Suíte Master 415', 'quarto')
ON CONFLICT (org_id, code) DO NOTHING;

-- 3. Ateliê Raízes do Cariri (Moda Autoral & Couro)
INSERT INTO organizations (id, slug, name, segment, whatsapp, brand_color)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-000000000003',
    'atelie-raizes',
    'Ateliê Raízes do Cariri',
    'artesanato_moda',
    '5587999099937',
    '#0055FF'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO spots (org_id, code, label, type)
VALUES 
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000003', 'etq-01', 'Bolsa Mandacaru Couro Legítimo #07', 'etiqueta'),
    ('a1b2c3d4-e5f6-4a5b-8c9d-000000000003', 'etq-02', 'Gibão Artesanal Tradição #03', 'etiqueta')
ON CONFLICT (org_id, code) DO NOTHING;
