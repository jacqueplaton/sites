# Instruções para Claude — Jacque Platon

Use este código existente como ponto de partida e faça as alterações que Jacque solicitar. Preserve a identidade preta e laranja, o conteúdo confirmado e o portfólio real. Não reconstrua do zero sem pedido explícito.

## Estrutura
- index.html: página principal.
- style.css: estilos responsivos.
- app.js: menu, seleção de serviços e formulário.
- assets/: logos SVG e capturas reais desktop/mobile em JPG e WebP.
- marca.html: proposta de identidade.
- RELATORIO-PESQUISA.md: fontes, limites e arquitetura planejada.

## Estado atual
Esta é a prévia estática HTML/CSS/JavaScript, ainda não a versão Next.js/TypeScript/Tailwind do briefing. O formulário valida campos e prepara a mensagem localmente, mas não abre nem envia ao WhatsApp. O retrato usa um espaço reservado com JP. A prévia contém noindex e aviso visível.

## Pendências a resolver conforme instruções de Jacque
1. Receber fotografia original e substituir o espaço reservado.
2. Confirmar WhatsApp +55 84 98627-5720 antes de ativar envio.
3. Receber domínio para canonical, Open Graph, sitemap e JSON-LD.
4. Implementar as seis páginas de serviços e a versão Next.js/TypeScript/Tailwind se solicitado na finalização.
5. Instagram: seguidores, biografia e publicações não foram confirmados; solicitar captura, sem inventar dados.
6. Remover aviso de prévia e ajustar indexação somente quando a versão definitiva estiver concluída.

Não invente clientes, depoimentos, resultados, certificações ou vínculo empregatício com o Google. Os aproximadamente 12 anos e a experiência com Google desde 2019 são declarações do profissional.

## Preview estático na Vercel
O index.html e assets estão na raiz do ZIP. Extraia o arquivo antes de importar/enviar o projeto. Para publicar esta prévia estática, use o preset Other, sem comando de build e saída na raiz. A publicação da prévia não conclui as pendências acima. Para a versão Next.js, adapte a configuração ao projeto final e não conserve o preset estático.

Após as alterações, revise desktop e mobile, menu, âncoras, formulários, imagens e links. Devolva o ZIP atualizado com index.html na raiz se continuar estático, ou o projeto completo com package.json se migrar para Next.js.
