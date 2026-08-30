import path from 'node:path'

// Loads the repo-root .env for local `pnpm test` runs. In CI, DATABASE_URL
// etc. are already set by the workflow/service containers, so a missing
// .env file here is fine.
try {
  process.loadEnvFile(path.resolve(import.meta.dirname, '../../.env'))
} catch {
  // no .env present - assume the environment already provides the vars.
}
