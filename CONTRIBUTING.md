# Contributing to DataCat

Issues and pull requests are welcome. Discuss large changes first and keep changes
focused. By contributing, you license your contribution under Apache-2.0.

## Local environment

Use Node 22.15+, pnpm 10.11.0, PostgreSQL 14+, and optionally Go 1.26.11+ and Python 3.10+.
Follow [self-hosting](docs/SELF_HOSTING.md) to create a separate development database.
Never use production API keys, telemetry, or personally identifying data in tests.

```sh
pnpm install --frozen-lockfile
pnpm run typecheck:libs
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/web run typecheck
BASE_PATH=/ pnpm run build:selfhost
pnpm --filter @workspace/api-server test
pnpm --filter @workspace/web test
# with DataCat running on an empty database:
DATACAT_URL=http://localhost:3000 DATACAT_SETUP_TOKEN=<token> bash scripts/e2e.sh
```

Run API/UI dev scripts as described in the README. For the agent:
`bash agent/build.sh`; for cross-builds: `bash agent/release.sh`. SDK tests are
documented in their respective READMEs. Set explicit test credentials in your
environment; never commit `.env`, binaries, generated collector sources or secrets.

## Change checklist

- Include a clear problem statement and reproducible validation steps.
- Preserve organization isolation and existing OTLP/agent/API-key compatibility.
- Keep the app branded DataCat; third-party names belong in migration explanations.
- Add a versioned, non-destructive startup migration when changing DB schema, and
  update the shared Drizzle schema. Test both empty and existing databases.
- Update the configuration reference when adding environment variables.
- Test authentication/authorization failures, not just the happy path.
- Add unit tests in `artifacts/api-server/test/` for query, intake or redaction changes; CI must pass.
- Keep SDK/agent versions consistent with release tags; review dependency licenses.

Report vulnerabilities privately as described in [SECURITY.md](SECURITY.md), not in
public issues.
