'use client'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'

export const Appbar = () => {
  return (
    <div className="appbar">
      <div>
        <PrimaryButton title="Home" path=""></PrimaryButton>
      </div>
      <div className="flex">
        <SecondaryButton title="Sign Up" path="signup"></SecondaryButton>
        <SecondaryButton title="Sign In" path="signin"></SecondaryButton>
        <SecondaryButton title="Log Out" path=""></SecondaryButton>
      </div>
    </div>
  )
}
