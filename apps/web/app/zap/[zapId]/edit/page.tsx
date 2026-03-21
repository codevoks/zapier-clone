'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useNavigate } from '../../../../hooks'
import { getRequest } from '../../../../apiService'

export default function EditZap() {
  const params = useParams()
  const navigateTo = useNavigate()
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
          .sorted((a, b) => a.sortingOrder - b.sortingOrder)
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
  return <div></div>
}
