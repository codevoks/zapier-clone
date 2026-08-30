import { getRequest } from '../apiService'

// Not a React hook despite the historical filename - a plain fetch helper.
export async function fetchAvailableActions() {
  try {
    const availableActions = await getRequest({
      path: 'zap/action/available',
      data: {},
    })
    if (availableActions.status == 200) {
      return availableActions.data.availableActions
    }
  } catch {
    console.log('Error getting available actions')
  }
}
