import { Card } from '../../components/cards/Card'
import { logInCardData } from '../../components/cards/cardData'
import Image from 'next/image'

export default function Signin() {
  return (
    <div className="flex">
      <Image
        src="/images/login.png"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <Card
        message={logInCardData.message}
        inputs={logInCardData.inputs}
        buttonLabel={logInCardData.buttonLabel}
        buttonApi={logInCardData.buttonLabel}
      ></Card>
    </div>
  )
}
