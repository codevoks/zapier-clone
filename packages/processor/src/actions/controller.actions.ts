import type { ActionItem } from './processor.types'
import { ACTION_HANDLERS, executeAction } from './processor.actions'

export async function processActions(actionItems: ActionItem[]) {
  try {
    for (const actionItem of actionItems) {
      await executeAction(actionItem)
    }
  } catch (error) {
    console.log('Error in processActions=> ' + error)
  }
}
