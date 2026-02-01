'use client'
import { useNavigate } from '../../hooks/useNavigate'

export const PrimaryButton = ({ link }: { link: string }) => {
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
