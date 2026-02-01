'user client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonPathInput } from '../../types/types'

export const SecondaryButton = ({ link }: buttonPathInput) => {
  const navigateTo = useNavigate()
  return (
    <div>
      <button
        className="btn btn-md btn-secondary"
        onClick={() => navigateTo(link)}
      >
        Secondary
      </button>
    </div>
  )
}
