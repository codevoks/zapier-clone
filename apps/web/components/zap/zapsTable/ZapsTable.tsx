'use client'
import { Zap } from '../../../types'
import ZapsBar from './ZapsBar'

export default function ZapTable({ zaps }: { zaps: Zap[] }) {
  return (
    <table>
      <thead>
        <ZapsBar cells={['Name', 'ID', 'Created at', 'Webhook URL', 'Go']} />
      </thead>
      <tbody>
        {zaps.map(zap => (
          <ZapsBar key={zap.id} zap={zap} />
        ))}
      </tbody>
    </table>
  )
}
