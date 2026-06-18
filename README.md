# Querious — learn SQL by doing

A self-contained, adaptive SQL trainer with a live database. Every query you
write actually runs against a real SQLite engine (WebAssembly) in your browser —
real results, real error messages, no server.

## How to open it

**Double-click `index.html`.** First launch needs internet for a few seconds
(to fetch the SQLite engine); after that everything runs locally.

## What's inside

- **400 practice questions** across **27 skills**, in two stages:
  - **Stage 1 — foundations (14 skills, 200 Qs):** SELECT → picking columns →
    WHERE → AND/OR → sorting → LIMIT → DISTINCT → aggregates → GROUP BY → HAVING
    → INNER/LEFT/FULL JOIN → JOIN+GROUP BY.
  - **Stage 2 — advanced, dbt-style (13 skills, 200 Qs):** CASE → NULL handling
    (COALESCE) → subqueries → **CTEs (WITH)** → conditional aggregation / pivots
    → window functions → ranking → LAG/LEAD → the **dedup pattern** → set ops →
    dates (strftime) → NTILE & frames → a multi-CTE **"build a dbt model"**
    capstone. Mastery-gated behind Stage 1; all of it runs live (the dbt-model
    walkthrough notes where real dbt would add Jinja / `ref()`).
- **A learner model that picks your next question.** Each skill has a mastery
  score (0–100%) updated by how you solve: first-try clean wins push it up
  fast; hints, errors and reveals slow it down. Auto practice serves your
  weakest unlocked skill at a difficulty just above your level, introduces new
  skills only when their prerequisites are solid, and mixes in variety.
- **Auto-advance** — solve a question and the next one loads ~2 seconds later
  (press *Now ▸* to jump, *✕ stay* or just keep typing to cancel).
- **Skills sidebar** — mastery bar + solved count per skill. Click a skill to
  drill it specifically; click *Auto practice* to hand control back. Locked
  skills tell you which prerequisite to finish first.
- **Step-by-step walkthroughs** — the first time a skill appears you get
  teach-mode: an example query built word by word and run live, before any
  question. Skippable, replayable (📖 button).
- **Live column AND row highlighting** — columns you reference glow green
  (including `SELECT *` = all of them); join keys glow cyan with a 🔑; and the
  **rows your query keeps light up while the dropped ones fade** — works for
  WHERE filters, ORDER BY+LIMIT top-N, and joins (quiet customers and orphan
  orders visibly fall away).
- **JOIN explorer** — Venn diagram of INNER/LEFT/RIGHT/FULL on join questions.
- **Plain-English error help** — when a query fails (or is just wrong), the
  banner explains *what you actually did* — clause order (SELECT before FROM),
  unquoted text values, unknown table/column names, GROUP/ORDER missing "BY",
  etc. — not just the raw parser message.
- **Progressive hints** (one clue at a time → full answer), a **Skip** button
  (no penalty), and a **Sandbox** for free play.
- The query editor sits **above** the reference tables, so the task and your
  typing box are always the first things on screen.

Progress saves in your browser (localStorage). **Reset** (top-right) starts over.

## The data

Two tables, deliberately shaped so joins matter:

- `customers` (12 rows: id, name, city, age) — 5 cities; **Margaret, Tim and
  Barbara have no orders**.
- `orders` (24 rows: id, customer_id, product, amount, **order_date, status**) —
  10 products; **two orphan orders** (#107 Headphones, #121 Desk Lamp) have
  `customer_id = NULL`. Dates span Jan–Jun 2024 (all distinct, for time-series
  and dedup); `status` is mostly `completed` with some `returned` and a few
  `NULL` (for the COALESCE lessons).

So: INNER JOIN → 22 rows, LEFT JOIN → 25 (quiet customers appear), FULL JOIN →
27 (orphans too). All amounts, ages, names and dates are unique, so sorting and
"latest record" questions always have one right answer.
