'use client'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'

export const Appbar = () => {
  return (
    <div className="appbar">
      <div>
        <PrimaryButton path="home"></PrimaryButton>
      </div>
      <div className="flex">
        <SecondaryButton path="home"></SecondaryButton>
        <SecondaryButton path="home"></SecondaryButton>
        <SecondaryButton path="home"></SecondaryButton>
      </div>
    </div>
  )
}
