'user client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonInput } from '../../types/buttonTypes'

export const SecondaryButton = ({ title, path }: buttonInput) => {
  const navigateTo = useNavigate()
  return (
    <div>
      <button
        className="btn btn-md btn-secondary"
        onClick={() => navigateTo(path)}
      >
        {title}
      </button>
    </div>
  )
}
