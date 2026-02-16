'use client'

import { AvaialableAction, AvailableTrigger } from '@repo/db'
import { ZapModalEntry } from './ZapModalEntry'

export const ZapModal = ({
  index,
  onSelect,
  availableTriggers,
  availableActions,
}: {
  index: number
  onSelect: (props: null | { name: string; id: string }) => void
  availableTriggers: AvailableTrigger[]
  availableActions: AvaialableAction[]
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {index === 1 ? 'Trigger' : 'Action'}
          </h2>
          <button onClick={() => onSelect(null)}>×</button>
        </div>
        <p className="mt-4 text-slate-600 font-bold">Select an option</p>
        <div className="flex flex-col">
          {index === 1
            ? availableTriggers &&
              availableTriggers.map(trigger => (
                <ZapModalEntry key={trigger.id} entry={trigger}></ZapModalEntry>
              ))
            : availableActions &&
              availableActions.map(action => (
                <ZapModalEntry key={action.id} entry={action}></ZapModalEntry>
              ))}
        </div>
      </div>
    </div>
  )
}
