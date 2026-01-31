'use client'
import { useRouter } from 'next/navigation'

export const FooterLink = ({ link }: { link: string }) => {
  const router = useRouter()
  const navigateToDashboard = () => {
    router.push('/' + link)
  }
  return (
    <div
      className="footer-column-link footer-column-entry"
      onClick={navigateToDashboard}
    >
      Entry
    </div>
  )
}
