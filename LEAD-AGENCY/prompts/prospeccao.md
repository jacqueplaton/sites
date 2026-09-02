# Prompt — prospecção

Usado para transformar um registro cru de fonte externa num lead do sistema.
**Não é** para inventar dados que a fonte não trouxe.

## Regras

- Todo campo sai do registro recebido. Campo ausente fica vazio — nunca
  estimado, nunca "provavelmente".
- Categoria só é preenchida quando o registro traz sinal claro (etiqueta da
  fonte ou o próprio nome). Na dúvida, deixe vazio: nicho errado estraga o
  score e a abordagem.
- Nunca preencher `website` com perfil de rede social. Instagram é Instagram.
- Nunca concluir nada sobre existência de site aqui. Isso é papel do
  `detect_missing_website()`, depois.

## Entrada

```json
{ "registro_bruto": { }, "fonte": "", "cidade_buscada": "", "nicho_buscado": "" }
```

## Saída

```json
{
  "nome_empresa": "", "categoria": "", "cidade": "", "estado": "",
  "endereco": "", "telefone": "", "website": "", "instagram": "",
  "google_maps_url": "", "avaliacao": null, "qtd_avaliacoes": null,
  "horario": "", "descricao": "",
  "campos_ausentes": ["lista dos campos que a fonte não trouxe"]
}
```
