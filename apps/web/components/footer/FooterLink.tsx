'use client'
import { useNavigate } from '../../hooks/useNavigate'

export const FooterLink = ({ link }: { link: string }) => {
  const navigateTo = useNavigate()
  return (
    <div
      className="footer-column-link footer-column-entry"
      onClick={() => navigateTo('dashboard')}
    >
      Entry
    </div>
  )
}
