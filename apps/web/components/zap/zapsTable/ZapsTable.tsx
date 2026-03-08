'use client'
import { Zap } from '../../../types'
import ZapsBar from './ZapsBar'

export default function ZapTable({ zaps }: { zaps: Zap[] }) {
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
                'Go',
                'Edit',
                'Delete',
              ]}
            />
          </thead>
          <tbody>
            {zaps.map(zap => (
              <ZapsBar key={zap.id} zap={zap} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
