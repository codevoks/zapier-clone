import { Card } from '../../components/cards/Card'
import { signUpCardData } from '../../components/cards/cardData'

export default function Signup() {
  return (
    <div>
      <Card
        message={signUpCardData.message}
        inputs={signUpCardData.inputs}
        buttonLabel={signUpCardData.buttonLabel}
        buttonApi={signUpCardData.buttonLabel}
      ></Card>
    </div>
  )
}
