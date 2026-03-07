export function renderTemplate(
  template: string,
  payload: Record<string, unknown>
): string {
  while (template.indexOf('{{payload.') != -1) {
    const startIndex = template.indexOf('{{payload.')
    const endIndex = template.indexOf('}}')
    const keyStart = startIndex + '{{payload.'.length
    const path = template.substring(keyStart, endIndex)
    template = template.replace(
      '{{payload.' + path + '}}',
      getValueAtPath(payload, path)
    )
  }
  return template
}

function getValueAtPath(object: Record<string, unknown>, path: string): string {
  const keys = path.split('.')
  for (const key of keys) {
    if (object == null || !(key in object)) {
      return ''
    }
    object = object[key] as Record<string, unknown>
  }
  return String(object ?? '')
}
