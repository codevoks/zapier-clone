export type buttonInput = {
  title: string
  path?: string
  onClick?: () => void | Promise<void>
  disabled?: boolean
}
export type requestType = 'GET' | 'POST' | 'DELETE' | 'UPDATE'
export type submitType = {
  requestType: requestType
  path: string
  text?: string
}
