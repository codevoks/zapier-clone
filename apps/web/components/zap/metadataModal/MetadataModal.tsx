import { PrimaryButton } from '../../buttons/PrimaryButton'
import { SecondaryButton } from '../../buttons/SecondaryButton'

export function MetadataModal({
  open,
  title,
  onClose,
  onSubmit,
}: {
  open: boolean
  title: string
  onClose: () => void
  onSubmit: (metadata: Record<string, unknown>) => void
}) {
  if (!open) {
    return
  }
  return (
    <div>
      <div>{title}</div>
      <div>
        <PrimaryButton
          title="Submit"
          onClick={() => onSubmit({})}
        ></PrimaryButton>
        <SecondaryButton
          title="Close"
          onClick={() => onClose()}
        ></SecondaryButton>
      </div>
    </div>
  )
}
