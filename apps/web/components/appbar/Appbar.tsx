'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PrimaryButton } from '../buttons/PrimaryButton'
import { SecondaryButton } from '../buttons/SecondaryButton'
import { getRequest, postRequest } from '../../apiService'
import { useNavigate } from '../../hooks/useNavigate'

export const Appbar = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [loggingOut, setLoggingOut] = useState<boolean>(false)
  const pathname = usePathname()

  const navigateTo = useNavigate()

  useEffect(() => {
    async function checkLoggedIn() {
      try {
        const response = await getRequest({ path: '/me', data: {} })
        if (response.status === 200) {
          setLoggedIn(true)
        } else {
          setLoggedIn(false)
        }
      } catch (error) {
        setLoggedIn(false)
        console.error(error)
      }
    }
    checkLoggedIn()
  }, [pathname])

  const handleLogOutClick = async () => {
    try {
      setLoggingOut(true)
      await postRequest({ path: '/logout', data: {} })
      navigateTo('/')
    } catch (error) {
      console.error(error)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="appbar">
      <div>
        <PrimaryButton title="Home" path="/"></PrimaryButton>
      </div>
      <div className="flex">
        <PrimaryButton title="Dashboard" path="/dashboard"></PrimaryButton>
        {loggedIn ? (
          <SecondaryButton
            title="Log Out"
            onClick={handleLogOutClick}
            disabled={loggingOut}
          ></SecondaryButton>
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
