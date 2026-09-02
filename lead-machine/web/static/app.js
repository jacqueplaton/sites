/* ==========================================================================
   LEAD MACHINE — JavaScript da interface.
   Um módulo só, sem dependência externa. Cada página tem sua função de
   inicialização, escolhida pelo atributo data-pagina do <body>.
   ========================================================================== */

const $ = (sel, raiz = document) => raiz.querySelector(sel);
const $$ = (sel, raiz = document) => [...raiz.querySelectorAll(sel)];

const ROTULOS_STATUS = [
  'NOVO', 'QUALIFICADO', 'ABORDADO', 'RESPONDEU', 'INTERESSADO', 'REUNIAO',
  'PROPOSTA', 'NEGOCIACAO', 'FECHADO', 'PERDIDO', 'NAO_INTERESSADO',
];

const SITUACAO_SITE = {
  SEM_SITE: ['ausente', 'sem site'],
  TEM_SITE: ['ok', 'com site'],
  SITE_NAO_CONFIRMADO: ['indefinido', 'não confirmado'],
};

// -- utilidades -------------------------------------------------------------

function avisar(mensagem, erro = false) {
  const caixa = $('#aviso');
  caixa.textContent = mensagem;
  caixa.classList.toggle('erro', erro);
  caixa.hidden = false;
  clearTimeout(avisar._t);
  avisar._t = setTimeout(() => { caixa.hidden = true; }, 5200);
}

