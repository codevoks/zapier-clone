import bcrypt from 'bcrypt'

export async function hashPassword(
  password: string,
  saltRounds: number
): Promise<string> {
  const hash = await bcrypt.hash(password, saltRounds)
  return hash as string
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hash)
  return isMatch
}
