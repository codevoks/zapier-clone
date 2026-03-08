import type { ActionItem, ExecutionContext } from './processor.types'
import { renderTemplate } from './processor.helper'

async function executeEmail(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  const metadata = actionItem.metadata as {
    toEmail?: string
    subject?: string
    bodyTemplate?: string
  }
  if (!metadata || !metadata.toEmail) {
    console.log("Receiver's email address missing.")
    return { success: false }
  }
  console.log('EXECUTING EMAIL', {
    metadata: actionItem.metadata,
    payload: actionItem.payload,
  })
  const context = {
    payload: executionContext.triggerPayload,
    steps: executionContext.stepResults,
  }
  const subject = renderTemplate(metadata.subject ?? '', context)
  const bodyTemplate = renderTemplate(metadata.bodyTemplate ?? '', context)
  console.log('SUBJECT => ' + subject)
  console.log('BODY TEMPLATE => ' + bodyTemplate)
  return { success: true, sent: true }
}
async function executeSolana(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  const metadata = actionItem.metadata as {
    fromWalletId?: string
    toAddress?: string
    amountLamports?: number
  }
  if (!metadata || !metadata.fromWalletId || !metadata.toAddress) {
    console.log("Sender/Receiver's address missing.")
    return { success: false }
  }
  console.log('EXECUTING SOLANA', {
    metadata: actionItem.metadata,
    payload: actionItem.payload,
  })
  return { success: true, sent: true, transactionId: '' }
}

export const ACTION_HANDLERS: Record<
  ActionItem['type'],
  (
    actionItem: ActionItem,
    executionContext: ExecutionContext
  ) => Promise<Record<string, unknown>>
> = {
  email: executeEmail,
  solana: executeSolana,
}

export async function executeAction(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  const key = actionItem.type.toLowerCase() as keyof typeof ACTION_HANDLERS
  const actionHandler = ACTION_HANDLERS[key]
  if (!actionHandler) {
    console.log('ACTION NOT SUPPORTED')
    return { success: false }
  }
  return await actionHandler(actionItem, executionContext)
}
