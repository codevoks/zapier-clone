'use client'
import { Zap } from '../../../types'
import ZapsBar from './ZapsBar'

export default function ZapTable({ zaps }: { zaps: Zap[] }) {
  return (
    <table>
      <thead>
        <ZapsBar
          cells={['ID', 'Trigger ID', 'Trigger Type', 'User ID', 'Actions']}
        />
      </thead>
      <tbody>
        {zaps.map(zap => (
          <ZapsBar key={zap.id} zap={zap} />
        ))}
      </tbody>
    </table>
  )
}
