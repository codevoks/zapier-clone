import { Resend } from 'resend'

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
  amountLamports,
}: {
  fromWalletId: string
  toAddress: string
  amountLamports: number
}) {
  try {
    console.log('FROM WALLET ID ' + fromWalletId)
    console.log('TO ADDRESS ' + toAddress)
    console.log('LAMPORTS ' + amountLamports)
  } catch (error) {
    console.log('Error in sending solana ' + error)
  }
}
