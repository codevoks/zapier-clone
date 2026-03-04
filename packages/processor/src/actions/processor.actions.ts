import type { ActionItem, ExecutionContext } from './processor.types'

async function executeEmail(
  actionItem: ActionItem,
  executionContext: ExecutionContext
) {
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
async function executeSolana(
  actionItem: ActionItem,
  executionContext: ExecutionContext
) {
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
  ActionItem['type'],
  (actionItem: ActionItem, executionContext: ExecutionContext) => Promise<void>
> = {
  email: executeEmail,
  solana: executeSolana,
}

export async function executeAction(
  actionItem: ActionItem,
  executionContext: ExecutionContext
) {
  const key = actionItem.type.toLowerCase() as keyof typeof ACTION_HANDLERS
  const actionHandler = ACTION_HANDLERS[key]
  if (!actionHandler) {
    console.log('ACTION NOT SUPPORTED')
    return
  }
  await actionHandler(actionItem, executionContext)
}
