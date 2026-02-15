'use client'
import { useState } from 'react'
import ZapCell from '../../../components/zapsCell/ZapCell'
import { SecondaryButton } from '../../../components/buttons/SecondaryButton'
import { PrimaryButton } from '../../../components/buttons/PrimaryButton'

export default function NewZap() {
  const [selectedTrigger, setSelectedTrigger] = useState('')
  const [selectedActions, setSelectedActions] = useState<
    {
      availableactionId: string
      availableActionName: string
    }[]
  >([])
  return (
    <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
      <div className="flex justify-center w-full">
        <ZapCell
          name={selectedTrigger ? selectedTrigger : 'Trigger'}
          index={1}
        ></ZapCell>
      </div>
      <div className="w-full pt-2 pb-2">
        {selectedActions.map((action, index) => (
          <div className="pt-2 flex justify-center">
            <ZapCell
              name={
                action.availableActionName
                  ? action.availableActionName
                  : 'Action'
              }
              index={2 + index}
            ></ZapCell>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <PrimaryButton
          title=" + "
          onClick={() => {
            setSelectedActions(prev => [
              ...prev,
              {
                availableactionId: '',
                availableActionName: '',
              },
            ])
          }}
        ></PrimaryButton>
      </div>
    </div>
  )
}
