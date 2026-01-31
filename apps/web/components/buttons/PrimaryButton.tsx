'use client'
import { useRouter } from 'next/router'

export const PrimaryButton = ({ link }: { link: string }) => {
  const router = useRouter()
  const navigateToRoute = () => {
    router.push('/' + link)
  }
  return (
    <div>
      <button className="btn btn-md btn-primary" onClick={navigateToRoute}>
        Primary
      </button>
    </div>
  )
}
