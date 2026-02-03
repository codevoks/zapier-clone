import { cardInput } from '../../types'

export const signUpCardData: cardInput = {
  message: 'Enter your details to sign up.',
  inputs: [
    { inputType: 'text', inputPlaceholder: 'Name' },
    { inputType: 'email', inputPlaceholder: 'john@example.com' },
    { inputType: 'password', inputPlaceholder: 'password' },
  ],
  buttonLabel: 'Sign Up',
  buttonApi: 'api/v1/signup',
}

export const signInCardData: cardInput = {
  message: 'Enter your details to sign in.',
  inputs: [
    { inputType: 'email', inputPlaceholder: 'john@example.com' },
    { inputType: 'password', inputPlaceholder: 'password' },
  ],
  buttonLabel: 'Sign In',
  buttonApi: 'api/v1/signin',
}
