'use client'
import { useNavigate } from '../../hooks/useNavigate'
import { columnEntry } from '../../types'

export const FooterLink = ({ title, path }: columnEntry) => {
  const navigateTo = useNavigate()
  return (
    <div
      className="footer-column-link footer-column-entry"
      onClick={() => navigateTo(path)}
    >
      {title}
    </div>
  )
}
