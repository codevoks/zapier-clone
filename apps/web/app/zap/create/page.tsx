'use client'
import { useEffect, useState } from 'react'
import { ZapCell } from '../../../components/zap/zapsCell/ZapCell'
import { PrimaryButton } from '../../../components/buttons/PrimaryButton'
import { ZapModal } from '../../../components/zap/zapModal/ZapModal'
import { TertiaryButton } from '../../../components/buttons/TertiaryButton'
import { useAvailableTriggers, useAvailableActions } from '../../../hooks'
import type { AvailableTrigger, AvaialableAction } from '@repo/db'
import { postRequest } from '../../../apiService'
import { MetadataModal } from '../../../components/zap/metadataModal/MetadataModal'

export default function NewZap() {
  const [availableTriggers, setAvailableTriggers] = useState<
    AvailableTrigger[]
  >([])
  const [availableActions, setAvailableActions] = useState<AvaialableAction[]>(
    []
  )
  const [selectedTrigger, setSelectedTrigger] = useState<{
    availableTriggerId: string
    availableTriggerName: string
    triggerMetadata?: Record<string, unknown>
  }>()
  const [selectedActions, setSelectedActions] = useState<
    {
      index: number
      availableActionId: string
      availableActionName: string
      actionMetadata?: Record<string, unknown>
    }[]
  >([])
  const [selectedModalIndex, setSelectedModalIndex] = useState<number | null>(
    null
  )
  const [metadataModal, setMetadataModal] = useState<{
    type: 'trigger' | 'action'
    index: number
    id: string
    name: string
  } | null>(null)

  useEffect(() => {
    const getAvailableTriggers = async () => {
      const response = await useAvailableTriggers()
      if (response) {
        setAvailableTriggers(response)
      }
    }

    const getAvailableActions = async () => {
      const response = await useAvailableActions()
      if (response) {
        setAvailableActions(response)
      }
    }

    getAvailableTriggers()
    getAvailableActions()
  }, [])

  return (
    <div className="zap-create">
      <div className="flex justify-center">
        <TertiaryButton
          title="Publish Zap"
          onClick={async () => {
            if (!selectedTrigger?.availableTriggerId) {
              return
            }
            const response = await postRequest({
              path: 'zap',
              data: {
                availableTriggerId: selectedTrigger?.availableTriggerId,
                triggerMetadata: selectedTrigger?.triggerMetadata ?? {},
                actions: selectedActions.map(action => ({
                  availableActionId: action.availableActionId,
                  availableActionName: action.availableActionName,
                  actionMetadata: action.actionMetadata ?? {},
                })),
              },
            })
          }}
          path="dashboard"
        ></TertiaryButton>
      </div>
      <div className="flex justify-center w-full">
        <ZapCell
          name={
            selectedTrigger ? selectedTrigger.availableTriggerName : 'Trigger'
          }
          index={1}
          onClick={() => setSelectedModalIndex(1)}
        ></ZapCell>
      </div>
      <div className="w-full pt-2 pb-2">
        {selectedActions.map(action => (
          <div key={action.index} className="flex justify-center pt-2">
            <ZapCell
              name={
                action.availableActionName
                  ? action.availableActionName
                  : 'Action'
              }
              index={action.index}
              onClick={() => setSelectedModalIndex(action.index)}
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
                index: prev.length + 2,
                availableActionId: '',
                availableActionName: '',
              },
            ])
          }}
        ></PrimaryButton>
      </div>
      {selectedModalIndex && (
        <ZapModal
          onSelect={(props: null | { name: string; id: string }) => {
            if (props === null) {
              setSelectedModalIndex(null)
              return
            }
            if (selectedModalIndex === 1) {
              setMetadataModal({
                type: 'trigger',
                index: 1,
                id: props.id,
                name: props.name,
              })
              setSelectedTrigger({
                availableTriggerId: props.id,
                availableTriggerName: props.name,
              })
            } else {
              setMetadataModal({
                type: 'action',
                index: selectedModalIndex,
                id: props.id,
                name: props.name,
              })
              setSelectedActions(prev => {
                const newActions = [...prev]
                newActions[selectedModalIndex - 2] = {
                  index: selectedModalIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                }
                return newActions
              })
            }
            setSelectedModalIndex(null)
          }}
          index={selectedModalIndex}
          availableTriggers={availableTriggers}
          availableActions={availableActions}
        />
      )}
      {metadataModal && (
        <MetadataModal
          type={metadataModal.name}
          open
          title={metadataModal.name}
          initialMetadata={
            metadataModal.type === 'trigger'
              ? selectedTrigger?.triggerMetadata
              : selectedActions.find(a => a.index === metadataModal.index)
                  ?.actionMetadata
          }
          onClose={() => setMetadataModal(null)}
          onSubmit={m => {
            if (metadataModal.type === 'trigger') {
              setSelectedTrigger(prev =>
                prev ? { ...prev, triggerMetadata: m } : prev
              )
            } else if (metadataModal.type === 'action') {
              setSelectedActions(prev =>
                prev.map(action =>
                  action.index === metadataModal.index
                    ? { ...action, actionMetadata: m }
                    : action
                )
              )
            }
            setMetadataModal(null)
          }}
        />
      )}
    </div>
  )
}
