import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

export default function Notes() {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const fetchNotes = async () => {
    const user = (await supabase.auth.getUser()).data.user
    const { data } = await supabase.from('notes').select().eq('user_id', user.id)
    setNotes(data)
  }

  const addNote = async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!title || !content) {
      alert('Please fill in both title and content')
      return
    }
    await supabase.from('notes').insert({ title, content, user_id: user.id })
    setTitle('')
    setContent('')
    fetchNotes()
  }

  const deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 relative">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-start">
          <button
            onClick={handleLogout}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            ⬅ Back to Login
          </button>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800">📝 My Notes</h2>
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note Content"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 h-32"
          />
          <button
            onClick={addNote}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Add Note
          </button>
        </div>

        <div className="grid gap-4">
          {notes.length === 0 ? (
            <p className="text-center text-gray-500">You don’t have any notes yet.</p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{note.title}</h3>
                    <p className="text-gray-600 whitespace-pre-line">{note.content}</p>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                    title="Delete"
                  >
                    ✖
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
