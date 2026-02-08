'use client'
import { useState } from 'react'
import { Card } from '../../components/cards/Card'
import { signUpCardData } from '../../components/cards/cardData'
import { postRequest } from '../../apiService'
import { useNavigate } from '../../hooks/useNavigate'
import Image from 'next/image'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [signingUp, setSigningUp] = useState<boolean>(false)
  const navigateTo = useNavigate()
  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }
  const handleSignUp = async () => {
    try {
      setSigningUp(true)
      await postRequest({
        path: '/signup',
        data: form,
      })
      navigateTo('/dashboard')
    } catch (error) {
      console.error('Error in handleSignUp ' + error)
    } finally {
      setSigningUp(false)
    }
  }
  return (
    <div className="flex">
      <Image
        src="/images/signup.png"
        width={1500}
        height={500}
        alt="Picture of the author"
      />
      <Card
        message={signUpCardData.message}
        inputs={signUpCardData.inputs}
        buttonLabel={signUpCardData.buttonLabel}
        values={form}
        onInputChange={handleInputChange}
        onButtonClick={handleSignUp}
        disabled={signingUp}
      ></Card>
    </div>
  )
}
