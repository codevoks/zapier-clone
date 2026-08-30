import { createLogger } from '@repo/logger'
import type { ActionItem, ExecutionContext } from '../types/processor.types'
import { renderTemplate } from './processor.helper'
import { sendEmail, sendSolana, sendHttp } from './actions.service'

const logger = createLogger('processor:actions')

function idempotencyKeyFor(executionContext: ExecutionContext, actionItem: ActionItem) {
  return `${executionContext.zapRunId}:${actionItem.order}`
}

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
      return { success: false, error: "Receiver's email address missing." }
    }
    const context = {
      payload: executionContext.triggerPayload,
      steps: executionContext.stepResults,
    }
    const subject = renderTemplate(metadata.subject ?? '', context)
    const bodyTemplate = renderTemplate(metadata.bodyTemplate ?? '', context)
    await sendEmail({
      toEmail: metadata.toEmail,
      subject,
      bodyTemplate,
      idempotencyKey: idempotencyKeyFor(executionContext, actionItem),
    })
    return { success: true, sent: true }
  } catch (error) {
    logger.error('executeEmail failed', { error })
    return { success: false, error: error }
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
      solanaAmount?: number
    }
    if (!metadata || !metadata.fromWalletId || !metadata.toAddress) {
      return { success: false, error: "Sender/Receiver's address missing." }
    }
    const context = {
      payload: executionContext.triggerPayload,
      steps: executionContext.stepResults,
    }
    const fromWalletId = renderTemplate(String(metadata.fromWalletId ?? ''), context).trim()
    const toAddress = renderTemplate(metadata.toAddress ?? '', context).trim()
    const amountStr = renderTemplate(String(metadata.solanaAmount ?? ''), context)
    const solanaAmount = Number(amountStr)
    if (!fromWalletId || !toAddress) {
      return { success: false, error: 'Enter valid address' }
    }
    if (Number.isNaN(solanaAmount) || solanaAmount <= 0) {
      return { success: false, error: 'Enter valid amount' }
    }
    const { signature } = await sendSolana({ fromWalletId, toAddress, solanaAmount })
    return { success: true, sent: true, transactionId: signature }
  } catch (error) {
    logger.error('executeSolana failed', { error })
    return { success: false, error: error }
  }
}

async function executeHttp(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  try {
    const metadata = actionItem.metadata as {
      url?: string
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH'
      headers?: Record<string, string>
      bodyTemplate?: string
    }
    if (!metadata || !metadata.url) {
      return { success: false, error: 'URL missing.' }
    }
    const context = {
      payload: executionContext.triggerPayload,
      steps: executionContext.stepResults,
    }
    const url = renderTemplate(metadata.url, context).trim()
    const body = metadata.bodyTemplate ? renderTemplate(metadata.bodyTemplate, context) : undefined
    const result = await sendHttp({
      url,
      method: metadata.method ?? 'POST',
      headers: metadata.headers,
      body,
      idempotencyKey: idempotencyKeyFor(executionContext, actionItem),
    })
    return { success: true, sent: true, status: result.status, response: result.body }
  } catch (error) {
    logger.error('executeHttp failed', { error })
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

export const ACTION_HANDLERS: Record<
  ActionItem['type'],
  (actionItem: ActionItem, executionContext: ExecutionContext) => Promise<Record<string, unknown>>
> = {
  email: executeEmail,
  solana: executeSolana,
  http: executeHttp,
}

export async function executeAction(
  actionItem: ActionItem,
  executionContext: ExecutionContext
): Promise<Record<string, unknown>> {
  const key = actionItem.type.toLowerCase() as keyof typeof ACTION_HANDLERS
  const actionHandler = ACTION_HANDLERS[key]
  if (!actionHandler) {
    logger.warn('Action type not supported', { type: actionItem.type })
    return { success: false, error: `Unsupported action type: ${actionItem.type}` }
  }
  try {
    return await actionHandler(actionItem, executionContext)
  } catch (error) {
    logger.error('Unhandled error executing action', { type: actionItem.type, error })
    return { success: false, error: error }
  }
}
