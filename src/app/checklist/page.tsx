'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Control = {
  id: string
  code: string
  title: string
  description: string
}

export default function ChecklistPage() {
  const [controls, setControls] = useState<Control[]>([])
  const [statuses, setStatuses] = useState<{ [key: string]: string }>({})
  const [notes, setNotes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    const fetchControls = async () => {
      const { data, error } = await supabase.from('control').select('*').order('code')
      if (error) console.error('Error loading controls:', error)
      else setControls(data)
    }
    fetchControls()
  }, [])

  const handleStatusChange = (id: string, status: string) => {
    setStatuses(prev => ({ ...prev, [id]: status }))
  }

  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }))
  }

  const saveStatus = async (control: Control) => {
    const payload = {
      org_id: 'your-org-id-here', // Replace with your real org UUID
      control_id: control.id,
      status: statuses[control.id] || 'Not Met',
      notes: notes[control.id] || '',
    }
    const { error } = await supabase
      .from('control_status')
      .upsert(payload, { onConflict: 'org_id,control_id' })


    if (error) alert('Error saving: ' + error.message)
    else alert('Saved!')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        CMMC Level 2 Checklist
      </h1>
      {controls.map((control) => (
        <div key={control.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: '1rem', marginBottom: '1rem' }}>
          <h2 style={{ fontWeight: 'bold' }}>{control.code}: {control.title}</h2>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>{control.description}</p>

          <div style={{ marginTop: '0.5rem' }}>
            <label>Status:&nbsp;</label>
            <select
              value={statuses[control.id] || ''}
              onChange={(e) => handleStatusChange(control.id, e.target.value)}
            >
              <option value="">Select</option>
              <option value="Met">Met</option>
              <option value="Partial">Partial</option>
              <option value="Not Met">Not Met</option>
              <option value="N/A">N/A</option>
            </select>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <textarea
              placeholder="Add notes or observations..."
              style={{ width: '100%', height: '80px' }}
              onChange={(e) => handleNoteChange(control.id, e.target.value)}
              value={notes[control.id] || ''}
            />
          </div>

          <button
            onClick={() => saveStatus(control)}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Save
          </button>
        </div>
      ))}
    </div>
  )
}
