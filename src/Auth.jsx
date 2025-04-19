// src/Auth.js
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) onLogin()
    else alert(error.message)
  }

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm registration')
  }

  return (
    <div className="p-4 space-y-2">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2" placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="border p-2" placeholder="Password" />
      <button onClick={handleSignIn} className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</button>
      <button onClick={handleSignUp} className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button>
    </div>
  )
}
