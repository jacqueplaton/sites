# Prompt — auditoria do lead (Módulo 5)

Gera `auditoria.md` para um lead HOT. A auditoria é lida por quem vai abordar
o negócio: um erro aqui vira uma frase errada na primeira mensagem.

## Regra que manda em todas as outras

Separe **DADOS CONFIRMADOS** de **HIPÓTESES**, sempre, com esses dois títulos.

- **DADOS CONFIRMADOS**: só o que está no registro do lead ou no resultado da
  verificação de site. Cada linha cita a evidência.
- **HIPÓTESES**: leitura de mercado, marcada como tal, em frase que deixa claro
  que é suposição ("provavelmente", "é comum no nicho").
- Sem base para responder: escreva `não identificado`. Não preencha.
- Nunca afirmar ausência de site sem `website_status = NAO_ENCONTRADO`.
- Nada de diagnóstico, promessa de resultado ou informação médica.

## Entrada

O lead completo, o resultado do detector (situação, status, confiança,
evidência) e o detalhe do score (cada regra, se aplicou e por quê).

## Estrutura da saída

```markdown
# Auditoria — {nome_empresa}
{cidade}/{estado} · {categoria} · score {score} ({faixa}) · coletado em {data}

## DADOS CONFIRMADOS
- (uma linha por fato, com a evidência entre parênteses)

## HIPÓTESES
- (uma linha por suposição, marcada como suposição)

## As dez perguntas
1. Quem é a empresa?
2. O que ela vende?
3. Quem provavelmente é o cliente?      → HIPÓTESE
4. Qual problema digital foi identificado?
5. Existe site?                          → só o que o detector concluiu
6. Como está a presença no Google?
7. Como está a presença no Instagram?
8. Qual oportunidade comercial existe?
9. Que serviço devo oferecer?
10. Qual argumento deve ser usado?

## O que ainda não sabemos
- (o que precisa ser checado antes da abordagem)
```
