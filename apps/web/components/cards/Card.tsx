import { PrimaryButton } from '../buttons/PrimaryButton'
import { InputBar } from '../inputBar/InputBar'
import { CardMessage } from './CardMessage'
import { cardInput, cardInputBar } from '../../types/cardTypes'
import { useState } from 'react'

export const Card = ({
  message,
  inputs,
  buttonLabel,
  values,
  onInputChange,
  onButtonClick,
  disabled,
}: cardInput) => {
  const [responseMessage, setResponseMessage] = useState<string>('')
  return (
    <div className="card">
      <CardMessage textMessage={message}></CardMessage>
      <div className="h-10"></div>
      {inputs.map((input: cardInputBar) => (
        <InputBar
          key={input.fieldName}
          inputType={input.inputType}
          inputPlaceholder={input.inputPlaceholder}
          value={values?.[input.fieldName] ?? ''}
          onChange={
            onInputChange
              ? e => onInputChange(input.fieldName, e.target.value)
              : undefined
          }
        ></InputBar>
      ))}
      <div className="h-10"></div>
      <PrimaryButton
        title={buttonLabel}
        path={'/dashboard'}
        onClick={async () => {
          const response = await onButtonClick()
          if (response?.status !== 200) {
            setResponseMessage(response?.data)
          }
        }}
        disabled={disabled}
      ></PrimaryButton>
      <CardMessage textMessage={responseMessage}></CardMessage>
    </div>
  )
}
