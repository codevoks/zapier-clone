export function renderTemplate(
  template: string,
  context: {
    payload: Record<string, unknown>
    steps?: Record<string, unknown>[]
  }
): string {
  while (template.indexOf('{{payload.') !== -1) {
    const startIndex = template.indexOf('{{payload.')
    const endIndex = template.indexOf('}}', startIndex)
    const keyStart = startIndex + '{{payload.'.length
    const path = template.substring(keyStart, endIndex)
    template = template.replace(
      '{{payload.' + path + '}}',
      getValueAtPath(context.payload, path)
    )
  }
  while (template.indexOf('{{steps.') !== -1) {
    const startIndex = template.indexOf('{{steps.')
    const endIndex = template.indexOf('}}', startIndex)
    const keyStart = startIndex + '{{steps.'.length
    const content = template.substring(keyStart, endIndex)
    const dotIndex = content.indexOf('.')
    const stepNumber = parseInt(content.substring(0, dotIndex), 10)
    const step = context.steps?.[stepNumber] as Record<string, unknown>
    const path = content.substring(dotIndex + 1)
    template = template.replace(
      '{{steps.' + content + '}}',
      getValueAtPath(step, path)
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
