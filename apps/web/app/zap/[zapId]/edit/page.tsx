'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useNavigate } from '../../../../hooks'
import { getRequest } from '../../../../apiService'
import { ZapForm } from '../../../../components/zap/zapForm/ZapForm'
import {
  AvailableTriggerType,
  AvailableActionType,
} from '../../../../types/zaps'

export default function EditZap() {
  const params = useParams()
  const navigateTo = useNavigate()
  const [selectedTrigger, setSelectedTrigger] = useState<AvailableTriggerType>()
  const [selectedActions, setSelectedActions] = useState<AvailableActionType[]>(
    []
  )
  useEffect(() => {
    const getZap = async (zapId: string) => {
      try {
        const response = await getRequest({
          path: `zap/${zapId}`,
          data: {},
        })
        if (response.status !== 200) {
          navigateTo('dashboard')
          return
        }
        const zap = response.data.zap
        setSelectedTrigger({
          availableTriggerId: zap.trigger.type.id,
          availableTriggerName: zap.trigger.type.name,
          triggerMetadata: zap.trigger.metadata ?? {},
        })
        const actions = [...zap.actions]
          .sort((a, b) => a.sortingOrder - b.sortingOrder)
          .map((action, index) => ({
            index: index + 2,
            availableActionId: action.type.id,
            availableActionName: action.type.name,
            actionMetadata: action.metadata ?? {},
          }))
        setSelectedActions(actions)
      } catch (error) {
        console.log('Error - ' + error)
      }
    }
    getZap(params.zapId as string)
  }, [params.zapId])
  return (
    <ZapForm
      initialTrigger={selectedTrigger}
      initialActions={selectedActions}
      zapId={params.zapId as string}
      mode="updateZap"
    />
  )
}
