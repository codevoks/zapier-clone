'user client'
import { useNavigate } from '../../hooks/useNavigate'

export const SecondaryButton = ({ link }: { link: string }) => {
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
