'use client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonPathInput } from '../../types/types'

export const PrimaryButton = ({ link }: buttonPathInput) => {
  const navigateTo = useNavigate()
  return (
    <div>
      <button
        className="btn btn-md btn-primary"
        onClick={() => navigateTo(link)}
      >
        Primary
      </button>
    </div>
  )
}
