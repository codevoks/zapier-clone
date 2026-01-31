'use client'
import { useRouter } from 'next/navigation'
// import { LinkButton } from './buttons/LinkButtonR'
// import { PrimaryButton } from './buttons/PrimaryButtonR'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'
import { Input } from '../inputs/Input'
import { Card } from '../cards/Card'

// export const Appbar = () => {
//   const router = useRouter()
//   return (
//     <div className="flex justify-between p-4 border-b">
//       <div className="flex flex-col justify-center">Zapier</div>
//       <div>
//         <div className="pr-4">
//           <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
//         </div>
//         <div className="pr-4">
//           <LinkButton
//             onClick={() => {
//               router.push('/login')
//             }}
//           >
//             Log In
//           </LinkButton>
//         </div>
//         <PrimaryButton
//           onClick={() => {
//             router.push('/signup')
//           }}
//         >
//           Sign Up
//         </PrimaryButton>
//       </div>
//     </div>
//   )
// }

export const Appbar = () => {
  return (
    <div className="appbar">
      <div>
        <PrimaryButton></PrimaryButton>
      </div>
      <div className="flex">
        <SecondaryButton></SecondaryButton>
        <SecondaryButton></SecondaryButton>
        <SecondaryButton></SecondaryButton>
      </div>
    </div>
  )
}
