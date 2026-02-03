'use client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonInput } from '../../types/buttonTypes'

export const PrimaryButton = ({ title, path }: buttonInput) => {
  const navigateTo = useNavigate()
  return (
    <div>
      <button
        className="btn btn-md btn-primary"
        onClick={() => navigateTo(path)}
      >
        {title}
      </button>
    </div>
  )
}
