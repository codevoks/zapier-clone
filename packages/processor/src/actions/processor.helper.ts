export function renderTemplate(
  template: string,
  payload: Record<string, unknown>
): string {
  const newString = template.replace(
    '{{payload.name}}',
    String(payload.name ?? '')
  )
  return newString
}
