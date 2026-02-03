export type buttonInput = { title: string; path: string }
export type requestType = 'GET' | 'POST' | 'DELETE' | 'UPDATE'
export type submitType = {
  requestType: requestType
  path: string
  text?: string
}
