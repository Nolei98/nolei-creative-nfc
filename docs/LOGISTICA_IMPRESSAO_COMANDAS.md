# 🖨️ Manual de Logística de Impressão de Comandas & Integração Térmica

> **Nolei Creative NFC — Ecossistema Gastronômico Inteligente**  
> *Data de Atualização: Setembro de 2026*  
> *Compatibilidade: Padrão Térmico 80mm (ESC/POS) e 58mm (Smart POS / Bluetooth)*

---

## 1. Visão Geral & Política de Hardware Zero Custo

Uma das perguntas mais recorrentes dos donos e gerentes de restaurantes é:  
**"Preciso comprar uma maquininha ou impressora nova para implantar a Nolei Creative?"**

**A resposta é NÃO.**  
A plataforma foi projetada para ser **100% agnóstica de hardware**, reaproveitando integralmente os equipamentos que o estabelecimento já possui:

1. **Maquininhas Smart POS Android (Stone, Cielo Lio, PagBank, Rede, Ton):**
   - Possuem sistema operacional Android e impressora térmica de 58mm embutida na própria carcaça.
   - O garçom acessa o painel web da mesa no navegador da maquininha e aciona a impressão direta via driver Android nativo.
2. **Impressoras Térmicas de Balcão e Cozinha (Epson TM-T20, Elgin i9, Bematech MP-4200, Daruma):**
   - Conectadas via cabo USB ou Rede Ethernet (IP) ao computador do caixa, expedição ou tela KDS.
   - Suportam impressão padrão de 80mm com acionamento manual ou **Silent Kiosk Printing** (impressão automática e silenciosa sem caixas de diálogo).
3. **Mini-Impressoras Térmicas Bluetooth de Cintura (58mm):**
   - Pareadas diretamente com o smartphone do garçom.

---

## 2. Fluxo Operacional Passo a Passo

```
[ CLIENTE NA MESA ]
       │
       ▼ (Aproximação NFC ou QR Code na Placa)
[ Cardápio Digital Interativo ]
       │
       ▼ (Adiciona itens com nome e observações)
[ Envio do Pedido ]
       │
       ├───────────────────────────────────────────┐
       ▼                                           ▼
[ Painel do Garçom / KDS ]               [ Impressora de Produção ]
  - Notificação sonora & visual            - Ticket térmico automático (80mm ou 58mm)
  - Botão "🖨️ Comanda"                     - Separação por praça (Cozinha / Bar)
  - Gestão de status:                      - Observações destacadas (ex: "Sem cebola")
    [Em Preparo] ➔ [Entregue]
       │
       ▼ (Cliente clica em "Pedir a Conta")
[ Alerta de Fechamento de Mesa ]
       │
       ▼ (Garçom clica em "🖨️ Pré-Conta")
[ Emissão do Demonstrativo de Conferência ]
  - Itens agrupados + Subtotal
  - Taxa de serviço sugerida (10%)
  - QR Code / Chave PIX direta do restaurante
  - CTA para avaliação 5 Estrelas no Google
```

---

## 3. Modelos de Tickets Térmicos Padronizados

### 3.1 Modelo Cozinha / Produção (Padrão 80mm — 48 colunas)

```text
================================================
          BOTANICO BISTRO & GASTRONOMIA         
        Av. Des. Moreira, 1701 - Aldeota        
================================================
PEDIDO COZINHA / PRODUCAO
MESA: 04                    HORA: 14:32:10
GARCOM: CARLOS EDUARDO      DATA: 27/09/2026
------------------------------------------------
QTD  ITEM / DESCRICAO                   VALOR   
------------------------------------------------
 1x  RISOTO DE FUNGHI PORCINI         R$ 58,90  
     Cli: Joao Silva • Recente                  
     >>> OBS: Ponto al dente, pouco sal         

 1x  SALMAO GRELHADO NA BRASA         R$ 72,00  
     Cli: Camila • Recente                      
     >>> OBS: Sem molho de maracuja à parte     
------------------------------------------------
ITENS: 2                             VIA: COZINHA
================================================
           SISTEMA NOLEI CREATIVE NFC           
================================================
```

---

### 3.2 Modelo Cozinha / Smart POS (Padrão 58mm — 32 colunas)

