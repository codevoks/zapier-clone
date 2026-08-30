import Image from 'next/image'
import { Zap } from '../../../types'
import { PrimaryButton } from '../../buttons/PrimaryButton'
import { TertiaryButton } from '../../buttons/TertiaryButton'
import { deleteRequest } from '../../../apiService'

interface ZapsBarProps {
  cells?: string[]
  zap?: Zap
  onZapDeleted?: (zapId: string) => void
}

const baseWebHookURL = process.env.NEXT_PUBLIC_WEBHOOK_URL ?? ''

export default function ZapsBar({ cells, zap, onZapDeleted }: ZapsBarProps) {
  const deleteZap = async (zapId: string) => {
    const response = await deleteRequest({ path: `/zap/${zapId}`, data: {} })
    if (response.status === 200) {
      onZapDeleted?.(zapId)
    }
  }
  const nameCell =
    zap &&
    (zap.trigger?.type?.image || zap.actions.some(a => a.type?.image)) ? (
      <span className="inline-flex items-center gap-1.5 flex-wrap">
        {zap.trigger?.type?.image && (
          <Image
            src={zap.trigger.type.image}
            width={24}
            height={24}
            alt={zap.trigger.type.name ?? 'Trigger'}
            className="rounded object-contain"
          />
        )}
        {zap.actions.map(a =>
          a.type?.image ? (
            <Image
              key={a.id}
              src={a.type.image}
              width={24}
              height={24}
              alt={a.type.name ?? 'Action'}
              className="rounded object-contain"
            />
          ) : null
        )}
      </span>
    ) : null

  const content =
    cells ??
    (zap
      ? [
          nameCell ?? '—',
          zap.id,
          '—', // Created at
          `${baseWebHookURL}/hooks/catch/${zap.userId}/${zap.id}`,
          <TertiaryButton key="runs" title="Runs" path={`/zap/${zap.id}/runs`} />,
          <PrimaryButton key="edit" title="Edit" path={`/zap/${zap.id}/edit`} />,
          <TertiaryButton
            key="delete"
            title="Delete"
            onClick={() => deleteZap(zap.id)}
          />,
        ]
      : [])

  const isHeader = Boolean(cells)

  return (
    <tr>
      {content.map((cell, i) =>
        isHeader ? <th key={i}>{cell}</th> : <td key={i}>{cell}</td>
      )}
    </tr>
  )
}
