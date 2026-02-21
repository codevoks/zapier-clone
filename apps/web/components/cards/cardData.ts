import { cardInput } from '../../types'

export const signUpCardData: cardInput = {
  message: 'Enter your details to sign up.',
  inputs: [
    { fieldName: 'name', inputType: 'text', inputPlaceholder: 'Name' },
    {
      fieldName: 'email',
      inputType: 'email',
      inputPlaceholder: 'john@example.com',
    },
    {
      fieldName: 'password',
      inputType: 'password',
      inputPlaceholder: 'password',
    },
  ],
  buttonLabel: 'Sign Up',
  onButtonClick: () => {
    return
  },
}

export const logInCardData: cardInput = {
  message: 'Enter your details to log in.',
  inputs: [
    {
      fieldName: 'email',
      inputType: 'email',
      inputPlaceholder: 'john@example.com',
    },
    {
      fieldName: 'password',
      inputType: 'password',
      inputPlaceholder: 'password',
    },
  ],
  buttonLabel: 'Log In',
  onButtonClick: () => {
    return
  },
}