async function api(caminho, opcoes = {}) {
  const resposta = await fetch(caminho, {
    headers: opcoes.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  if (resposta.status === 204) return null;
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;
  if (!resposta.ok) {
    const erro = new Error(mensagemDeErro(dados));
    erro.dados = dados;
    erro.status = resposta.status;
    throw erro;
  }
  return dados;
}

function mensagemDeErro(dados) {
  const d = dados?.detail;
  if (!d) return 'Erro inesperado.';
  if (typeof d === 'string') return d;
  if (d.mensagem) {
    const dup = d.duplicata;
    return dup ? `${d.mensagem} Já existe o lead #${dup.lead_id} (${dup.nome_empresa}) — ${dup.motivo}.` : d.mensagem;
  }
  if (Array.isArray(d)) return d.map((e) => `${e.loc?.slice(-1)}: ${e.msg}`).join('; ');
  return JSON.stringify(d);
}

const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g,
  (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const textoOuTraco = (valor) => (valor === null || valor === undefined || valor === '' ? '—' : valor);
const moeda = (valor) => (valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function paramsDoFormulario(formulario) {
  const params = new URLSearchParams();
  new FormData(formulario).forEach((valor, chave) => {
    const texto = String(valor).trim();
    if (texto) params.append(chave, texto);
  });
  return params;
}

function etiquetaFaixa(faixa) {
  return `<span class="etiqueta ${escapar(faixa)}">${escapar(faixa)}</span>`;
}

function pastilhaSite(lead) {
  const [classe, rotulo] = SITUACAO_SITE[lead.site_situacao] || ['indefinido', lead.site_situacao];
  return `<span class="pastilha ${classe}" title="${escapar(lead.website_evidencia || '')}">${rotulo}</span>`;
}

// -- Dashboard --------------------------------------------------------------

async function iniciarDashboard() {
  async function carregar() {
    const dados = await api('/api/dashboard');
    const cartoes = [
      ['Total de leads', dados.total_leads, ''],
      ['Sem site', dados.sem_site, 'ausência verificada'],
      ['HOT', dados.hot, 'score 80-100'],
      ['Abordados', dados.abordados, ''],
      ['Respostas', dados.respostas, `taxa ${dados.taxa_resposta}%`],
      ['Interessados', dados.interessados, ''],
      ['Propostas', dados.propostas, ''],
      ['Vendas', dados.vendas, `conversão ${dados.taxa_conversao}%`],
      ['Valor vendido', moeda(dados.valor_vendido), ''],
      ['Ticket médio', moeda(dados.ticket_medio), ''],
    ];
    $('#cartoes').innerHTML = cartoes.map(([rotulo, valor, nota]) => `
      <div class="cartao">
        <div class="rotulo">${rotulo}</div>
        <div class="valor">${escapar(valor)}</div>
        <div class="nota">${escapar(nota)}</div>
      </div>`).join('');

    $('#funil').innerHTML = ROTULOS_STATUS.map((status) => `
      <a class="etapa" href="/leads?status=${status}" style="text-decoration:none;color:inherit">
        <b>${dados.por_status[status] ?? 0}</b>
        <span>${status.replace('_', ' ')}</span>
      </a>`).join('');

    const tabela = (linhas, titulo) => (linhas.length ? `
      <table class="tabela">
        <thead><tr><th>${titulo}</th><th class="num">Leads</th><th class="num">Abordados</th>
        <th class="num">Vendas</th><th class="num">Conversão</th><th class="num">Valor</th></tr></thead>
        <tbody>${linhas.map((l) => `<tr>
          <td>${escapar(l.chave)}</td><td class="num">${l.leads}</td>
          <td class="num">${l.abordados}</td><td class="num">${l.vendas}</td>
          <td class="num">${l.conversao}%</td><td class="num">${moeda(l.valor)}</td></tr>`).join('')}
        </tbody></table>` : '<p class="vazio">Sem dados ainda.</p>');

    $('#por-nicho').innerHTML = tabela(dados.por_nicho, 'Nicho');
    $('#por-cidade').innerHTML = tabela(dados.por_cidade, 'Cidade');
    $('#por-abordagem').innerHTML = tabela(dados.por_abordagem, 'Abordagem');
  }

  $('[data-acao="carregar-seeds"]').addEventListener('click', async (evento) => {
    evento.target.disabled = true;
    try {
      const r = await api('/api/seeds', { method: 'POST' });
      avisar(r.ja_havia_dados ? 'A base já tem leads — nada foi inserido.'
        : `${r.criados} leads fictícios criados.`);
      await carregar();
    } catch (erro) {
      avisar(erro.message, true);
    } finally {
      evento.target.disabled = false;
    }
  });

  await carregar();
}

// -- Leads ------------------------------------------------------------------

async function iniciarLeads() {
  const formulario = $('#filtros');
  let pagina = 1;

  const seletorStatus = $('#filtro-status');
  seletorStatus.innerHTML += ROTULOS_STATUS
    .map((s) => `<option value="${s}">${s.replace('_', ' ')}</option>`).join('');

  api('/api/opcoes').then((opcoes) => {
    $('#lista-cidades').innerHTML = opcoes.cidades.map((c) => `<option value="${escapar(c)}">`).join('');
    $('#lista-categorias').innerHTML = opcoes.categorias.map((c) => `<option value="${escapar(c)}">`).join('');
  });

  // filtros vindos da URL (ex.: link do funil do dashboard)
  new URLSearchParams(location.search).forEach((valor, chave) => {
    const campo = formulario.elements[chave];
    if (!campo) return;
    if (campo.type === 'checkbox') campo.checked = valor === 'true';
    else campo.value = valor;
  });

  function filtrosAtuais() {
    const params = paramsDoFormulario(formulario);
    params.set('pagina', pagina);
    params.set('por_pagina', '25');
    return params;
  }

  async function carregar() {
    const dados = await api(`/api/leads?${filtrosAtuais()}`);
    $('#resumo-lista').textContent =
      `${dados.total} lead(s) encontrado(s) — página ${dados.pagina} de ${dados.paginas}.`;

    if (!dados.itens.length) {
      $('#tabela-leads').innerHTML = '<tbody><tr><td class="vazio">Nenhum lead com esses filtros.</td></tr></tbody>';
    } else {
      $('#tabela-leads').innerHTML = `
        <thead><tr>
          <th>Score</th><th>Empresa</th><th>Nicho</th><th>Cidade</th>
          <th>Site</th><th>Telefone</th><th>Instagram</th>
          <th class="num">Nota</th><th class="num">Aval.</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>${dados.itens.map((lead) => `
          <tr>
            <td><b>${lead.score}</b> ${etiquetaFaixa(lead.faixa)}</td>
            <td><a href="/auditoria/${lead.id}">${escapar(lead.nome_empresa)}</a></td>
            <td>${escapar(textoOuTraco(lead.categoria))}</td>
            <td>${escapar(textoOuTraco(lead.cidade))}${lead.estado ? '/' + escapar(lead.estado) : ''}</td>
            <td>${pastilhaSite(lead)}</td>
            <td>${escapar(textoOuTraco(lead.telefone))}</td>
            <td>${escapar(textoOuTraco(lead.instagram))}</td>
            <td class="num">${textoOuTraco(lead.avaliacao)}</td>
            <td class="num">${textoOuTraco(lead.qtd_avaliacoes)}</td>
            <td>
              <select data-status-de="${lead.id}">
                ${ROTULOS_STATUS.map((s) => `<option value="${s}" ${s === lead.status ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
              </select>
            </td>
            <td><a class="btn btn-secundario btn-mini" href="/auditoria/${lead.id}">Auditoria</a></td>
          </tr>`).join('')}
        </tbody>`;
    }

    $('#paginacao').innerHTML = `
      <button class="btn btn-secundario btn-mini" ${dados.pagina <= 1 ? 'disabled' : ''} data-pagina="${dados.pagina - 1}">Anterior</button>
      <span>${dados.pagina} / ${dados.paginas}</span>
      <button class="btn btn-secundario btn-mini" ${dados.pagina >= dados.paginas ? 'disabled' : ''} data-pagina="${dados.pagina + 1}">Próxima</button>`;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    pagina = 1;
    carregar().catch((erro) => avisar(erro.message, true));
  });
  formulario.addEventListener('reset', () => {
    setTimeout(() => { pagina = 1; carregar(); }, 0);
  });

  $('#paginacao').addEventListener('click', (evento) => {
    const destino = evento.target.dataset.pagina;
    if (!destino) return;
    pagina = Number(destino);
    carregar().catch((erro) => avisar(erro.message, true));
  });

  $('#tabela-leads').addEventListener('change', async (evento) => {
    const id = evento.target.dataset.statusDe;
    if (!id) return;
    try {
      await api(`/api/leads/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: evento.target.value }),
      });
      avisar(`Lead #${id} agora está em ${evento.target.value.replace('_', ' ')}.`);
    } catch (erro) {
      avisar(erro.message, true);
    }
  });

  // --- exportação
  const exportar = (formato) => {
    const params = paramsDoFormulario(formulario);
    location.href = `/api/export/${formato}?${params}`;
  };
  $('[data-acao="exportar-csv"]').addEventListener('click', () => exportar('csv'));
  $('[data-acao="exportar-xlsx"]').addEventListener('click', () => exportar('xlsx'));

  // --- novo lead
  const dialogo = $('#dialogo-lead');
  $('[data-acao="novo-lead"]').addEventListener('click', () => {
    $('#form-lead').reset();
    $('#erro-form').hidden = true;
    dialogo.showModal();
  });

  $('#form-lead').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const corpo = {};
    new FormData(evento.target).forEach((valor, chave) => {
      const texto = String(valor).trim();
      if (texto) corpo[chave] = ['avaliacao', 'qtd_avaliacoes'].includes(chave) ? Number(texto) : texto;
    });
    try {
      const lead = await api('/api/leads', { method: 'POST', body: JSON.stringify(corpo) });
      dialogo.close();
      avisar(`Lead #${lead.id} criado com score ${lead.score} (${lead.faixa}).`);
      await carregar();
    } catch (erro) {
      const caixa = $('#erro-form');
      caixa.textContent = erro.message;
      caixa.hidden = false;
    }
  });

  // --- import CSV
  const dialogoImport = $('#dialogo-import');
  $('[data-acao="abrir-import"]').addEventListener('click', () => {
    $('#relatorio-import').innerHTML = '';
    dialogoImport.showModal();
  });

  $('#form-import').addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const arquivo = evento.target.elements.arquivo.files[0];
    if (!arquivo) return;
    const corpo = new FormData();
    corpo.append('arquivo', arquivo);
    try {
      const r = await api('/api/import/csv', { method: 'POST', body: corpo });
      $('#relatorio-import').innerHTML = `
        <p><b>${r.importados}</b> importados · <b>${r.duplicados}</b> duplicados bloqueados ·
           <b>${r.erros}</b> com erro (de ${r.total_linhas} linhas).</p>
        ${r.detalhes_duplicados.length ? `<details open><summary>Duplicados</summary><ul>${
          r.detalhes_duplicados.map((d) => `<li>linha ${d.linha}: ${escapar(d.nome_empresa)} — ${escapar(d.motivo)} (lead #${d.lead_existente})</li>`).join('')
        }</ul></details>` : ''}
        ${r.detalhes_erros.length ? `<details><summary>Erros</summary><ul>${
          r.detalhes_erros.map((d) => `<li>linha ${d.linha}: ${escapar(d.erro)}</li>`).join('')
        }</ul></details>` : ''}`;
      await carregar();
    } catch (erro) {
      avisar(erro.message, true);
    }
  });

  $$('[data-acao="fechar-dialogo"]').forEach((botao) => {
    botao.addEventListener('click', () => botao.closest('dialog').close());
  });

  await carregar();
}

