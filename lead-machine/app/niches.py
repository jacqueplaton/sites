"""Catálogo de nichos.

Cada nicho traz o que a equipe comercial precisa para abordar o lead:
potencial, ticket sugerido, argumentos, dores e CTA. É apenas configuração —
fica em data/config.json e pode ser editado na tela de Configurações.

`ticket_sugerido` é uma referência comercial em BRL definida pelo usuário,
não uma cotação de mercado.
"""

from __future__ import annotations

import unicodedata
from typing import Any

NICHOS_PADRAO: list[dict[str, Any]] = [
    {
        "chave": "dentista",
        "nome": "Dentista",
        "potencial": "alto",
        "ticket_sugerido": 3500,
        "argumentos": [
            "Paciente novo pesquisa no Google antes de marcar a primeira consulta",
            "Site com agendamento reduz o tempo gasto no WhatsApp da recepção",
            "Perfil no Google bem preenchido aparece no mapa das buscas próximas",
        ],
        "dores": [
            "Depende de indicação e não aparece na busca",
            "Agenda com horários ociosos",
            "Concorrência com clínicas de rede",
        ],
        "cta": "Posso te mostrar como sua clínica aparece hoje no Google?",
    },
    {
        "chave": "clinica",
        "nome": "Clínica",
        "potencial": "alto",
        "ticket_sugerido": 4000,
        "argumentos": [
            "Várias especialidades exigem páginas separadas para ranquear",
            "Agendamento online diminui falta de paciente",
        ],
        "dores": ["Site inexistente ou desatualizado", "Recepção sobrecarregada"],
        "cta": "Quer ver o que aparece quando alguém busca sua especialidade na cidade?",
    },
    {
        "chave": "advocacia",
        "nome": "Advocacia",
        "potencial": "alto",
        "ticket_sugerido": 5000,
        "argumentos": [
            "Cliente de área específica pesquisa por termo técnico no Google",
            "Site próprio transmite a credibilidade que o perfil social não dá",
        ],
        "dores": ["Depende só de indicação", "Concorrência com grandes bancas"],
        "cta": "Posso te mandar o levantamento de como sua banca aparece na busca?",
    },
    {
        "chave": "estetica",
        "nome": "Estética",
        "potencial": "alto",
        "ticket_sugerido": 3000,
        "argumentos": [
            "Antes e depois convertem melhor num site do que no feed",
            "Agendamento por WhatsApp automatizado reduz no-show",
        ],
        "dores": ["Sazonalidade da agenda", "Depende só do Instagram"],
        "cta": "Quer ver como transformar seu Instagram em agenda cheia?",
    },
    {
        "chave": "salao",
        "nome": "Salão de beleza",
        "potencial": "medio",
        "ticket_sugerido": 2000,
        "argumentos": [
            "Busca por 'salão perto de mim' é decidida no mapa do Google",
            "Agendamento online libera a recepção",
        ],
        "dores": ["Agenda por WhatsApp manual", "Horários vazios na semana"],
        "cta": "Posso te mostrar sua posição no mapa para as buscas do bairro?",
    },
    {
        "chave": "barbearia",
        "nome": "Barbearia",
        "potencial": "medio",
        "ticket_sugerido": 1800,
        "argumentos": [
            "Agendamento online evita fila e cliente perdido",
            "Perfil no Google com fotos aumenta visita ao estabelecimento",
        ],
        "dores": ["Depende de movimento de rua", "Sem controle de recorrência"],
        "cta": "Quer receber agendamentos sem parar de cortar cabelo para responder?",
    },
    {
        "chave": "academia",
        "nome": "Academia",
        "potencial": "alto",
        "ticket_sugerido": 3500,
        "argumentos": [
            "Matrícula começa numa busca por academia no bairro",
            "Campanha local traz lead com custo baixo em janeiro",
        ],
        "dores": ["Rotatividade de alunos", "Concorrência de rede low cost"],
        "cta": "Posso te mostrar quantas buscas por academia acontecem na sua região?",
    },
    {
        "chave": "personal",
        "nome": "Personal trainer",
        "potencial": "medio",
        "ticket_sugerido": 1500,
        "argumentos": [
            "Página própria separa o profissional do perfil pessoal",
            "Prova social organizada fecha aluno mais rápido",
        ],
        "dores": ["Depende de indicação", "Agenda irregular"],
        "cta": "Quer uma página que apresente seu trabalho para quem ainda não te conhece?",
    },
    {
        "chave": "oficina",
        "nome": "Oficina mecânica",
        "potencial": "medio",
        "ticket_sugerido": 2000,
        "argumentos": [
            "Busca por oficina é urgente e local — quem aparece primeiro atende",
            "Google Meu Negócio bem feito traz ligação direta",
        ],
        "dores": ["Movimento irregular", "Cliente não sabe que a oficina existe"],
        "cta": "Posso te mostrar como aparecer para quem procura oficina no seu bairro?",
    },
    {
        "chave": "auto_center",
        "nome": "Auto center",
        "potencial": "medio",
        "ticket_sugerido": 2500,
        "argumentos": [
            "Serviços com preço publicado atraem busca de comparação",
            "Ads local funciona bem para troca de óleo e pneu",
        ],
        "dores": ["Concorrência de rede", "Dependência de passagem"],
        "cta": "Quer aparecer nas buscas de troca de pneu da sua cidade?",
    },
    {
        "chave": "imobiliaria",
        "nome": "Imobiliária",
        "potencial": "alto",
        "ticket_sugerido": 6000,
        "argumentos": [
            "Site com carteira de imóveis é a vitrine do negócio",
            "Lead de imóvel tem valor alto e justifica investimento em Ads",
        ],
        "dores": ["Depende de portal de terceiros", "Paga caro por lead"],
        "cta": "Posso te mostrar quanto custa parar de depender de portal?",
    },
    {
        "chave": "restaurante",
        "nome": "Restaurante",
        "potencial": "medio",
        "ticket_sugerido": 2500,
        "argumentos": [
            "Cardápio online reduz ligação e erro de pedido",
            "Perfil no Google com fotos e horário certo traz visita",
        ],
        "dores": ["Comissão de aplicativo", "Cardápio desatualizado na internet"],
        "cta": "Quer um cardápio online próprio, sem comissão de aplicativo?",
    },
    {
        "chave": "contador",
        "nome": "Contador",
        "potencial": "alto",
        "ticket_sugerido": 4000,
        "argumentos": [
            "Abertura de empresa começa com busca no Google",
            "Contrato de contabilidade é recorrente — o lead se paga rápido",
        ],
        "dores": ["Crescimento só por indicação", "Concorrência com contabilidade online"],
        "cta": "Posso te mostrar as buscas por abertura de empresa na sua cidade?",
    },
    {
        "chave": "arquiteto",
        "nome": "Arquiteto",
        "potencial": "alto",
        "ticket_sugerido": 4500,
        "argumentos": [
            "Portfólio precisa de site próprio; feed não organiza projeto",
            "Cliente de projeto pesquisa antes de pedir orçamento",
        ],
        "dores": ["Portfólio espalhado", "Depende de indicação"],
        "cta": "Quer um portfólio que apresente seus projetos como eles merecem?",
    },
    {
        "chave": "fisioterapeuta",
        "nome": "Fisioterapeuta",
        "potencial": "medio",
        "ticket_sugerido": 2500,
        "argumentos": [
            "Paciente busca por especialidade e bairro",
            "Agendamento online preenche horários vagos",
        ],
        "dores": ["Depende de encaminhamento médico", "Agenda com buracos"],
        "cta": "Posso te mostrar como pacientes procuram fisioterapia na sua região?",
    },
    {
        "chave": "nutricionista",
        "nome": "Nutricionista",
        "potencial": "medio",
        "ticket_sugerido": 2200,
        "argumentos": [
            "Conteúdo próprio no site atrai paciente sem depender do algoritmo",
            "Agendamento e anamnese online economizam consulta",
        ],
        "dores": ["Depende do Instagram", "Paciente some depois da primeira consulta"],
        "cta": "Quer atrair paciente sem depender do alcance do Instagram?",
    },
]


def _slug(texto: str | None) -> str:
    if not texto:
        return ""
    normal = unicodedata.normalize("NFKD", texto)
    normal = "".join(c for c in normal if not unicodedata.combining(c))
    normal = normal.lower().strip()
    return "".join(c if c.isalnum() else "_" for c in normal).strip("_")


def buscar_nicho(categoria: str | None, nichos: list[dict[str, Any]]) -> dict[str, Any] | None:
    """Casa a categoria do lead com um nicho do catálogo.

    O casamento é por chave/nome normalizado, ou por a chave aparecer dentro
    do texto da categoria. Nada além disso: nicho não identificado é melhor
    que nicho errado.
    """
    alvo = _slug(categoria)
    if not alvo:
        return None
    for nicho in nichos:
        if alvo in {_slug(nicho.get("chave")), _slug(nicho.get("nome"))}:
            return nicho
    for nicho in nichos:
        chave = _slug(nicho.get("chave"))
        if chave and (chave in alvo or alvo in chave):
            return nicho
    return None
