export type buttonPathInput = { path: string }
export type requestType = 'GET' | 'POST' | 'DELETE' | 'UPDATE'
export type submitType = {
  requestType: requestType
  path: string
  text?: string
}
