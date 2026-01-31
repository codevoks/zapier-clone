'use client'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'

export const Appbar = () => {
  return (
    <div className="appbar">
      <div>
        <PrimaryButton></PrimaryButton>
      </div>
      <div className="flex">
        <SecondaryButton></SecondaryButton>
        <SecondaryButton></SecondaryButton>
        <SecondaryButton></SecondaryButton>
      </div>
    </div>
  )
}
