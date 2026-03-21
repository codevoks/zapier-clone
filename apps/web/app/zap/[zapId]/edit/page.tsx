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
        }
        const zap = response.data
        setSelectedTrigger({
          availableTriggerId: zap.trigger.type.id,
          availableTriggerName: zap.trigger.zapId,
          triggerMetadata: zap.trigger.metadata,
        })
      } catch (error) {
        console.log('Error - ' + error)
      }
    }
    getZap(params.zapId as string)
  }, [params.zapId])
  return <div></div>
}
