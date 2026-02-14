import { Zap } from '../../types'

interface ZapsBarProps {
  cells?: string[]
  zap?: Zap
}

export default function ZapsBar({ cells, zap }: ZapsBarProps) {
  const content =
    cells ??
    (zap
      ? [
          zap.id,
          zap.triggerId,
          zap.trigger.type.name,
          String(zap.userId),
          zap.actions.map(a => a.actionId).join(', ') || '-',
        ]
      : [])

  return (
    <tr>
      {content.map((cell, i) =>
        cells ? (
          <th key={i}>{cell}</th>
        ) : (
          <td key={i}>{cell}</td>
        )
      )}
    </tr>
  )
}
