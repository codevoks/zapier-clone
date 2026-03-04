import type { ActionItem } from './processor.types'

async function executeEmail(actionItem: ActionItem) {
  const metadata = actionItem.metadata as {
    toEmail?: string
    subject?: string
    bodyTemplate?: string
  }
  if (!metadata || !metadata.toEmail) {
    console.log("Receiver's email address missing.")
    return
  }
  console.log('EXECUTING EMAIL', {
    metadata: actionItem.metadata,
    payload: actionItem.payload,
  })
}
async function executeSolana(actionItem: ActionItem) {
  const metadata = actionItem.metadata as {
    fromWalletId?: string
    toAddress?: string
    amountLamports?: number
  }
  if (!metadata || !metadata.fromWalletId || !metadata.toAddress) {
    console.log("Sender/Receiver's address missing.")
    return
  }
  console.log('EXECUTING SOLANA', {
    metadata: actionItem.metadata,
    payload: actionItem.payload,
  })
}

export const ACTION_HANDLERS: Record<
  string,
  (actionItem: ActionItem) => Promise<void>
> = {
  email: executeEmail,
  solana: executeSolana,
}

export async function executeAction(actionItem: ActionItem) {
  const actionHandler = ACTION_HANDLERS[actionItem.type.toLowerCase()]
  if (!actionHandler) {
    console.log('ACTION NOT SUPPORTED')
    return
  }
  await actionHandler(actionItem)
}
