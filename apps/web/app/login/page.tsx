'use client'
import { useState } from 'react'
import { Card } from '../../components/cards/Card'
import { logInCardData } from '../../components/cards/cardData'
import { postRequest } from '../../apiService'
import { useNavigate } from '../../hooks/useNavigate'
import Image from 'next/image'

export default function Signin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const navigateTo = useNavigate()
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }
  const handleLogin = async () => {
    try {
      setLoggingIn(true)
      await postRequest({
        path: '/login',
        data: form,
      })
      navigateTo('/dashboard')
    } catch (error) {
      console.error('Error in handleLogin ' + error)
    } finally {
      setLoggingIn(false)
    }
  }
  return (
    <div className="flex">
      <Image
        src="/images/login.png"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <Card
        message={logInCardData.message}
        inputs={logInCardData.inputs}
        buttonLabel={logInCardData.buttonLabel}
        values={form}
        onInputChange={handleInputChange}
        onButtonClick={handleLogin}
        disabled={loggingIn}
      ></Card>
    </div>
  )
}
