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
  } catch (error) {
    console.log('Error in sending email ' + error)
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
