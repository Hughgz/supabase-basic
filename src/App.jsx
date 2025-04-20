// src/App.js
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Profile from './Profile'
import UsersList from './UsersList'
import Notes from './Notes' // ✅ import thêm

export default function App() {
  const [session, setSession] = useState(null)
  const [view, setView] = useState('notes') // ✅ 'notes' or 'profile'

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return <Auth onLogin={() => {}} />
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-800">My Notes App</h1>
            </div>
            <div className="flex space-x-4 items-center">
              <button
                onClick={() => setView('notes')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  view === 'notes'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Notes
              </button>
              <button
                onClick={() => setView('profile')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  view === 'profile'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Profile
              </button>
              <button
                onClick={() => supabase.auth.signOut()}
                className="px-4 py-2 text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {view === 'notes' && <Notes />}
          {view === 'profile' && <Profile user={session.user} />}
        </div>
      </main>
    </div>
  )
}
