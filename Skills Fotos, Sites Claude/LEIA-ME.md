# Skills Fotos, Sites Claude

Todas as skills que dá para levar para fora do Claude, cada uma em sua pasta.

## Instalar

O Claude só reconhece uma skill se ela estiver em **uma pasta com o nome da skill,
contendo um arquivo chamado exatamente `SKILL.md`**. Copie as pastas (não esta
pasta-mãe inteira) para um destes lugares:

**Global (vale em todos os projetos)**
```
Windows:      %USERPROFILE%\.claude\skills\
macOS/Linux:  ~/.claude/skills/
```

**Por projeto (recomendado para trabalho de cliente)**
```
<pasta do projeto>\.claude\skills\
```

**No claude.ai / app do Claude**: compacte uma pasta de skill em `.zip` e envie em
Configurações → Capacidades → Skills.

Depois abra o Claude Code na pasta e rode `/skills` para conferir se apareceram.

## O que tem aqui

### Fotos, imagens e visuais

| Pasta | Função | Precisa de setup |
|---|---|---|
| `canvas-design` | Pôster, arte e peça estática em PNG/PDF, com 50+ fontes inclusas | Python |
| `visualizations` | PNG estilo desenhado à mão | API key kie.ai |
| `excalidraw-visuals` | Idem, versão com script | API key kie.ai (copie `.env.example` para `.env`) |
| `excalidraw-diagram` | Diagrama editável (.excalidraw) | Não |

### Sites

| Pasta | Função | Precisa de setup |
|---|---|---|
| `frontend-design` | Direção estética. Base de tudo. | Não |
| `video-to-website` | Site com scroll-driven a partir de vídeo | FFmpeg + Node |

### Criar e melhorar skills / aprender

| Pasta | Função | Precisa de setup |
|---|---|---|
| `skill-builder` | Criar e auditar suas próprias skills | Não |
| `skill-creator` | Criar skills, rodar testes e medir desempenho (versão da Anthropic) | Python |
| `learn` | Modo professor: explicar, ensinar, fazer quiz | Não |

## Antes de usar video-to-website

```
ffmpeg -version     # precisa responder
node -v             # precisa responder
```

Sirva sempre por HTTP, nunca abrindo o arquivo direto:
```
npx serve .
```

## O que não está aqui, e por quê

- **docx, pdf, pptx, xlsx, chrome-browser, computer-use, built-in-browser**: a licença
  da Anthropic proíbe copiar ou guardar essas skills fora do Claude. Elas já vêm
  ligadas na sua conta, então não precisa instalar nada. As versões públicas de
  docx/pdf/pptx/xlsx estão em https://github.com/anthropics/skills.
- **deep-research, docs, google-workspace, import-memory, morning, session-start-hook**:
  vêm da Anthropic sem licença de redistribuição e só funcionam dentro do Claude,
  ligadas aos conectores da sua conta.
- **dataviz, artifact-design, code-review, simplify, loop, claude-api e afins**: vêm
  embutidas no próprio Claude Code e não existem como arquivo para exportar.

`canvas-design`, `learn` e `skill-creator` são da Anthropic sob licença Apache 2.0
(veja o `LICENSE.txt` de cada uma); por isso podem ficar aqui.
