# Skills organizadas — instalação

O pacote original vinha com nomes quebrados (`SKILL (2).md`), duplicatas e um caminho
de FFmpeg travado na máquina do autor. Isso aqui já está corrigido.

## Instalar

O Claude só reconhece uma skill se ela estiver em **uma pasta com o nome da skill,
contendo um arquivo chamado exatamente `SKILL.md`**.

**Global (vale em todos os projetos)**
```
macOS/Linux:  cp -r * ~/.claude/skills/
Windows:      copie as pastas para  %USERPROFILE%\.claude\skills\
```

**Por projeto (recomendado para trabalho de cliente)**
```
cp -r * /caminho/do/projeto/.claude/skills/
```

Depois abra o Claude Code na pasta e rode `/skills` para conferir se apareceram.

## O que é cada uma

| Pasta | Função | Precisa de setup |
|---|---|---|
| `frontend-design` | Direção estética. Base de tudo. | Não |
| `video-to-website` | Site com scroll-driven a partir de vídeo | FFmpeg + Node |
| `skill-builder` | Criar e auditar suas próprias skills | Não |
| `excalidraw-diagram` | Diagrama editável (.excalidraw) | Não |
| `visualizations` | PNG estilo desenhado à mão | API key kie.ai |
| `excalidraw-visuals` | Idem, versão com script | API key kie.ai |

## Antes de usar video-to-website

```
ffmpeg -version     # precisa responder
node -v             # precisa responder
```

Sirva sempre por HTTP, nunca abrindo o arquivo direto:
```
npx serve .
```
