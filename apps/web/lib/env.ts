function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is missing. Set it in your environment or .env file.`)
  }
  return value
}

export const JWT_SECRET = requireEnv('JWT_SECRET')
