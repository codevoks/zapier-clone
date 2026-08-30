import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from './hash.service'

describe('hashPassword / verifyPassword', () => {
  it('hashes a password and verifies the original matches', async () => {
    const hash = await hashPassword('correct horse battery staple', 10)
    expect(hash).not.toBe('correct horse battery staple')
    await expect(verifyPassword('correct horse battery staple', hash)).resolves.toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('correct horse battery staple', 10)
    await expect(verifyPassword('wrong password', hash)).resolves.toBe(false)
  })
})
