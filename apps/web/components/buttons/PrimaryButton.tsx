'use client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonInput } from '../../types/buttonTypes'

export const PrimaryButton = ({ title, path, onClick }: buttonInput) => {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (path) {
      navigateTo(path)
    }
  }
  const navigateTo = useNavigate()
  return (
    <div>
      <button className="btn btn-md btn-primary" onClick={handleClick}>
        {title}
      </button>
    </div>
  )
}
