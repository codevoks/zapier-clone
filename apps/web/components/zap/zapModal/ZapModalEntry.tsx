'use client'
import { AvailableTrigger, AvaialableAction } from '@repo/db'
import Image from 'next/image'

export const ZapModalEntry = ({
  entry,
  onSelect,
}: {
  entry: AvailableTrigger | AvaialableAction
  onSelect: (props: null | { name: string; id: string }) => void
}) => {
  return (
    <div
      className="flex items-center gap-xs p-xs hover:bg-slate-100 cursor-pointer"
      onClick={() => onSelect({ name: entry.name, id: entry.id })}
    >
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
