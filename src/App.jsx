// src/App.js
import { useEffect, useState } from 'react'
import Auth from './Auth'
import Notes from './Notes'
import { supabase } from './supabaseClient'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    supabase.auth.onAuthStateChange((_event, session) => setSession(session))
  }, [])

  return (
    <div className="max-w-xl mx-auto mt-10">
      {session ? <Notes /> : <Auth onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />}
    </div>
  )
}

export default App
