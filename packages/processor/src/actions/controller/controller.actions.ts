import { Status, upsertZapRunExecution } from '@repo/db'
import type { ActionItem, ExecutionContext } from '../types/processor.types'
import { executeAction } from '../service/processor.actions'

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
        executionContext.stepResults[actionItem.order] = { success: true }
        continue
      }
      const result = await executeAction(actionItem, executionContext)
      if (result && result.success) {
        await upsertZapRunExecution({
          zapRunId: executionContext.zapRunId,
          stepOrder: actionItem.order,
          status: Status.SUCCESS,
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
    console.log('Error in processActions=> ' + error)
    return { success: false, error: error }
  }
}
