import { useEffect, useState } from 'react'

export default function Employees({ user, departmentId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ name: '', contract_percentage: 100, preferences_text: '' })

  const load = async () => {
    const r = await fetch(`${baseUrl}/api/employees/${departmentId}`)
    const data = await r.json()
    setEmployees(data)
  }

  useEffect(() => { if (departmentId) load() }, [departmentId])

  const add = async (e) => {
    e.preventDefault()
    await fetch(`${baseUrl}/api/employees`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, department_id: departmentId })
    })
    setForm({ name: '', contract_percentage: 100, preferences_text: '' })
    load()
  }

  const interpret = async (text) => {
    const r = await fetch(`${baseUrl}/api/ai/interpret`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) })
    return await r.json()
  }

  return (
    <section id="employees" className="py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Employees</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-4">
          <form onSubmit={add} className="space-y-3">
            <div>
              <label className="text-sm text-slate-700">Name</label>
              <input className="mt-1 w-full border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            </div>
            <div>
              <label className="text-sm text-slate-700">Contract %</label>
              <input type="number" className="mt-1 w-full border rounded px-3 py-2" value={form.contract_percentage} onChange={e=>setForm({...form, contract_percentage:Number(e.target.value)})} min={1} max={200} />
            </div>
            <div>
              <label className="text-sm text-slate-700">Preferences (free text)</label>
              <textarea className="mt-1 w-full border rounded px-3 py-2" rows={4} value={form.preferences_text} onChange={e=>setForm({...form, preferences_text:e.target.value})} />
            </div>
            <button className="bg-slate-900 text-white rounded px-3 py-2">Add Employee</button>
          </form>
        </div>
        <div className="bg-white border rounded-xl divide-y">
          {employees.map(e => (
            <div key={e.id} className="p-4">
              <div className="font-medium">{e.name} <span className="text-xs text-slate-500">({e.contract_percentage}%)</span></div>
              {e.preferences_text && (
                <div className="mt-2 text-sm text-slate-600">
                  <div className="font-semibold">Preference:</div>
                  <p className="italic">{e.preferences_text}</p>
                </div>
              )}
            </div>
          ))}
          {employees.length === 0 && <div className='p-4 text-sm text-slate-500'>No employees yet.</div>}
        </div>
      </div>
    </section>
  )
}
