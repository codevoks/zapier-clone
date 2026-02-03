import { Card } from '../../components/cards/Card'
import { signUpCardData } from '../../components/cards/cardData'
import Image from 'next/image'

export default function Signup() {
  return (
    <div className="flex">
      <Image
        src="/images/signup.png"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <Card
        message={signUpCardData.message}
        inputs={signUpCardData.inputs}
        buttonLabel={signUpCardData.buttonLabel}
        buttonApi={signUpCardData.buttonLabel}
      ></Card>
    </div>
  )
}
