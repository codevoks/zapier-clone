import { PrimaryButton } from '../buttons/PrimaryButton'
import { Input } from '../inputs/Input'
import { CardMessage } from './CardMessage'
import { cardInput, cardInputBar } from '../../types/cardTypes'

export const Card = ({
  message,
  inputs,
  buttonLabel,
  buttonApi,
}: cardInput) => {
  return (
    <div className="card">
      <CardMessage textMessage={message}></CardMessage>
      <div className="h-10"></div>
      {inputs.map((input: cardInputBar) => (
        <Input
          inputType={input.inputType}
          inputPlaceholder={input.inputPlaceholder}
        ></Input>
      ))}
      <div className="h-10"></div>
      <PrimaryButton title={buttonLabel} path={buttonApi}></PrimaryButton>
    </div>
  )
}
