# 🚀 Nolei Creative — Protótipo NFC Demo

Landing page institucional para demonstração de produtos NFC da **Nolei Creative**.  
Dois cenários interativos: **Avaliações Google para Clínicas** e **Cardápio Digital para Restaurantes**.

---

## 📋 Pré-requisitos

- Um navegador moderno (Chrome, Safari, Firefox, Edge)
- Para demonstração NFC: tag NTAG213 ou NTAG215 + app [NFC Tools](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc)
- Para deploy: conta gratuita em Vercel, Netlify, ou GitHub Pages

---

## 🏗️ Estrutura do Projeto

```
├── index.html              ← Página principal (SPA)
├── css/
│   └── styles.css          ← Design system completo
├── js/
│   ├── app.js              ← Controlador principal
│   ├── splash.js           ← Splash screen NFC
│   ├── analytics.js        ← Detecção de canal + WhatsApp
│   ├── demo-clinic.js      ← Demo avaliação Google
│   └── demo-restaurant.js  ← Demo cardápio digital
└── README.md               ← Este arquivo
```

---

## 📡 Programando a Tag NFC

### 1. Instale o NFC Tools
- **Android**: [Google Play](https://play.google.com/store/apps/details?id=com.wakdev.wdnfc)
- **iOS**: [App Store](https://apps.apple.com/app/nfc-tools/id1252962749)

### 2. Configure a URL com parâmetros de rastreamento

Use este formato ao gravar a tag:

```
https://SEU-DOMINIO.com/?source=nfc&medium=acrylic_stand&loc=recepcao
```

**Parâmetros disponíveis:**
| Parâmetro | Descrição | Exemplos |
|-----------|-----------|----------|
| `source` | Canal de acesso | `nfc`, `qr` |
| `medium` | Tipo de hardware | `acrylic_stand`, `card`, `table_sticker` |
| `loc` | Localização física | `recepcao`, `mesa_04`, `balcao` |

### 3. Grave a Tag
1. Abra o NFC Tools → **Escrever** → **Adicionar um registro** → **URL/URI**
2. Cole a URL com parâmetros
3. Toque **Escrever** e aproxime o celular da tag
4. Aguarde confirmação ✅

---

## 📱 Gerando o QR Code

1. Acesse [qr-code-generator.com](https://www.qr-code-generator.com/) ou similar
2. Use a mesma URL, mas com `source=qr`:
   ```
   https://SEU-DOMINIO.com/?source=qr&medium=table_sticker
   ```
3. Baixe e imprima o QR Code
4. Cole no suporte físico junto à tag NFC

---

## 🌐 Deploy (Hospedagem Gratuita)

### Opção 1: Vercel (Recomendado)
```bash
npm i -g vercel
vercel --prod
```

### Opção 2: Netlify
1. Arraste a pasta do projeto para [app.netlify.com/drop](https://app.netlify.com/drop)
2. Pronto! URL gerada automaticamente.

### Opção 3: GitHub Pages
1. Crie um repositório no GitHub
2. Faça push dos arquivos
3. Vá em Settings → Pages → Source: `main` branch
4. Acesse `https://seu-usuario.github.io/nome-repo`

---

## ⚙️ Personalização

### Trocar o Número do WhatsApp
Em `js/analytics.js`, procure a constante:
```javascript
const WHATSAPP_PHONE = '5511999999999';
```
Substitua pelo número real (formato: código do país + DDD + número, sem símbolos).

### Trocar Dados da Clínica Fictícia
Em `index.html`, procure a seção `#demo-clinic-content` e altere:
- Nome da doutora
- Especialidade
- Nome da clínica

### Trocar Itens do Cardápio
Em `js/demo-restaurant.js`, edite o objeto `menuData` com os itens reais.

### Trocar Nome do Restaurante
Em `index.html`, procure `#demo-restaurant-content` e altere:
- Nome do restaurante
- Número da mesa

### Configurar Link de Avaliação Google Real
1. Acesse o [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Busque o negócio e copie o Place ID
3. O link final será:
   ```
   https://search.google.com/local/writereview?placeid=SEU_PLACE_ID
   ```

> ⚠️ **Dica profissional**: Nunca grave o link do Google diretamente na tag NFC. Use sua própria URL como proxy/redirect para poder alterar o destino sem reprogramar o hardware.

---

## 🧪 Testando Localmente

Basta abrir o `index.html` no navegador. Para simular diferentes canais:

- **Simular NFC**: `index.html?source=nfc`
- **Simular QR**: `index.html?source=qr`
- **Acesso direto**: `index.html` (sem parâmetros)

Para testar responsividade, use o DevTools do Chrome (F12 → Toggle Device Toolbar).

---

## 📄 Licença

Protótipo proprietário da Nolei Creative. Uso interno para demonstrações de vendas.
