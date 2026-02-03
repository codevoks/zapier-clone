'use client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonPathInput } from '../../types/buttonTypes'

export const PrimaryButton = ({ path }: buttonPathInput) => {
  const navigateTo = useNavigate()
  return (
    <div>
      <button
        className="btn btn-md btn-primary"
        onClick={() => navigateTo(path)}
      >
        Primary
      </button>
    </div>
  )
}
