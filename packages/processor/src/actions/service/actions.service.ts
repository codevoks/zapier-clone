import { Resend } from 'resend'
import bs58 from 'bs58'
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  Keypair,
  Connection,
  PublicKey,
} from '@solana/web3.js'
import { createLogger } from '@repo/logger'

const logger = createLogger('processor:actions')

export async function sendEmail({
  toEmail,
  subject,
  bodyTemplate,
  idempotencyKey,
}: {
  toEmail: string
  subject: string
  bodyTemplate: string
  idempotencyKey: string
}) {
  try {
    const apiKey = process.env.RESEND_KEY
    const fromEmail = process.env.SEND_EMAIL
    if (apiKey === undefined || fromEmail === undefined) {
      logger.warn('RESEND_KEY or SEND_EMAIL not configured; skipping send', { toEmail })
      return
    }
    const resend = new Resend(apiKey)
    // idempotencyKey lets Resend de-duplicate a retried/redelivered send for
    // the same (zapRunId, stepOrder) instead of emailing the recipient twice.
    const { error } = await resend.emails.send(
      { from: fromEmail, to: [toEmail], subject, text: bodyTemplate },
      { idempotencyKey }
    )
    if (error) {
      logger.error('Resend returned an error', { toEmail, error })
      throw error
    }
    logger.info('Email sent', { toEmail })
  } catch (error) {
    logger.error('Error sending email', { toEmail, error })
    throw error
  }
}

export async function sendSolana({
  fromWalletId,
  toAddress,
  solanaAmount,
}: {
  fromWalletId: string
  toAddress: string
  solanaAmount: number
}) {
  try {
    const solanaRPC = process.env.SOLANA_RPC_URL
    const senderPrivateKey = process.env.SOLANA_SENDER_PRIVATE_KEY
    if (solanaRPC === undefined || senderPrivateKey === undefined) {
      logger.error('SOLANA_RPC_URL or SOLANA_SENDER_PRIVATE_KEY missing')
      throw new Error('Solana env missing')
    }
    const connection = new Connection(solanaRPC, 'confirmed')
    const walletKeyPair = Keypair.fromSecretKey(new Uint8Array(bs58.decode(senderPrivateKey)))
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletKeyPair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: solanaAmount * LAMPORTS_PER_SOL,
      })
    )
    const signature = await sendAndConfirmTransaction(connection, transaction, [walletKeyPair])
    logger.info('Solana transfer sent', { toAddress, signature })
    return { signature }
  } catch (error) {
    logger.error('Error sending solana transfer', { toAddress, error })
    throw error
  }
}

const DEFAULT_HTTP_TIMEOUT_MS = 10_000

export async function sendHttp({
  url,
  method,
  headers,
  body,
  idempotencyKey,
}: {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH'
  headers?: Record<string, string> | undefined
  body?: string | undefined
  idempotencyKey: string
}) {
  const timeoutMs = Number(process.env.ACTION_HTTP_TIMEOUT_MS) || DEFAULT_HTTP_TIMEOUT_MS
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const init: RequestInit = {
      method,
      headers: {
        'content-type': 'application/json',
        // Best-effort courtesy header: we don't control whether the
        // receiving endpoint actually honors idempotency keys.
        'idempotency-key': idempotencyKey,
        ...headers,
      },
      signal: controller.signal,
    }
    if (method !== 'GET' && body !== undefined) {
      init.body = body
    }
    const response = await fetch(url, init)
    const text = await response.text()
    if (!response.ok) {
      logger.warn('HTTP action received a non-2xx response', { url, status: response.status })
      throw new Error(`HTTP ${response.status}: ${text.slice(0, 500)}`)
    }
    logger.info('HTTP action succeeded', { url, status: response.status })
    return { status: response.status, body: text.slice(0, 2000) }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      logger.error('HTTP action timed out', { url, timeoutMs })
      throw new Error(`Request to ${url} timed out after ${timeoutMs}ms`)
    }
    logger.error('Error executing HTTP action', { url, error })
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
