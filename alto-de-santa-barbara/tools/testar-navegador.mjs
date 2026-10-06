#!/usr/bin/env node
/*
  Testes de comportamento num navegador real (Chromium via Playwright).

  Uso, com o site servido localmente:
    python3 -m http.server 8765 --directory _site      (depois de bash build.sh)
    node tools/testar-navegador.mjs http://localhost:8765/

  Requer o pacote playwright. Se ele estiver instalado fora do projeto, indique
  o módulo:  PLAYWRIGHT_MODULE=/caminho/playwright/index.mjs node tools/...
*/
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.argv[2] || 'http://localhost:8765/';

let falhas = 0;
function confere(condicao, descricao, detalhe = '') {
  console.log(`${condicao ? 'ok  ' : 'FALHOU'} ${descricao}${!condicao && detalhe ? ` → ${detalhe}` : ''}`);
  if (!condicao) falhas += 1;
}

const mensagens = {
  geral: 'Olá! Conheci o Alto de Santa Bárbara pelo site e gostaria de consultar disponibilidade para uma hospedagem.',
  chale2: 'Olá! Conheci o Chalé 2 pelo site do Alto de Santa Bárbara e gostaria de consultar disponibilidade.'
};

const navegador = await chromium.launch();

// Captura a URL que o formulário tenta abrir, sem sair da página.
async function prepararCaptura(pagina) {
  await pagina.addInitScript(() => {
    window.__abertas = [];
    window.open = (url) => { window.__abertas.push(url); return null; };
  });
}
const ultimaAberta = (pagina) => pagina.evaluate(() => window.__abertas[window.__abertas.length - 1] || null);
const textoDe = (url) => decodeURIComponent(new URL(url).searchParams.get('text'));

/* ---- Celular: menu, galeria, formulário, botão flutuante ------------------ */
{
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true,
    timezoneId: 'America/Sao_Paulo', locale: 'pt-BR'
  });
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await prepararCaptura(p);
  // Relógio fixo às 23h30 de Brasília (já é dia seguinte em UTC).
  await p.clock.install({ time: new Date('2026-10-06T23:30:00-03:00') });
  await p.goto(base, { waitUntil: 'networkidle' });

  // Menu
  const botaoMenu = p.locator('.menu-abrir');
  confere(await botaoMenu.isVisible(), 'botão Menu visível no celular');
  await botaoMenu.click();
  confere(await p.locator('#menu').evaluate((d) => d.open), 'menu abre');
  confere(await p.locator('.whatsapp-flutuante').evaluate((a) => a.classList.contains('oculto')), 'flutuante some com menu aberto');
  await p.keyboard.press('Escape');
  confere(!(await p.locator('#menu').evaluate((d) => d.open)), 'Esc fecha o menu');
  confere(await p.evaluate(() => document.activeElement.classList.contains('menu-abrir')), 'foco volta ao botão Menu');
  await botaoMenu.click();
  await p.locator('#menu a[href="#localizacao"]').click();
  await p.waitForTimeout(800);
  const topoSecao = await p.locator('#localizacao').evaluate((s) => s.getBoundingClientRect().top);
  const alturaTopo = await p.locator('.topo').evaluate((h) => h.getBoundingClientRect().height);
  confere(!(await p.locator('#menu').evaluate((d) => d.open)) && topoSecao >= alturaTopo - 1 && topoSecao < alturaTopo + 40,
    'link do menu fecha e leva à seção sem ficar sob o cabeçalho', `topo da seção ${topoSecao}, cabeçalho ${alturaTopo}`);

  // Galeria
  await p.locator('.miniaturas a').first().scrollIntoViewIfNeeded();
  const miniatura = p.locator('.miniaturas a').first();
  await miniatura.click();
  confere(await p.locator('#galeria').evaluate((d) => d.open), 'galeria abre pela miniatura');
  confere((await p.locator('.galeria-contador').textContent()) === '2 de 5', 'galeria começa na foto clicada (2 de 5)');
  confere((await p.locator('.galeria-legenda').textContent()) === 'Quarto', 'legenda da foto');
  await p.keyboard.press('ArrowRight');
  confere((await p.locator('.galeria-contador').textContent()) === '3 de 5', 'seta direita avança');
  await p.locator('.galeria-anterior').click();
  confere((await p.locator('.galeria-contador').textContent()) === '2 de 5', 'botão anterior volta');
  await p.keyboard.press('Escape');
  confere(!(await p.locator('#galeria').evaluate((d) => d.open)), 'Esc fecha a galeria');
  confere(await miniatura.evaluate((a) => a === document.activeElement), 'foco volta à miniatura');

  // Formulário: limites de data no calendário local
  await p.locator('#consulta').scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  confere(await p.locator('.whatsapp-flutuante').evaluate((a) => a.classList.contains('oculto')), 'flutuante some sobre a consulta');
  confere(await p.locator('#formulario').isVisible(), 'formulário visível com JavaScript');
  confere((await p.locator('#entrada').getAttribute('min')) === '2026-10-06', 'data mínima é hoje no horário local (sem erro de UTC)',
    await p.locator('#entrada').getAttribute('min'));

  const enviar = p.locator('#formulario button[type="submit"]');

  await p.fill('#entrada', '2026-10-05');
  await p.fill('#saida', '2026-10-08');
  await enviar.click();
  confere(await p.locator('#entrada-erro').isVisible(), 'data passada é recusada', await p.locator('#entrada-erro').textContent());
  confere((await ultimaAberta(p)) === null, 'nada abre com erro');

  await p.fill('#entrada', '2026-10-20');
  await p.fill('#saida', '');
  await enviar.click();
  confere((await p.locator('#saida-erro').textContent()).includes('saída'), 'só entrada pede a saída');

  await p.fill('#saida', '2026-10-20');
  await enviar.click();
  confere((await p.locator('#saida-erro').textContent()).includes('depois'), 'saída igual à entrada é recusada');

  await p.fill('#saida', '2026-10-22');
  await p.selectOption('#hospedes', '2');
  await p.locator('.escolha label', { hasText: 'Chalé 2' }).click();
  await enviar.click();
  const url = await ultimaAberta(p);
  confere(url && url.startsWith('https://wa.me/5512992204141?text='), 'abre wa.me com o número certo', url);
  const esperado = `${mensagens.chale2}\n\nEntrada: 20/10/2026\nSaída: 22/10/2026 (2 noites)\nHóspedes: 2`;
  confere(url && textoDe(url) === esperado, 'mensagem do Chalé 2 com datas e hóspedes', url && textoDe(url));
  confere((await p.locator('.formulario-status').textContent()).includes('Se ele não abriu'), 'status oferece link alternativo');

  await p.fill('#entrada', '');
  await p.fill('#saida', '');
  await p.selectOption('#hospedes', '');
  await p.locator('.escolha label', { hasText: 'Ainda não decidi' }).click();
  await enviar.click();
  confere(textoDe(await ultimaAberta(p)) === mensagens.geral, 'sem datas: mensagem genérica, sem linhas extras');

  confere(erros.length === 0, 'sem erros de JavaScript', erros.join(' | '));
  const largura = await p.evaluate(() => document.documentElement.scrollWidth);
  confere(largura <= 390, 'sem rolagem lateral no celular', String(largura));
  await ctx.close();
}

