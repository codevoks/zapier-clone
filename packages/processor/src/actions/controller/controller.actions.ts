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
    }
  } catch (error) {
    console.log('Error in processActions=> ' + error)
  }
}
