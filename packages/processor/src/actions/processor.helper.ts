export function renderTemplate(
  template: string,
  payload: Record<string, unknown>
): string {
  while (template.indexOf('{{payload.') != -1) {
    const startIndex = template.indexOf('{{payload.')
    const endIndex = template.indexOf('}}')
    const keyStart = startIndex + '{{payload.'.length
    const placeHolder = template.substring(keyStart, endIndex)
    template = template.replace(
      '{{payload.' + placeHolder + '}}',
      String(payload[placeHolder] ?? '')
    )
  }
  return template
}
