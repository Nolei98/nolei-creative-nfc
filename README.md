# ⚡ Nolei Creative — Plataforma Phygital & Hub Administrativo NFC

Ecossistema físico-digital de alta performance desenvolvido pela **Nolei Creative**. Conecta pontos físicos (mesas, balcões, suítes, fachadas, espelhos e peças de vestuário) a experiências web interativas **sem exigir download de aplicativos da App Store ou Google Play**.

---

## 🌐 Acesso Rápido em Produção

* **Página Institucional**: [https://nolei-creative-nfc.vercel.app](https://nolei-creative-nfc.vercel.app)
* **Hub Comercial & Administrativo**: [https://nolei-creative-nfc.vercel.app/admin/index.html](https://nolei-creative-nfc.vercel.app/admin/index.html)
* **Cadastro de Novo Cliente**: [https://nolei-creative-nfc.vercel.app/admin/novo-cliente.html](https://nolei-creative-nfc.vercel.app/admin/novo-cliente.html)
* **Portal Exclusivo do Estabelecimento (Exemplo)**: [https://nolei-creative-nfc.vercel.app/empresa.html?slug=botanico-bistro](https://nolei-creative-nfc.vercel.app/empresa.html?slug=botanico-bistro)
* **Documentação Técnica & Manual**: [https://nolei-creative-nfc.vercel.app/docs.html](https://nolei-creative-nfc.vercel.app/docs.html)

---

## 🏛️ Arquitetura do Sistema

O ecossistema é estruturado em **3 camadas modulares**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CAMADA INSTITUCIONAL                         │
│  index.html (Visão Geral • 7 Pilares • 8 Hardwares Físicos • Banner)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                      2. HUB COMERCIAL & ADMIN                          │
│  /admin/index.html                                                     │
│   ├── [Público] Mostruário de 7 Demos com Fotos de Alta Resolução      │
│   └── [Restrito - Login] Área Privada de Gestão                        │
│         ├── Lista de Contratos & Clientes Ativos                       │
│         ├── Assistente Google Meu Negócio (Links 5★ e QR)              │
│         ├── Gerador de Tags & QR em Lote (gerador-tags.html)           │
│         ├── Diagnóstico de Nuvem Supabase (status-supabase.html)       │
│         └── Botão Deslogar (Encerramento Seguro de Sessão)             │
│                                                                        │
│  /admin/novo-cliente.html (Auth Guard Obrigatório)                     │
│   ├── Seleção de Segmento Comercial                                    │
│   ├── Módulos Contratados 100% Customizáveis (Iniciam Desmarcados)     │
│   ├── Suporte a Domínio Próprio White-label (ex: cliente.com.br)       │
│   └── Geração Automática do Portal Exclusivo da Empresa                │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 3. PORTAL EXCLUSIVO DA EMPRESA                         │
│  empresa.html?slug=<slug-do-cliente>                                   │
│   ├── Ambiente 100% Isolado (Sem Contaminação de Outros Negócios)      │
│   ├── Acesso Direto no Topo: "Hub de Demonstrações"                    │
│   ├── 4 KPIs Operacionais em Tempo Real (Toques, Chamados, Google, Tags)│
│   ├── Módulos Contratados com Simulador de QR Code e Aproximação NFC   │
│   ├── Mapeamento Físico de Pontos (Mesas, Balcões, Quartos, Totens)    │
│   └── Formulário de Configurações com Salvamento Imediato              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Controle de Acesso & Segurança (Auth Guard)

O sistema diferencia visual e funcionalmente a área pública da área administrativa:

| Recurso | Acesso Público | Usuário Autenticado (`admin` / `nolei2026`) |
|---|:---:|:---:|
| **Mostruário de Demonstrações** | ✅ Disponível | ✅ Disponível |
| **Páginas de Demonstração Ativas** | ✅ Disponível | ✅ Disponível |
| **Demonstrações em Desenvolvimento** | ⛔ Bloqueado com Badge | ⛔ Bloqueado com Badge |
| **Portais de Empresas Cadastradas** | ✅ Por Link Direto | ✅ Por Link Direto |
| **Aba Área Privada de Contratos** | 🔒 Oculta | ✅ Visível com Lista de Clientes |
| **Cadastro de Novo Cliente** | 🔒 Bloqueado com Redirecionamento | ✅ Formulário Liberado |
| **Assistente Google Meu Negócio** | 🔒 Oculto | ✅ Modal Administrativo Ativo |
| **Botão Deslogar** | — | ✅ Disponível no Topo |

---

## 🎯 Catálogo dos 7 Segmentos Comerciais

| Segmento | Estabelecimento Modelo | Status da Demo | Principais Módulos |
|---|---|:---:|---|
| **1. Gastronomia & Bares** | 🌿 Botânico Bistrô | ✅ Ativa | Cardápio digital, comanda por mesa, chamada de garçom, monitor de cozinha (KDS) e dashboard ROI |
| **2. Hotelaria & Pousadas** | 🏨 Hotel Jardim Imperial ★★★★★ | ✅ Ativa | Concierge na cabeceira, room service 24h, agendamento de café colonial e governança |
| **3. Saúde & Clínicas** | ⭐ Clínica Dra. Sofia Santos | ✅ Ativa | Totem balcão com filtro de satisfação (4-5★ vai pro Google Maps; 1-3★ vai pra ouvidoria interna) |
| **4. Fidelidade & Varejo** | ☕ Café Origem | ✅ Ativa | Cartão de 10 carimbos digital gamificado no balcão sem aplicativo e catálogo de prêmios |
| **5. Moda Autoral & Couro** | 🧵 Ateliê Raízes do Cariri | ✅ Ativa | Etiqueta costurada na peça com storytelling do artesão e certificado de autenticidade numerado |
| **6. Barbearias & Salões** | ✂️ Barbearia Dom Corleone | 🚧 Em Desenvolvimento | Tag de espelho anti-metal, fidelidade de cortes e agendamento sem fila |
| **7. Imobiliárias & Plantões**| 🏙️ Horizon Imóveis | 🚧 Em Desenvolvimento | Placa phygital de fachada IP68, tour 360° e WhatsApp de corretor de plantão 24h |

---

## 🛠️ Hardware Phygital & Displays Físicos (8 Modelos)

Todos os displays são gravados a laser e equipados com chips **NTAG213 / NTAG215** de alta sensibilidade:

1. **Display L-Shape Black Piano (Restaurantes)**: Acrílico preto brilhante para centro de mesas com QR Code de apoio.
2. **Totem Google Avaliações (Clínicas & Balcões)**: Acrílico cristal de alta densidade para check-out e recepção.
3. **Cavalete em Madeira Nobre (Cafés & Suítes)**: Madeira maciça de reflorestamento com gravação pirogravada.
4. **Cartão Mini Quadrado (Fidelização)**: PVC rígido fosco com cantos arredondados para chaveiro ou carteira.
5. **Disco Resinado Auto-Adesivo (Áreas Externas)**: Acrílico impermeável com resina PU automotiva e fita 3M VHB para piscinas e bistrôs.
6. **Tag de Espelho & Bancada Anti-Metal (Barbearias)**: Adesivo com camada de **ferrite anti-interferência** que isola reflexos e superfícies metálicas condutivas.
7. **Placa de Fachada Externa IP68 (Imobiliárias & Loteamentos)**: Acrílico cast maciço e alumínio escovado com blindagem UV total contra intempéries e sol.
8. **Tag em Couro com Chip Oculto (Moda Autoral)**: Couro vegetal costurado manualmente com chip NFC ultrafino selado internamente.

---

## 💻 Stack Tecnológica

* **Frontend**: HTML5 Semântico, CSS3 Moderno (*Warm Obsidian Design System* com variáveis CSS), Vanilla JavaScript modular e responsivo.
* **Banco de Dados & Realtime**: Supabase (PostgreSQL) com fallback resiliente para `localStorage` e arquivos JSON estruturados.
* **Roteamento Phygital**: Motor dinâmico `r.html?t=<tag_id>` com redirecionamento em milissegundos.
* **Deploy & Hospedagem**: Vercel Production com CI/CD automático conectado ao GitHub.

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/Nolei98/nolei-creative-nfc.git
cd nolei-creative-nfc
```

2. Abra qualquer arquivo diretamente no navegador ou sirva via servidor local:
```bash
npx serve .
# ou
python -m http.server 3000
```

3. Acesse `http://localhost:3000` para a homepage ou `http://localhost:3000/admin/index.html` para o Hub Comercial.

---

## 📄 Licença & Direitos

Plataforma proprietária desenvolvida pela **Nolei Creative**. Todos os direitos reservados.
