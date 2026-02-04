'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'
import { getRequest } from '../../apiService'

export const Appbar = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        const response = await getRequest({ path: '/me', data: {} })
        if (response.status === 200) {
          setLoggedIn(true)
        } else {
          setLoggedIn(false)
        }
      } catch (error) {}
    }
    checkLoggedIn()
  }, [pathname])
  return (
    <div className="appbar">
      <div>
        <PrimaryButton title="Home" path=""></PrimaryButton>
      </div>
      <div className="flex">
        {loggedIn ? (
          <SecondaryButton title="Log Out" path=""></SecondaryButton>
        ) : (
          <div className="flex">
            <SecondaryButton title="Sign Up" path="signup"></SecondaryButton>
            <SecondaryButton title="Log In" path="login"></SecondaryButton>
          </div>
        )}
      </div>
    </div>
  )
}
