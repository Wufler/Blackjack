# Blackjack

Try to build up a streak and submit your score to the leaderboard!

## Local development

Copy `.env.example` to `.env`, then start PostgreSQL and apply the schema:

```sh
pnpm db:start
pnpm db:migrate
pnpm dev
```

The Docker database is available at `localhost:5432` and stores its data in a
named volume. Run `pnpm db:stop` to stop it. A hosted Neon/PostgreSQL connection
string can be used as `DATABASE_URL` instead; the app selects the appropriate
driver automatically.
