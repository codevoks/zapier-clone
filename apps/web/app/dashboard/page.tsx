'use client'
import { TertiaryButton } from '../../components/buttons/TertiaryButton'
import { getRequest } from '../../apiService'
import { useState, useEffect } from 'react'
import { Zap } from '../../types'
import ZapTable from '../../components/zap/zapsTable/ZapsTable'

export default function Dashboard() {
  const [loadingZaps, setLoadingZaps] = useState<boolean>(false)
  const [zaps, setZaps] = useState<Zap[]>([])
  useEffect(() => {
    const getZaps = async () => {
      const response = await getRequest({ path: 'zap', data: {} })
      if (response.status === 200) {
        setZaps(response.data.zaps)
      }
    }
    try {
      setLoadingZaps(true)
      getZaps()
    } catch (error) {
      console.error('Error getting Zaps')
    } finally {
      setLoadingZaps(false)
    }
  }, [])
  return (
    <div className="bg-secondary">
      <TertiaryButton title="Create" path="/zap/create" />
      <div className="flex justify-between w-full h-full ">
        {loadingZaps ? <div>Loading...</div> : <ZapTable zaps={zaps} />}
      </div>
    </div>
  )
}
