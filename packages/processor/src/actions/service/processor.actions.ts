import type { ActionItem, ExecutionContext } from '../types/processor.types'
import { renderTemplate } from './processor.helper'
import { sendEmail, sendSolana } from './actions.service'

async function executeEmail(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  try {
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
    await sendEmail({ toEmail: metadata.toEmail, subject, bodyTemplate })
    return { success: true, sent: true }
  } catch (error) {
    console.log('Error in executeEmail')
    return { success: false }
  }
}
async function executeSolana(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  try {
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
    await sendSolana({
      fromWalletId: metadata.fromWalletId,
      toAddress: metadata.toAddress,
      amountLamports: metadata.amountLamports ?? 0,
    })
    return { success: true, sent: true, transactionId: '' }
  } catch (error) {
    console.log('Error in executeSolana')
    return { success: false }
  }
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