// -- Auditoria --------------------------------------------------------------

async function iniciarAuditoria() {
  const idInicial = document.body.dataset.leadId;

  async function abrir(id) {
    const [lead, auditoria] = await Promise.all([
      api(`/api/leads/${id}`),
      api(`/api/leads/${id}/auditoria`),
    ]);
    history.replaceState({}, '', `/auditoria/${id}`);
    $('#form-auditoria').elements.lead_id.value = id;

    const botao = $('[data-acao="verificar-site"]');
    botao.hidden = false;
    botao.onclick = async () => {
      botao.disabled = true;
      try {
        const atualizado = await api(`/api/leads/${id}/verificar-site`, { method: 'POST' });
        avisar(`Site: ${atualizado.site_situacao} (${atualizado.website_status}).`);
        await abrir(id);
      } catch (erro) {
        avisar(erro.message, true);
      } finally {
        botao.disabled = false;
      }
    };

    const dado = (rotulo, valor) => `<div><div class="rotulo">${rotulo}</div><div>${escapar(textoOuTraco(valor))}</div></div>`;

    $('#auditoria').innerHTML = `
      <section class="painel">
        <div class="audit-cabecalho">
          <div class="audit-score">${lead.score}</div>
          <div>
            <h2 style="margin:0;font-size:19px;text-transform:none;color:var(--texto)">${escapar(lead.nome_empresa)}</h2>
            <div>${etiquetaFaixa(lead.faixa)} <span class="pastilha">${escapar(lead.status.replace('_', ' '))}</span> ${pastilhaSite(lead)}</div>
          </div>
        </div>
        <div class="grade-form" style="margin-top:16px">
          ${dado('Nicho', lead.categoria)}${dado('Subcategoria', lead.subcategoria)}
          ${dado('Cidade', [lead.cidade, lead.estado].filter(Boolean).join('/'))}
          ${dado('Endereço', lead.endereco)}${dado('Telefone', lead.telefone)}
          ${dado('Nota', lead.avaliacao)}${dado('Avaliações', lead.qtd_avaliacoes)}
          ${dado('Horário', lead.horario)}${dado('Fonte', lead.fonte)}
          ${dado('Coletado em', new Date(lead.data_coleta).toLocaleDateString('pt-BR'))}
        </div>
      </section>

      <div class="colunas-2">
        <section class="painel">
          <h2>Presença digital</h2>
          <table class="tabela tabela-fluida">
            <tbody>${auditoria.presenca_digital.map((p) => `<tr>
              <td><b>${escapar(p.canal)}</b></td>
              <td>${escapar(p.valor)}<br><small>${escapar(p.detalhe)}</small></td>
              <td><span class="pastilha ${p.situacao}">${p.situacao}</span></td>
            </tr>`).join('')}</tbody>
          </table>
        </section>

        <section class="painel">
          <h2>Como o score foi calculado</h2>
          ${auditoria.score_detalhe.map((r) => `
            <div class="regra ${r.aplicado ? '' : 'inativa'}">
              <span>${escapar(r.descricao)}<br><small>${escapar(r.motivo)}</small></span>
              <span class="peso">${r.aplicado ? (r.peso > 0 ? '+' : '') + r.peso : '—'}</span>
            </div>`).join('')}
        </section>
      </div>

      <div class="colunas-2">
        <section class="painel">
          <h2>Por que esse lead é interessante</h2>
          <ul class="lista-evidencia">${auditoria.por_que_interessante.map((l) => `<li>${escapar(l)}</li>`).join('')}</ul>
          ${auditoria.ressalvas.length ? `<h2 style="margin-top:16px">Ressalvas</h2>
            <ul class="lista-evidencia">${auditoria.ressalvas.map((l) => `<li>${escapar(l)}</li>`).join('')}</ul>` : ''}
        </section>

        <section class="painel">
          <h2>O que vender</h2>
          ${auditoria.oportunidades.map((o) => `
            <div class="oportunidade">
              <b>${escapar(o.servico)}</b>
              <span>${escapar(o.motivo)}</span>
              ${o.evidencia ? `<br><small>evidência: ${escapar(o.evidencia)}</small>` : ''}
            </div>`).join('')}
          ${auditoria.nicho ? `
            <p class="ajuda"><b>Ticket de referência:</b> ${moeda(auditoria.ticket_sugerido)} ·
            <b>CTA:</b> ${escapar(auditoria.cta)}</p>
            <details><summary>Argumentos e dores do nicho</summary>
              <ul class="lista-evidencia">${auditoria.argumentos.map((a) => `<li>${escapar(a)}</li>`).join('')}</ul>
              <ul class="lista-evidencia">${auditoria.dores.map((d) => `<li>${escapar(d)}</li>`).join('')}</ul>
            </details>` : '<p class="ajuda">Nicho não identificado a partir da categoria informada.</p>'}
        </section>
      </div>

      <section class="painel">
        <h2>Mensagem de abordagem</h2>
        <p class="ajuda">
          A geração de rascunhos (curta, consultiva e direta) entra na Fase 3 e
          exige chave de IA configurada no <code>.env</code>.
          Status atual: <b>${auditoria.analise_ia.disponivel ? 'disponível' : 'indisponível'}</b> —
          ${escapar(auditoria.analise_ia.motivo)}
        </p>
      </section>`;
  }

  $('#form-auditoria').addEventListener('submit', (evento) => {
    evento.preventDefault();
    const id = evento.target.elements.lead_id.value;
    if (id) abrir(id).catch((erro) => avisar(erro.message, true));
  });

  if (idInicial) await abrir(idInicial);
  else $('#auditoria').innerHTML = '<p class="vazio">Informe o ID de um lead, ou abra a auditoria pela lista de Leads.</p>';
}

