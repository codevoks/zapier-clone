# Demo script (~2–3 minutes)

Prepared so the recording can be done in one take. Claude did not record
this — it's a script to follow. Uses the zero-signup **HTTP action** against
[webhook.site](https://webhook.site) so nothing needs an API key.

## Preparation (before hitting record)

1. `cp .env.example .env` (already done if you've run this before).
2. `docker compose up -d` — Postgres + Kafka.
3. `pnpm install && pnpm --filter @repo/db exec prisma migrate deploy && pnpm --filter @repo/db run seed`
4. `pnpm dev` — starts web (`:3000`), hooks (`:4000`), outbox-processor, and
   the worker together.
5. Open [webhook.site](https://webhook.site) in a browser tab and copy its
   unique URL (e.g. `https://webhook.site/xxxxxxxx-...`). Keep this tab
   visible — it's how the async processing gets proven on screen.
6. Sign up / log in at `localhost:3000`, so you're not doing that on camera
   (optional — it's quick either way).
7. Optional: `docker compose --profile ui up -d` and open
   `localhost:8080` (Kafka UI) in another tab to show the topic live.

## Recording script

**0:00 – 0:20 — What this is**
> "This is an event-driven workflow platform — Zapier-style automation, but
> the point is the pipeline: a webhook write goes through a transactional
> outbox, gets published to Kafka, and is picked up by a worker
> asynchronously. I'll trigger it and show every step of that happening."

**0:20 – 0:45 — Create the zap**
- Dashboard → "New Zap".
- Trigger: **Web Hook**. Leave the secret blank (public webhook for the
  demo) — click through.
- Action: **HTTP Request**. Paste the webhook.site URL into `url`. Body:
  `{"message": "hello from the pipeline", "name": "{{payload.name}}"}`.
- Save.

**0:45 – 1:00 — Show the webhook URL**
- Back on the dashboard, point at the "Webhook URL" column for the new zap
  — that's the real `POST` target, `http://localhost:4000/hooks/catch/<userId>/<zapId>`.
- Copy it.

**1:00 – 1:30 — Trigger it and show the accept path**
```bash
curl -i -X POST http://localhost:4000/hooks/catch/<userId>/<zapId> \
  -H 'Content-Type: application/json' \
  -d '{"name": "Ada"}'
```
- Point out the `202 Accepted` and the returned `zapRunId` — the hooks
  service already returned before Kafka or the worker touched anything.

**1:30 – 2:00 — Show it flow through**
- (If running) flip to the Kafka UI tab — show the `zap-events` topic
  getting a new message within ~500ms (the outbox poll interval).
- Flip to the webhook.site tab — the POST request lands there within a
  second or two, body included, proving the worker actually executed the
  HTTP action end to end.

**2:00 – 2:30 — Execution history**
- Back in the dashboard, click **Runs** on the zap.
- Show the run: status `SUCCESS`, `startedAt`/`completedAt` populated, the
  single step marked `SUCCESS`.

**2:30 – 2:50 — A deliberate failure path**
- Edit the zap's HTTP action URL to something invalid (e.g. `not-a-url`) —
  show the validation error on save (Zod schema rejecting a malformed URL
  client-side).
- Alternatively: trigger the webhook for a `zapId` that doesn't exist —
  `curl` shows a clean `404 { "error": "Zap not found." }` instead of a
  stack trace.

**2:50 – 3:00 — Close**
> "That whole path — durable write, transactional outbox, Kafka, worker,
> action execution, recorded result — is at-least-once by design, and the
> worker is built to be safely re-run: redelivering the same event skips
> whatever already succeeded instead of double-executing it."

## Fallback demo path (if Kafka UI isn't running)

Skip the Kafka UI tab entirely — the webhook.site tab landing a request a
second or two after the `curl` is sufficient proof of asynchronous
processing on its own. You can also `docker compose logs -f outbox-processor
processor` in a terminal pane to show the structured JSON log lines
(`"msg":"Published outbox batch"`, `"msg":"zapRun succeeded"`) scrolling by
in near-real-time as an alternative to the UI.

## Notes for whoever records this

- Total runtime target: 2–3 minutes. The script above is paced for that;
  cut the failure-path section first if running long.
- `apps/hooks/vitest.setup.ts` and friends aren't part of the demo — this is
  a product/architecture walkthrough, not a test-suite tour. If asked "is
  this tested," mention `pnpm test` runs 60+ tests including real-Postgres
  concurrency tests for the outbox claim logic, and leave it there.
