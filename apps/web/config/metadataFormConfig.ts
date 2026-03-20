type MetadataField = {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'url'
}

export const METADATA_FORM_CONFIG: Record<string, MetadataField[]> = {
  Email: [
    { name: 'toEmail', label: 'To email', type: 'email' },
    { name: 'subject', label: 'Subject', type: 'text' },
    { name: 'bodyTemplate', label: 'Body', type: 'text' },
  ],
}