```text
================================
 BOTANICO BISTRO & GASTRONOMIA  
================================
PEDIDO COZINHA (PRODUCAO)
MESA: 04          HORA: 14:32:10
GARCOM: CARLOS EDUARDO
--------------------------------
1x  RISOTO DE FUNGHI    R$ 58,90
    Cli: Joao Silva
    >>> OBS: Pouco sal
1x  SALMAO GRELHADO     R$ 72,00
    Cli: Camila
    >>> OBS: Sem molho
--------------------------------
ITENS: 2            VIA: COZINHA
================================
     [ NOLEI CREATIVE NFC ]     
================================
```

---

### 3.3 Modelo Pré-Conta / Conferência de Mesa (Padrão 80mm com PIX)

```text
================================================
          BOTANICO BISTRO & GASTRONOMIA         
        Av. Des. Moreira, 1701 - Aldeota        
             CNPJ: 12.345.678/0001-90           
================================================
            DEMONSTRATIVO DE CONSUMO            
       (CONFERENCIA DE MESA - NAO FISCAL)       
------------------------------------------------
MESA: 04                    HORA: 15:10         
ATENDENTE: CARLOS EDUARDO   DATA: 27/09/2026    
------------------------------------------------
DESCRICAO / QTD                       TOTAL (R$)
------------------------------------------------
1x Risoto de Funghi Porcini                58,90
1x Salmao Grelhado na Brasa                72,00
2x Gin Tonica Botanica                     76,00
1x Limonada Siciliana                      18,90
------------------------------------------------
SUBTOTAL CONSUMO:                      R$ 225,80
SERVICO SUGERIDO (10%):                 R$ 22,58
------------------------------------------------
TOTAL COM 10%:                         R$ 248,38
TOTAL SEM 10%:                         R$ 225,80
------------------------------------------------
PAGAMENTO FACIL VIA PIX:
financeiro@botanicobistro.com.br
(Aceitamos Cartao de Credito, Debito, Pix e VR)
================================================
  Avalie no Google: sua nota 5 estrelas vale muito!  
       Obrigado pela visita e volte sempre!     
================================================
```

---

## 4. Guia de Configuração Técnica dos Equipamentos

### Opção A: Impressão Silenciosa no Caixa / Cozinha (Chrome Kiosk Mode)
Para que os cupons sejam impressos instantaneamente na impressora térmica sem abrir caixa de diálogo de confirmação:
1. Conecte a impressora térmica (Epson, Elgin, Bematech) no computador via USB ou IP de Rede.
2. Defina a impressora térmica como a **Impressora Padrão** do Windows/Linux.
3. No atalho do Google Chrome que abre o monitor KDS, adicione a flag:
   ```bash
   chrome.exe --kiosk --kiosk-printing "https://nolei-creative-nfc.vercel.app/demo/painel-restaurante.html"
   ```
4. Ao clicar em "🖨️ Imprimir" ou receber novos pedidos, a impressora cortará o papel imediatamente.

### Opção B: Maquininhas Android Smart POS (Stone / Cielo Lio / PagBank)
1. Conecte a maquininha ao Wi-Fi do restaurante.
2. Abra o navegador web padrão ou instale um WebApp PWA com a URL do painel:
   `https://nolei-creative-nfc.vercel.app/demo/painel-restaurante.html`
3. O painel adapta a interface responsiva e permite emitir as comandas diretamente na bobina de 58mm integrada.

### Opção C: Integração com Softwares de PDV Existentes (Colibri, Totvs Chef, Saipos, Teknisa)
Caso o restaurante já possua um sistema PDV legado fechado:
- O painel da Nolei Creative disponibiliza o botão **"📋 Copiar Texto"** e endpoint webhook/API para enviar a comanda diretamente para o spooler de impressão do software atual.

---

## 5. Resumo das Vantagens para Apresentação ao Restaurante

- ✅ **Investimento Inicial em Hardware: R$ 0,00.**
- ✅ **Compatível com 80mm (bobinas de balcão) e 58mm (maquininhas portáteis).**
- ✅ **Acelera o tempo de fechamento de mesa e reduz filas no caixa.**
- ✅ **Diminui erros de comunicação entre salão e cozinha.**
- ✅ **Aumenta a captação de gorjetas e incentiva avaliações 5 estrelas no Google.**
