# Regras de Manutenção e Governança do Projeto (Nolei Creative NFC)

Estas diretrizes são obrigatórias para qualquer desenvolvedor, agente de IA ou mantenedor que realizar alterações no repositório:

## 1. Alterações de Estrutura -> Atualização Obrigatória do `README.md`
Sempre que houver qualquer alteração na estrutura do projeto, incluindo:
- Adição, renomeação ou remoção de páginas, arquivos, rotas ou diretórios;
- Inclusão ou desativação de módulos funcionais, demonstrações ou componentes de hardware;
- Modificações nas tecnologias base, bibliotecas, scripts ou variáveis de ambiente;
- Alterações no fluxo de build, deploy ou arquivos de configuração;

**Ação mandatória**: O arquivo `README.md` deve ser atualizado imediatamente para refletir a nova estrutura de pastas, links públicos/privados e arquitetura do sistema.

---

## 2. Alterações de Fluxo ou Logística Operacional -> Atualização Obrigatória de `docs.html`
Sempre que for alterado o fluxo de interação, jornada do usuário ou a logística operacional do sistema, incluindo:
- Alteração nos papéis de acesso (visitante público vs administrador autenticado);
- Mudanças no fluxo de aproximação NFC (`r.html`), redirecionamento ou validação antifraude;
- Novos passos de atendimento (ex: chamado de garçom, comanda da cozinha, governança de hotel, resgate no caixa);
- Adição de novos modelos de hardware físico ou protocolos de gravação;

**Ação mandatória**: A documentação técnica interna `docs.html` deve ser atualizada em suas respectivas seções e tabelas de fluxo.

---

## 3. Diretrizes Visuais e de Interface
- **Títulos Limpos**: Nunca inserir emojis/emotes dentro das tags `<title>`. Os títulos das abas devem permanecer sóbrios e institucionais.
- **Warm Obsidian**: Respeitar estritamente a paleta Obsidian / Terracotta / Marfim (`--bg-canvas: #141210`, `--bg-panel: #1F1A15`, `--accent: #C15D30`).
- **Estados Inativos**: Demonstrações ou itens em desenvolvimento devem utilizar a classe `.card-disabled` ou `.card-in-dev` (grayscale 100%, opacidade 0.55, `cursor: not-allowed`, `pointer-events: none` e sem efeitos de hover/transform).
- **Segregação de Segurança**: Painéis operacionais internos ("Entrar na Empresa", métricas, diagnósticos) nunca devem ser expostos para usuários não autenticados.
