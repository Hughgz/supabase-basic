// src/Notes.js
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
    await supabase.from('notes').insert({ title, content, user_id: user.id })
    setTitle(''); setContent('')
    fetchNotes()
  }

  const deleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id)
    fetchNotes()
  }

  useEffect(() => { fetchNotes() }, [])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">My Notes</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="border p-2 w-full" />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" className="border p-2 w-full" />
      <button onClick={addNote} className="bg-purple-600 text-white px-4 py-2 rounded">Add Note</button>

      <ul className="space-y-2">
        {notes.map(note => (
          <li key={note.id} className="border p-2 rounded">
            <div className="font-semibold">{note.title}</div>
            <p>{note.content}</p>
            <button onClick={() => deleteNote(note.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
