import path from 'node:path'

try {
  process.loadEnvFile(path.resolve(import.meta.dirname, '../../.env'))
} catch {
  // no .env present - assume the environment already provides the vars.
}
