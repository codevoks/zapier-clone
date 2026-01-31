'user client'
import { useRouter } from 'next/router'

export const SecondaryButton = ({ link }: { link: string }) => {
  const router = useRouter()
  const navigateToRoute = () => {
    router.push('/' + link)
  }
  return (
    <div>
      <button className="btn btn-md btn-secondary">Secondary</button>
    </div>
  )
}
