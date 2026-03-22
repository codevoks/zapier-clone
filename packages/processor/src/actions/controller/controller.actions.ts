import type { ActionItem, ExecutionContext } from '../types/processor.types'
import { ACTION_HANDLERS, executeAction } from '../service/processor.actions'

export async function processActions(
  actionItems: ActionItem[],
  executionContext: ExecutionContext
) {
  try {
    for (const actionItem of actionItems) {
      const result = await executeAction(actionItem, executionContext)
      executionContext.stepResults[actionItem.order] = result ?? {}
      if (!result || !result.success) {
        return { success: false, error: result.error }
      }
    }
    return { success: true }
  } catch (error) {
    console.log('Error in processActions=> ' + error)
    return { success: false, error: error }
  }
}
