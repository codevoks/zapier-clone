import { getRequest } from '../apiService'

// Not a React hook despite the historical filename - a plain fetch helper.
export async function fetchAvailableTriggers() {
  try {
    const availableTriggers = await getRequest({
      path: 'zap/trigger/available',
      data: {},
    })
    if (availableTriggers.status == 200) {
      return availableTriggers.data.availableTriggers
    }
  } catch {
    console.log('Error getting available triggers')
  }
}
