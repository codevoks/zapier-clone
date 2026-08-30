'use client'
import { Zap } from '../../../types'
import ZapsBar from './ZapsBar'

export default function ZapTable({
  zaps,
  handleZapDeleted,
}: {
  zaps: Zap[]
  handleZapDeleted: (zapId: string) => void
}) {
  return (
    <div className="zaps-table-wrap">
      <div className="overflow-x-auto">
        <table>
          <thead>
            <ZapsBar
              cells={[
                'Name',
                'ID',
                'Created at',
                'Webhook URL',
                'Runs',
                'Edit',
                'Delete',
              ]}
            />
          </thead>
          <tbody>
            {zaps.map(zap => (
              <ZapsBar key={zap.id} zap={zap} onZapDeleted={handleZapDeleted} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
