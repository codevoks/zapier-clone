'use client'
import { useEffect, useState } from 'react'
import { ZapCell } from '../../../components/zap/zapsCell/ZapCell'
import { PrimaryButton } from '../../../components/buttons/PrimaryButton'
import { ZapModal } from '../../../components/zap/zapModal/ZapModal'
import { MetadataModal } from '../../../components/zap/metadataModal/MetadataModal'
import { TertiaryButton } from '../../../components/buttons/TertiaryButton'
import {
  useNavigate,
  fetchAvailableTriggers,
  fetchAvailableActions,
} from '../../../hooks'
import type { AvailableTrigger, AvaialableAction } from '@repo/db'
import {
  AvailableTriggerType,
  AvailableActionType,
  ZapFormType,
} from '../../../types/zaps'
import { safeParseTriggersAndActions } from '@repo/validation'
import {
  ZAP_API_MAP,
  ZAP_API_BUTTON_LABEL,
  ZAP_API_SUCCESS_CODE,
  ZAP_API_SUCCESS_LABEL,
  ZAP_API_FAILURE_LABEL,
} from '../../../config/zapApiConfig'

export function ZapForm({
  initialTrigger,
  initialActions,
  zapId,
  mode,
}: ZapFormType) {
  const navigateTo = useNavigate()
  const [availableTriggers, setAvailableTriggers] = useState<
    AvailableTrigger[]
  >([])
  const [availableActions, setAvailableActions] = useState<AvaialableAction[]>(
    []
  )
  const [selectedTrigger, setSelectedTrigger] = useState<AvailableTriggerType>()
  const [selectedActions, setSelectedActions] = useState<AvailableActionType[]>(
    []
  )
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
    if (initialTrigger) {
      setSelectedTrigger(initialTrigger)
    }
    if (initialActions) {
      setSelectedActions(initialActions)
    }
  }, [initialTrigger, initialActions])
  useEffect(() => {
    const getAvailableTriggers = async () => {
      const response = await fetchAvailableTriggers()
      if (response) {
        setAvailableTriggers(response)
      }
    }

    const getAvailableActions = async () => {
      const response = await fetchAvailableActions()
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
          title={ZAP_API_BUTTON_LABEL[mode]}
          onClick={async () => {
            if (!selectedTrigger?.availableTriggerId) {
              return
            }
            const actionsPayload = selectedActions
              .filter(action => action.availableActionId !== '')
              .map(action => ({
                index: action.index,
                availableActionId: action.availableActionId,
                availableActionName: action.availableActionName,
                actionMetadata: action.actionMetadata ?? {},
              }))
            if (actionsPayload.length === 0) {
              alert('Add at least one action before publishing zap')
              return
            }
            const bodyForValidation = {
              availableTriggerId: selectedTrigger.availableTriggerId,
              triggerMetadata: selectedTrigger.triggerMetadata ?? {},
              actions: actionsPayload.map(
                ({ availableActionId, actionMetadata }) => ({
                  availableActionId,
                  actionMetadata: actionMetadata ?? {},
                })
              ),
            }
            console.log(
              'bodyForValidation ' + JSON.stringify(bodyForValidation)
            )
            if (!safeParseTriggersAndActions(bodyForValidation)) {
              alert('Trigger or action metadata is invalid')
              return
            }
            try {
              const apiFunction = ZAP_API_MAP[mode]
              const response = await apiFunction({
                selectedTrigger,
                actionsPayload,
                zapId,
              })
              if (response.status === ZAP_API_SUCCESS_CODE[mode]) {
                alert(ZAP_API_SUCCESS_LABEL[mode])
                navigateTo('dashboard')
              } else {
                alert(ZAP_API_FAILURE_LABEL[mode])
              }
            } catch (error) {
              alert('Server error ' + error)
              console.log('Error = ' + error)
            }
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
              setSelectedTrigger(prev => {
                const sameTrigger = prev?.availableTriggerId === props.id
                return {
                  availableTriggerId: props.id,
                  availableTriggerName: props.name,
                  triggerMetadata: sameTrigger
                    ? prev?.triggerMetadata
                    : undefined,
                }
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
                const old = newActions[selectedModalIndex - 2]
                const sameAction = old?.availableActionId === props.id
                newActions[selectedModalIndex - 2] = {
                  index: selectedModalIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                  actionMetadata: sameAction ? old?.actionMetadata : undefined,
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
