'use client'
import { AvailableTrigger, AvaialableAction } from '@repo/db'
import Image from 'next/image'

export const ZapModalEntry = ({
  entry,
}: {
  entry: AvailableTrigger | AvaialableAction
}) => {
  return (
    <div className="flex items-center gap-xs p-xs">
      <Image
        src={entry.image}
        width={25}
        height={25}
        alt="Icon of the Trigger"
      />
      <h4 className="font-medium">{entry.name}</h4>
    </div>
  )
}
