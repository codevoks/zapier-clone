import type { ActionItem, ExecutionContext } from './processor.types'
import { ACTION_HANDLERS, executeAction } from './processor.actions'

export async function processActions(
  actionItems: ActionItem[],
  executionContext: ExecutionContext
) {
  try {
    for (const actionItem of actionItems) {
      await executeAction(actionItem, executionContext)
    }
  } catch (error) {
    console.log('Error in processActions=> ' + error)
  }
}
