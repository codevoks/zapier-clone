import { getRequest } from '../apiService'

export async function useAvailableActions() {
  try {
    const availableActions = await getRequest({
      path: 'zap/action/available',
      data: {},
    })
    if (availableActions.status == 200) {
      return availableActions.data.availableActions
    }
  } catch (error) {
    console.log('Error getting available triggers')
  }
}
