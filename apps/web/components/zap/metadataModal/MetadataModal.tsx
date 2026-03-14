import { PrimaryButton } from '../../buttons/PrimaryButton'
import { SecondaryButton } from '../../buttons/SecondaryButton'

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
  if (!open) {
    return null
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-6 bg-white rounded-lg w-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {/* Form fields will go here by type */}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <SecondaryButton title="Close" onClick={onClose} />
          <PrimaryButton title="Submit" onClick={() => onSubmit({})} />
        </div>
      </div>
    </div>
  )
}
