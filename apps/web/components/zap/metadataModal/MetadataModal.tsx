'use client'

import { useState } from 'react'
import { PrimaryButton } from '../../buttons/PrimaryButton'
import { SecondaryButton } from '../../buttons/SecondaryButton'
import { METADATA_FORM_CONFIG } from '../../../config/metadataFormConfig'

export function MetadataModal({
  type,
  open,
  title,
  onClose,
  onSubmit,
}: {
  type: string
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (metadata: Record<string, unknown>) => void
}) {
  const [toEmail, setToEmail] = useState('')
  if (!open) {
    return null
  }
  const fields = METADATA_FORM_CONFIG[type]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-6 bg-white rounded-lg w-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="text-sm text-slate-600">
            {fields ? `${fields.length} field(s)` : 'no config for this type'}
            {fields?.[0] && (
              <div>
                <label>{fields[0].label}</label>
                <input
                  value={toEmail}
                  type={fields[0].type}
                  onChange={e => setToEmail(e.target.value)}
                ></input>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <SecondaryButton title="Close" onClick={onClose} />
          <PrimaryButton
            title="Submit"
            onClick={() =>
              fields?.[0]
                ? onSubmit({ [fields[0].name]: toEmail })
                : onSubmit({})
            }
          />
        </div>
      </div>
    </div>
  )
}
