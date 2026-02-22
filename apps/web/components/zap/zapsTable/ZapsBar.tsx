import { Zap } from '../../../types'

interface ZapsBarProps {
  cells?: string[]
  zap?: Zap
}

export default function ZapsBar({ cells, zap }: ZapsBarProps) {
  const content =
    cells ??
    (zap
      ? [
          [
            zap.trigger?.type?.name,
            zap.actions.map(a => a.name ?? a.actionId).join(', ') || '—',
          ]
            .filter(Boolean)
            .join(' • ') || '—',
          zap.id,
          '—', // Created at
          '—', // Webhook URL
          '—',
        ]
      : [])

  const isHeader = Boolean(cells)

  return (
    <tr>
      {content.map((cell, i) =>
        isHeader ? (
          <th key={i}>{cell}</th>
        ) : (
          <td key={i}>{cell}</td>
        )
      )}
    </tr>
  )
}
