import Image from 'next/image'
import { Zap } from '../../../types'

interface ZapsBarProps {
  cells?: string[]
  zap?: Zap
}

const baseWebHookURL = process.env.NEXT_PUBLIC_WEBHOOK_URL ?? ''

export default function ZapsBar({ cells, zap }: ZapsBarProps) {
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
          `${baseWebHookURL}/${zap.userId}/${zap.id}`,
          '—', // Go
          '—', // Edit
          '—', // Delete
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