// -- CRM --------------------------------------------------------------------

async function iniciarCrm() {
  async function carregar() {
    const dados = await api('/api/leads?por_pagina=500&ordenar=-score');
    const porStatus = Object.fromEntries(ROTULOS_STATUS.map((s) => [s, []]));
    dados.itens.forEach((lead) => (porStatus[lead.status] ||= []).push(lead));

    $('#kanban').innerHTML = ROTULOS_STATUS.map((status) => `
      <div class="coluna">
        <h3>${status.replace('_', ' ')} <span>${porStatus[status].length}</span></h3>
        ${porStatus[status].map((lead) => `
          <div class="cartao-lead">
            <b><a href="/auditoria/${lead.id}">${escapar(lead.nome_empresa)}</a></b>
            <div>${etiquetaFaixa(lead.faixa)} score ${lead.score}</div>
            <div><small>${escapar(textoOuTraco(lead.cidade))} · ${escapar(textoOuTraco(lead.categoria))}</small></div>
            <select data-status-de="${lead.id}">
              ${ROTULOS_STATUS.map((s) => `<option value="${s}" ${s === lead.status ? 'selected' : ''}>${s.replace('_', ' ')}</option>`).join('')}
            </select>
          </div>`).join('') || '<p class="ajuda">vazio</p>'}
      </div>`).join('');
  }

  $('#kanban').addEventListener('change', async (evento) => {
    const id = evento.target.dataset.statusDe;
    if (!id) return;
    try {
      await api(`/api/leads/${id}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: evento.target.value }),
      });
      await carregar();
      avisar(`Lead #${id} movido para ${evento.target.value.replace('_', ' ')}.`);
    } catch (erro) {
      avisar(erro.message, true);
    }
  });

  await carregar();
}

// -- Configurações ----------------------------------------------------------

async function iniciarConfiguracoes() {
  let config = await api('/api/config');

  function desenhar() {
    $('#pesos').innerHTML = Object.entries(config.pesos).map(([chave, valor]) => `
      <label>${chave.replaceAll('_', ' ')}
        <input type="number" data-peso="${chave}" value="${valor}" step="1">
      </label>`).join('');

    $('#limiares').innerHTML = Object.entries(config.limiares).map(([chave, valor]) => `
      <label>${chave.replaceAll('_', ' ')}
        <input type="number" data-limiar="${chave}" value="${valor}" step="0.1">
      </label>`).join('');

    $('#faixas').innerHTML = config.faixas.map((faixa, i) => `
      <label>${escapar(faixa.nome)} — mínimo
        <input type="number" data-faixa="${i}" data-campo="min" value="${faixa.min}">
      </label>
      <label>${escapar(faixa.nome)} — máximo
        <input type="number" data-faixa="${i}" data-campo="max" value="${faixa.max}">
      </label>`).join('');

    $('#nichos').innerHTML = config.nichos.map((n, i) => `
      <details class="painel" style="box-shadow:none">
        <summary><b>${escapar(n.nome)}</b> — potencial ${escapar(n.potencial)}</summary>
        <div class="grade-form" style="margin-top:12px">
          <label>Chave<input data-nicho="${i}" data-campo="chave" value="${escapar(n.chave)}"></label>
          <label>Nome<input data-nicho="${i}" data-campo="nome" value="${escapar(n.nome)}"></label>
          <label>Potencial
            <select data-nicho="${i}" data-campo="potencial">
              ${['alto', 'medio', 'baixo'].map((p) => `<option ${p === n.potencial ? 'selected' : ''}>${p}</option>`).join('')}
            </select>
          </label>
          <label>Ticket sugerido (R$)<input type="number" data-nicho="${i}" data-campo="ticket_sugerido" value="${n.ticket_sugerido ?? 0}"></label>
          <label class="largo">Argumentos (um por linha)
            <textarea rows="3" data-nicho="${i}" data-campo="argumentos">${escapar((n.argumentos || []).join('\n'))}</textarea></label>
          <label class="largo">Dores (uma por linha)
            <textarea rows="3" data-nicho="${i}" data-campo="dores">${escapar((n.dores || []).join('\n'))}</textarea></label>
          <label class="largo">CTA<input data-nicho="${i}" data-campo="cta" value="${escapar(n.cta || '')}"></label>
        </div>
      </details>`).join('');

    $('#ambiente').innerHTML = `
      <span class="pastilha ${config.ia_disponivel ? 'ok' : 'indefinido'}">
        IA (Fase 3): ${config.ia_disponivel ? 'chave configurada' : 'sem chave'}
      </span>
      <span class="pastilha ${config.buscar_dominio_candidato ? 'ok' : 'indefinido'}">
        Busca por domínio candidato: ${config.buscar_dominio_candidato ? 'ligada' : 'desligada'}
      </span>`;
  }

  function coletar() {
    const pesos = {};
    $$('[data-peso]').forEach((campo) => { pesos[campo.dataset.peso] = Number(campo.value || 0); });
    const limiares = {};
    $$('[data-limiar]').forEach((campo) => { limiares[campo.dataset.limiar] = Number(campo.value || 0); });
    const faixas = config.faixas.map((faixa) => ({ ...faixa }));
    $$('[data-faixa]').forEach((campo) => {
      faixas[Number(campo.dataset.faixa)][campo.dataset.campo] = Number(campo.value || 0);
    });
    const nichos = config.nichos.map((nicho) => ({ ...nicho }));
    $$('[data-nicho]').forEach((campo) => {
      const nicho = nichos[Number(campo.dataset.nicho)];
      const chave = campo.dataset.campo;
      if (chave === 'argumentos' || chave === 'dores') {
        nicho[chave] = campo.value.split('\n').map((l) => l.trim()).filter(Boolean);
      } else if (chave === 'ticket_sugerido') {
        nicho[chave] = Number(campo.value || 0);
      } else {
        nicho[chave] = campo.value.trim();
      }
    });
    return { pesos, limiares, faixas, nichos };
  }

  $('[data-acao="salvar-config"]').addEventListener('click', async () => {
    try {
      const salvo = await api('/api/config', { method: 'PUT', body: JSON.stringify(coletar()) });
      config = { ...config, ...salvo };
      desenhar();
      avisar(`Configuração salva. ${salvo.leads_recalculados} leads recalculados.`);
    } catch (erro) {
      avisar(erro.message, true);
    }
  });

  $('[data-acao="restaurar-config"]').addEventListener('click', async () => {
    if (!confirm('Restaurar pesos, limiares, faixas e nichos padrão?')) return;
    const salvo = await api('/api/config/restaurar', { method: 'POST' });
    config = { ...config, ...salvo };
    desenhar();
    avisar(`Padrões restaurados. ${salvo.leads_recalculados} leads recalculados.`);
  });

  $('[data-acao="novo-nicho"]').addEventListener('click', () => {
    config = { ...config, ...coletar() };
    config.nichos.push({
      chave: 'novo_nicho', nome: 'Novo nicho', potencial: 'medio',
      ticket_sugerido: 2000, argumentos: [], dores: [], cta: '',
    });
    desenhar();
  });

  desenhar();
}

// -- roteamento -------------------------------------------------------------

const PAGINAS = {
  dashboard: iniciarDashboard,
  leads: iniciarLeads,
  auditoria: iniciarAuditoria,
  crm: iniciarCrm,
  configuracoes: iniciarConfiguracoes,
  buscar: async () => {},
};

const iniciar = PAGINAS[document.body.dataset.pagina];
if (iniciar) {
  iniciar().catch((erro) => {
    console.error(erro);
    avisar(erro.message || 'Falha ao carregar a página.', true);
  });
}
