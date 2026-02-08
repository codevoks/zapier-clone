'user client'
import { useNavigate } from '../../hooks/useNavigate'
import { buttonInput } from '../../types/buttonTypes'

export const TertiaryButton = ({ title, path, onClick }: buttonInput) => {
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
      <button className="btn btn-md btn-tertiary" onClick={handleClick}>
        {title}
      </button>
    </div>
  )
}
