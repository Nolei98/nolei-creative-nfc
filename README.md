# ⚡ Nolei Creative — Plataforma Phygital & Hub Administrativo NFC

Ecossistema físico-digital de alta performance desenvolvido pela **Nolei Creative**. Conecta pontos físicos (mesas, balcões, suítes, fachadas, espelhos e peças nobres de couro/vestuário) a experiências web interativas **sem exigir download de aplicativos da App Store ou Google Play**.

---

## 🌐 Acesso Rápido em Produção (URLs Amigáveis)

* **Página Institucional**: [https://nolei-creative-nfc.vercel.app](https://nolei-creative-nfc.vercel.app)
* **Hubs de Soluções & Acesso**: [https://nolei-creative-nfc.vercel.app/hubs](https://nolei-creative-nfc.vercel.app/hubs) (ou `/admin`)
* **Portal Exclusivo do Estabelecimento**: [https://nolei-creative-nfc.vercel.app/empresa/botanico-bistro](https://nolei-creative-nfc.vercel.app/empresa/botanico-bistro) (ou `/e/botanico-bistro`)
* **Acesso do Gestor / Login**: [https://nolei-creative-nfc.vercel.app/login](https://nolei-creative-nfc.vercel.app/login) (ou `/hubs/login`)
* **Portfólio Oficial do Criador**: [https://portfolio-jr-lilac.vercel.app](https://portfolio-jr-lilac.vercel.app)
* **Termos de Uso & LGPD**: [https://nolei-creative-nfc.vercel.app/termos](https://nolei-creative-nfc.vercel.app/termos) (ou `/lgpd`)
* **Plano Estratégico Comercial**: [https://nolei-creative-nfc.vercel.app/plano](https://nolei-creative-nfc.vercel.app/plano)
* **Manual Técnico & Arquitetura**: [https://nolei-creative-nfc.vercel.app/docs](https://nolei-creative-nfc.vercel.app/docs)
* **Roteador NFC**: [https://nolei-creative-nfc.vercel.app/r?t=m04](https://nolei-creative-nfc.vercel.app/r?t=m04)

---

## 📋 Regras Mandatórias de Governança & Manutenção

Para assegurar a confiabilidade arquitetural e a sincronização contínua do ecossistema, são estabelecidas as seguintes regras:
1. **Alterações Estruturais no Projeto**: Sempre que houver adição, renomeação, exclusão de arquivos, rotas, módulos ou componentes de hardware, o arquivo [README.md](file:///d:/Workspace/Colonizacao/README.md) deve ser obrigatoriamente atualizado.
2. **Alterações de Fluxo e Logística Operacional**: Sempre que forem modificados fluxos de interação, autenticação, jornada do usuário ou processos de atendimento (cozinha, recepção, caixa, governança), a documentação técnica interna [docs.html](file:///d:/Workspace/Colonizacao/docs.html) deve ser obrigatoriamente atualizada.
3. **Higienização de Títulos (`<title>`)**: É estritamente proibido o uso de emotes ou emojis em tags `<title>` em qualquer página do projeto, mantendo as abas do navegador corporativas e limpas.
4. **Isolamento de Gestão nos Hubs**: A rota `/hubs` exibe por padrão a tela de Acesso aos Hubs (login integrado solicitando Usuário + Senha de Acesso e botão "Solicitar cadastro" via WhatsApp) e convite sugestivo para explorar as Soluções Prontas sem login. Painéis de gestão ("Entrar na Empresa", KDS, governança, métricas e clientes reais) são restritos a administradores autenticados.
5. **Componente Modular de Rodapé (`nolei-footer.js`)**: As subpáginas institucionais (`empresa.html`, `docs.html`, `termos-lgpd.html`, `plano-estrategico.html`, `admin/index.html`) utilizam o script compartilhado `/js/nolei-footer.js`, conectando a marca "Nolei Creative" ao portfólio oficial do criador ([portfolio-jr-lilac.vercel.app](https://portfolio-jr-lilac.vercel.app/)), enquanto a home-page mantém rodapé institucional exclusivo.
6. **Ausência de Rodapé nas Demonstrações & CTA no Topo**: As páginas de demonstração interativa (`/demo/*.html`) não possuem rodapé. Em seu lugar, apresentam no menu superior um Call to Action (CTA) destacado **`Entrar em contato`**, direcionando para o WhatsApp Comercial com mensagem pré-formatada contextualizada para cada segmento.

---

## 🏛️ Arquitetura do Sistema

O ecossistema é estruturado em **3 camadas modulares**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        1. CAMADA PÚBLICA                               │
│  index.html (Visão Geral • 7 Pilares • Hardwares Físicos • Banner)     │
│  termos-lgpd.html (Termos de Uso • Política LGPD • Garantia Hardware)  │
│  /admin/index.html [Aba Demos] (Mostruário de 7 Soluções Comerciais)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 2. PORTAL EXCLUSIVO DA EMPRESA                         │
│  empresa.html?slug=<slug-do-cliente>                                   │
│   ├── Ambiente 100% Isolado por Tenant                                 │
│   ├── Acesso Direto no Topo: "Hub de Demonstrações"                    │
│   ├── 4 KPIs Operacionais em Tempo Real (Toques, Chamados, Google, Tags)│
│   ├── Módulos Contratados com Simulador de QR Code e Aproximação NFC   │
│   ├── Mapeamento Físico de Pontos (Mesas, Balcões, Quartos, Totens)    │
│   └── Configurações Comerciais (Wi-Fi, WhatsApp e Avaliações Google)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
┌──────────────────────────────────▼─────────────────────────────────────┐
│                 3. ÁREA PRIVADA & FERRAMENTAS ADMIN                    │
│  /hub [Aba Privada] (Requer Autenticação de Gestor Nolei)               │
│   ├── Lista de Contratos & Clientes Reais Cadastrados                  │
│   ├── Assistente Google Meu Negócio (Extração de Link 5★ e QR)         │
│   ├── Plano Estratégico & Catálogo (plano-estrategico.html)            │
│   ├── Manual Técnico & Arquitetura (docs.html)                         │
│   ├── Gerador de Displays & QR em Lote para Gráfica (gerador-tags.html)│
│   ├── Diagnóstico de Nuvem Supabase (status-supabase.html)             │
│   └── Cadastro de Novo Cliente (/admin/novo-cliente.html)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Controle de Acesso & Segurança (Auth Guard)

O sistema diferencia estritamente os recursos abertos aos clientes dos utilitários de gestão comercial e documentos estratégicos da Nolei Creative:

| Recurso | Acesso Público | Gestor Autenticado (Credencial Nolei) |
|---|:---:|:---:|
| **Demonstrações de Clientes (Demos)** | ✅ Disponível ("Abrir Demonstração") | ✅ Disponível |
| **Acesso a Painéis ("Entrar na Empresa")** | 🔒 Oculto para Visitantes | ✅ Visível após Login |
| **Páginas de Demonstração Ativas** | ✅ Disponível | ✅ Disponível |
| **Demonstrações em Desenvolvimento** | 🚧 Bloqueado com Badge | 🚧 Bloqueado com Badge |
| **Termos de Uso & LGPD** | ✅ Disponível | ✅ Disponível |
| **Portais de Empresas Cadastradas** | ✅ Por Link Direto | ✅ Por Link Direto |
| **Aba Área Privada de Contratos** | 🔒 Oculta no Hub | ✅ Visível com Lista de Clientes |
| **Cadastro de Novo Cliente (`novo-cliente.html`)** | 🔒 Bloqueado com Tela de Erro | ✅ Formulário Liberado |
| **Plano Estratégico (`plano-estrategico.html`)** | 🔒 Bloqueado com Tela de Erro | ✅ Documento Comercial Liberado |
| **Documentação Técnica (`docs.html`)** | 🔒 Bloqueado com Tela de Erro | ✅ Manual Técnico Liberado |
| **Gerador de Tags (`gerador-tags.html`)** | 🔒 Bloqueado com Tela de Erro | ✅ Ferramenta de Impressão Liberada |
| **Status Supabase (`status-supabase.html`)** | 🔒 Bloqueado com Tela de Erro | ✅ Telemetria da Nuvem Liberada |
| **Botão Deslogar** | — | ✅ Disponível em Todas as Rotas Admin |

> **Nota de Segurança**: Qualquer tentativa de acesso direto às rotas administrativas por usuários não logados renderiza a tela estilizada **`[Acesso Restrito ao Administrador] Você precisa estar logado`**, oferecendo botão direto para login ou retorno ao início público, sem disparar alertas invasivos.

---

## 🎯 Catálogo dos 7 Segmentos Comerciais

| Segmento | Estabelecimento Modelo | Status da Demo | Principais Módulos |
|---|---|:---:|---|
| **1. Gastronomia & Bares** | 🌿 Botânico Bistrô | ✅ Ativa | Cardápio digital, comanda por mesa, chamada de garçom, monitor de cozinha e dashboard ROI |
| **2. Hotelaria & Pousadas** | 🏨 Hotel Jardim Imperial ★★★★★ | ✅ Ativa | Concierge na cabeceira, room service 24h, agendamento de café colonial e governança |
| **3. Saúde & Clínicas** | ⭐ Clínica Dra. Sofia Santos | ✅ Ativa | Totem balcão com filtro de satisfação (4-5★ vai pro Google Maps; 1-3★ vai pra ouvidoria interna) |
| **4. Fidelidade & Varejo** | ☕ Café Origem | ✅ Ativa | Cartão de 10 carimbos digital gamificado no balcão sem aplicativo e catálogo de prêmios |
| **5. Moda Autoral & Couro** | 🧵 Ateliê Raízes do Cariri | ✅ Ativa | Etiqueta costurada na peça com storytelling do artesão e certificado de autenticidade numerado |
| **6. Barbearias & Salões** | ✂️ Barbearia Dom Corleone | 🚧 Em Desenvolvimento | Tag de espelho anti-metal, fidelidade de cortes e agendamento sem fila |
| **7. Imobiliárias & Plantões**| 🏙️ Horizon Imóveis | 🚧 Em Desenvolvimento | Placa phygital de fachada IP68, tour 360° e WhatsApp de corretor de plantão 24h |

---

## 🛠️ Hardware Phygital & Displays Físicos

Todos os displays são gravados a laser e equipados com chips semicondutores **NTAG213 / NTAG215 / NTAG216** de alta sensibilidade:

1. **Display L-Shape Black Piano (Restaurantes)**: Acrílico preto brilhante para centro de mesas com QR Code de apoio.
2. **Totem Google Avaliações (Clínicas & Balcões)**: Acrílico cristal de alta densidade para check-out e recepção.
3. **Cavalete em Madeira Nobre (Cafés & Suítes)**: Madeira maciça de reflorestamento com gravação pirogravada.
4. **Cartão Mini Quadrado (Fidelização)**: PVC rígido fosco com cantos arredondados para chaveiro ou carteira.
5. **Disco Resinado Auto-Adesivo (Áreas Externas)**: Acrílico impermeável com resina PU automotiva e fita 3M VHB para piscinas e bistrôs.
6. **Tag de Espelho & Bancada Anti-Metal (Barbearias)**: Adesivo com camada de **ferrite anti-interferência** que isola reflexos e superfícies metálicas condutivas.
7. **Placa de Fachada Externa IP68 (Imobiliárias & Loteamentos)**: Acrílico cast maciço e alumínio escovado com blindagem UV total contra intempéries e sol.
8. **Etiqueta em Couro com Chip Oculto (Moda Autoral)**: Couro vegetal com costura perimetral reforçada e gravação térmica.

---

## 💻 Stack Tecnológica

* **Frontend**: HTML5 Semântico, CSS3 Moderno (Warm Obsidian Design System), JavaScript ES6+ Vanilla (Zero dependências externas pesadas).
* **NFC & Roteamento**: Roteamento universal por query strings (`?source=nfc&org=...&spot=...`) com compatibilidade iOS 11+ e Android 5+.
* **Nuvem & Backend**: Supabase (PostgreSQL, Row Level Security, Realtime WebSockets) + Vercel Edge Network.
* **Segurança**: Privacy by Design, Zero Coleta de Identificadores Pessoais no toque, Auth Guard em rotas de gestão.

---

## 🔑 Acesso & Credenciamento de Novos Clientes

* **Acesso Administrativo**: Disponível para gestores e parceiros credenciados através de `/login`.
* **Solicitar Cadastro**: Novos estabelecimentos podem solicitar credenciamento diretamente via WhatsApp Comercial [https://wa.me/5587999099937](https://wa.me/5587999099937).
