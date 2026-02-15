import { getRequest } from '../apiService'

export async function useAvailableTriggers() {
  try {
    const availableTriggers = await getRequest({
      path: 'zap/trigger/available',
      data: {},
    })
    if (availableTriggers.status == 200) {
      return availableTriggers.data.availableTriggers
    }
  } catch (error) {
    console.log('Error getting available triggers')
  }
}
