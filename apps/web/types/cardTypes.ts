export type cardInputBar = {
  fieldName: string
  inputType: string
  inputPlaceholder: string
}
export type cardInput = {
  message: string
  inputs: cardInputBar[]
  buttonLabel: string
  values?: Record<string, string>
  onInputChange?: (field: string, value: string) => void
  onButtonClick?: () => void | Promise<void>
  disabled?: boolean
}
