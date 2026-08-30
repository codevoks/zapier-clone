import { Status, upsertZapRunExecution } from '@repo/db'
import { createLogger } from '@repo/logger'
import type { ActionItem, ExecutionContext } from '../types/processor.types'
import { executeAction } from '../service/processor.actions'

const logger = createLogger('processor:controller')

export async function processActions(
  actionItems: ActionItem[],
  executionContext: ExecutionContext
) {
  try {
    for (const actionItem of actionItems) {
      const executionState = executionContext.zapRunExecutions.find(
        z => z.stepOrder === actionItem.order
      )
      if (executionState?.status === Status.SUCCESS) {
        if (executionState.message) {
          try {
            executionContext.stepResults[actionItem.order] = JSON.parse(
              executionState.message
            )
          } catch (error) {
            executionContext.stepResults[actionItem.order] = { success: true }
            logger.warn('Could not parse stored step result; continuing', {
              zapRunId: executionContext.zapRunId,
              stepOrder: actionItem.order,
              error,
            })
          }
        } else {
          executionContext.stepResults[actionItem.order] = { success: true }
        }
        continue
      }
      const result = await executeAction(actionItem, executionContext)
      if (result && result.success) {
        await upsertZapRunExecution({
          zapRunId: executionContext.zapRunId,
          stepOrder: actionItem.order,
          status: Status.SUCCESS,
          message: JSON.stringify(result),
        })
      }
      executionContext.stepResults[actionItem.order] = result ?? {}
      if (!result || !result.success) {
        await upsertZapRunExecution({
          zapRunId: executionContext.zapRunId,
          stepOrder: actionItem.order,
          status: Status.FAIL,
          message: String(result?.error ?? ''),
        })
        return { success: false, error: result?.error }
      }
    }
    return { success: true }
  } catch (error) {
    logger.error('processActions failed', { zapRunId: executionContext.zapRunId, error })
    return { success: false, error: error }
  }
}
