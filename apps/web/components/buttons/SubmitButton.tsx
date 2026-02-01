import { useState } from 'react'
import { submitType } from '../../types/types'
import {
  postRequest,
  getRequest,
  updateRequest,
  deleteRequest,
} from '../../apiService'

export const SubmitButton = ({ requestType, path, text }: submitType) => {
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const submitRequest = async () => {
    try {
      setLoading(true)
      if (requestType === 'POST') {
        await postRequest({ path, data: {} })
      } else if (requestType === 'GET') {
        await getRequest({ path, data: {} })
      } else if (requestType === 'UPDATE') {
        await updateRequest({ path, data: {} })
      } else if (requestType === 'DELETE') {
        await deleteRequest({ path, data: {} })
      } else {
        return null
      }
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : '')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <button
        className="btn btn-md btn-primary"
        onClick={submitRequest}
        disabled={loading}
      >
        Submit {text}
      </button>
    </div>
  )
}
