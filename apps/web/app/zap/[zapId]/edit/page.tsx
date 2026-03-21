'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useNavigate } from '../../../../hooks'
import { getRequest } from '../../../../apiService'

export default function EditZap() {
  const params = useParams()
  const navigateTo = useNavigate()
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
      } catch (error) {
        console.log('Error - ' + error)
      }
    }
    getZap(params.zapId as string)
  }, [params.zapId])
  return <div></div>
}