/* ---- Desktop: teclado e âncoras ----------------------------------------- */
{
  const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  await p.keyboard.press('Tab');
  confere(await p.evaluate(() => document.activeElement.classList.contains('pular')), 'primeiro Tab foca "Pular para o conteúdo"');
  confere(!(await p.locator('.menu-abrir').isVisible()), 'menu móvel escondido no desktop');
  await p.locator('.nav a[href="#chales"]').click();
  await p.waitForTimeout(900);
  const topo = await p.locator('#chales').evaluate((s) => s.getBoundingClientRect().top);
  confere(topo >= 75 && topo < 120, 'âncora desconta o cabeçalho fixo', String(topo));
  confere(await p.evaluate(() => document.documentElement.classList.contains('anima')), 'revelação ativa quando o movimento é permitido');
  await ctx.close();
}

/* ---- Movimento reduzido ------------------------------------------------- */
{
  const ctx = await navegador.newContext({ viewport: { width: 1024, height: 800 }, reducedMotion: 'reduce' });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  confere(!(await p.evaluate(() => document.documentElement.classList.contains('anima'))), 'movimento reduzido desliga a revelação');
  await ctx.close();
}

/* ---- Sem JavaScript ----------------------------------------------------- */
{
  const ctx = await navegador.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(base, { waitUntil: 'networkidle' });
  confere(!(await p.locator('#formulario').isVisible()), 'sem JS o formulário (que não funcionaria) fica oculto');
  confere(await p.locator('.consulta-direto a[href^="https://wa.me/"]').isVisible(), 'sem JS o link direto de WhatsApp continua');
  const opacidade = await p.locator('#titulo-mirante').evaluate((h) => getComputedStyle(h).opacity);
  confere(opacidade === '1', 'sem JS nenhum conteúdo fica invisível');
  confere((await p.locator('.miniaturas a').first().getAttribute('href')).startsWith('img/'), 'sem JS as fotos abrem como arquivo');
  await ctx.close();
}

await navegador.close();
console.log(falhas ? `\n${falhas} verificação(ões) falharam.` : '\nTodas as verificações passaram.');
process.exit(falhas ? 1 : 0);
