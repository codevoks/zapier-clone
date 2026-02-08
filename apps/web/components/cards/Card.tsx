import { PrimaryButton } from '../buttons/PrimaryButton'
import { Input } from '../inputs/Input'
import { CardMessage } from './CardMessage'
import { cardInput, cardInputBar } from '../../types/cardTypes'

export const Card = ({
  message,
  inputs,
  buttonLabel,
  values,
  onInputChange,
  onButtonClick,
  disabled,
}: cardInput) => {
  return (
    <div className="card">
      <CardMessage textMessage={message}></CardMessage>
      <div className="h-10"></div>
      {inputs.map((input: cardInputBar) => (
        <Input
          key={input.fieldName}
          inputType={input.inputType}
          inputPlaceholder={input.inputPlaceholder}
          value={values?.[input.fieldName] ?? ''}
          onChange={
            onInputChange
              ? e => onInputChange(input.fieldName, e.target.value)
              : undefined
          }
        ></Input>
      ))}
      <div className="h-10"></div>
      <PrimaryButton
        title={buttonLabel}
        path={'/dashboard'}
        onClick={onButtonClick}
        disabled={disabled}
      ></PrimaryButton>
    </div>
  )
}
