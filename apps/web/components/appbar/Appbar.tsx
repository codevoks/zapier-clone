'use client'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'

export const Appbar = () => {
  return (
    <div className="appbar">
      <div>
        <PrimaryButton link="home"></PrimaryButton>
      </div>
      <div className="flex">
        <SecondaryButton link="home"></SecondaryButton>
        <SecondaryButton link="home"></SecondaryButton>
        <SecondaryButton link="home"></SecondaryButton>
      </div>
    </div>
  )
}
