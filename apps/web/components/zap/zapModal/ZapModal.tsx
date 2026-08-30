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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="p-6 bg-white rounded-lg w-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {index === 1 ? 'Trigger' : 'Action'}
          </h2>
          <button onClick={() => onSelect(null)}>×</button>
        </div>
        <p className="mt-4 font-bold text-slate-600">Select an option</p>
        <div className="flex flex-col">
          {index === 1
            ? availableTriggers &&
              availableTriggers.map(trigger => (
                <ZapModalEntry
                  key={trigger.id}
                  entry={trigger}
                  onSelect={() =>
                    onSelect({ name: trigger.name, id: trigger.id })
                  }
                ></ZapModalEntry>
              ))
            : availableActions &&
              availableActions.map(action => (
                <ZapModalEntry
                  key={action.id}
                  entry={action}
                  onSelect={() =>
                    onSelect({ name: action.name, id: action.id })
                  }
                ></ZapModalEntry>
              ))}
        </div>
      </div>
    </div>
  )
}
