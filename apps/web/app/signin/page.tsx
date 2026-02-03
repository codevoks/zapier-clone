import { Card } from '../../components/cards/Card'
import { signInCardData } from '../../components/cards/cardData'
import Image from 'next/image'

export default function Signin() {
  return (
    <div className="flex">
      <Image
        src="/images/signin.png"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <Card
        message={signInCardData.message}
        inputs={signInCardData.inputs}
        buttonLabel={signInCardData.buttonLabel}
        buttonApi={signInCardData.buttonLabel}
      ></Card>
    </div>
  )
}
