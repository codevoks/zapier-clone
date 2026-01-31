'use client'
import { useRouter } from 'next/navigation'

export const FooterLink = ({ link }: { link: string }) => {
  const router = useRouter()
  const navigateToLink = () => {
    router.push('/' + link)
  }
  return (
    <div
      className="footer-column-link footer-column-entry"
      onClick={navigateToLink}
    >
      Entry
    </div>
  )
}
