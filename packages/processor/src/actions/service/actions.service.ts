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

export async function sendEmail({
  toEmail,
  subject,
  bodyTemplate,
}: {
  toEmail: string
  subject: string
  bodyTemplate: string
}) {
  try {
    console.log('TO EMAIL ' + toEmail)
    console.log('SUBJECT ' + subject)
    console.log('BODY TEMPLATE ' + bodyTemplate)
    const apiKey = process.env.RESEND_KEY
    const fromEmail = process.env.SEND_EMAIL
    if (apiKey === undefined || fromEmail === undefined) {
      console.log('No ENV variable defined')
      return
    }
    const resend = new Resend(apiKey)
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: subject,
      text: bodyTemplate,
      html: '<strong>It works!</strong>',
    })
    if (error) {
      console.log('Error in resend function ' + error)
      throw error
    }
    console.log('Email sent successfully')
  } catch (error) {
    console.log('Error in sending email ' + error)
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
    console.log('FROM WALLET ID ' + fromWalletId)
    console.log('TO ADDRESS ' + toAddress)
    console.log('LAMPORTS ' + solanaAmount)
    const solanaRPC = process.env.SOLANA_RPC_URL
    const senderPrivateKey = process.env.SOLANA_SENDER_PRIVATE_KEY
    if (solanaRPC === undefined || senderPrivateKey === undefined) {
      console.error('SOLANA_RPC_URL or SOLANA_SENDER_PRIVATE_KEY missing')
      throw new Error('Solana env missing')
    }
    const connection = new Connection(solanaRPC, 'confirmed')
    const walletKeyPair = Keypair.fromSecretKey(
      new Uint8Array(bs58.decode(senderPrivateKey))
    )
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletKeyPair.publicKey,
        toPubkey: new PublicKey(toAddress),
        lamports: solanaAmount * LAMPORTS_PER_SOL,
      })
    )
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      walletKeyPair,
    ])
    console.log('SOLANA sent ' + signature)
    return { signature }
  } catch (error) {
    console.error('Error in sending solana ' + error)
    throw error
  }
}
