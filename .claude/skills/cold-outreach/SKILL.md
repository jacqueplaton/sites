---
name: cold-outreach
description: B2B sales and cold outreach playbooks (from Sellbird, formerly Harvey). Use when the user asks to write or review a cold email or email sequence, a LinkedIn connection or DM message, a reply to a prospect or an objection, a follow-up or breakup email, an offer or closing ask, or wants help qualifying leads, finding prospects, picking buying signals or deciding who to contact at a company. Also for "copy de prospecção", "e-mail frio", "abordagem no LinkedIn", "quebra de objeção".
license: AGPL-3.0-only. Content from Sellbird by Ethan Rogers and contributors; see LICENSE and NOTICE.
---

# Cold Outreach Playbooks

Sales knowledge taken from the open-source Sellbird project (formerly Harvey). It is a set of
playbooks, not a tool: read the reference files that fit the task, then write.

## Pick the reference file

Load only what the task needs. Most tasks need one to three files.

| Task | Read |
|---|---|
| Write or review a cold email, sequence or subject line | `reference/email_frameworks.md` (always), plus `reference/signal_playbook.md` for the opening line |
| Open with a buying signal (hiring, funding, tech stack, ads, no online booking) | `reference/signal_playbook.md` |
| Answer a prospect's reply or an objection | `reference/objection_handling.md`, `reference/sales_methodology.md` |
| Decide what to offer or how to ask for the meeting / close | `reference/offer_strategy.md` |
| Score or qualify leads, define an ICP, disqualify | `reference/lead_qualification.md` |
| Find prospects without paid data tools | `reference/prospecting_tactics.md` |
| Several contacts at one company, who to write first | `reference/account_navigation.md` |
| LinkedIn connection requests and messages | `reference/linkedin_outreach.md` |
| Prospect is a startup (YC, accelerator, recent raise) | `reference/selling_to_startups.md` |
| Tone and conversation flow in general | `reference/sales_methodology.md` |

## Non-negotiables

These come from the playbooks and override any style preference:

- Truthful subject lines: no fake "re:" or "fwd:", no implied prior relationship.
- Real identity: the sender name, company and signature are the user's own. Never pose as a customer, a consumer or a mutual contact.
- Any opt-out wording ("stop", "remove me", "não quero mais") is an unsubscribe. Honour it, never argue it.
- Every campaign needs a working unsubscribe and the sender's physical address in the footer.
- EU/UK (and Brazil under LGPD): only write when the pitch is clearly relevant to the person's professional role, and make objecting easy.
- Plain text, at most one link (none in the first email is better), no attachments, no spam-trigger phrasing.
- Personalisation must come from something real and checkable. Never invent a fact about the prospect.

## Adapting to the user

- Ask for, or infer from context, what the user sells, to whom, and the one outcome they promise. Without that, ask before writing a sequence.
- If the user writes in Portuguese or the prospects are Brazilian, write the copy in natural Brazilian Portuguese. Keep the same rules: short, specific, no AI tells (the dash ban in `email_frameworks.md` applies to "—" in Portuguese too).
- Some files mention Sellbird internals (signal codes such as `YC_BACKED`, the agents, Instantly as a sender). Treat those as examples; the advice holds without the app.
- After drafting, re-read the copy against the "Banned Patterns" list in `email_frameworks.md` and fix anything it catches before showing it.
