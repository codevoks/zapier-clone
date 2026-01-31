import { PrimaryButton } from '../buttons/PrimaryButton'
import { Input } from '../inputs/Input'
import { CardMessage } from './CardMessage'

export const Card = () => {
  return (
    <div className="card">
      <CardMessage textMessage="This is the card message"></CardMessage>
      <div className="h-10"></div>
      <Input inputType="text" inputPlaceholder="Name"></Input>
      <Input inputType="email" inputPlaceholder="abc@abc"></Input>
      <Input inputType="password" inputPlaceholder="password"></Input>
      <div className="h-10"></div>
      <PrimaryButton></PrimaryButton>
    </div>
  )
}
