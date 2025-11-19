import { useEffect, useMemo, useState } from 'react'

const shiftColors = {
  D: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  E: 'bg-amber-100 text-amber-700 border-amber-300',
  N: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  OFF: 'bg-slate-100 text-slate-600 border-slate-300'
}

export default function Planner({ departmentId }) {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [employees, setEmployees] = useState([])
  const [schedule, setSchedule] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const loadEmployees = async () => {
    const r = await fetch(`${baseUrl}/api/employees/${departmentId}`)
    setEmployees(await r.json())
  }

  const daysInMonth = useMemo(() => {
    const start = new Date(year, month - 1, 1)
    const end = new Date(year, month, 0)
    return Array.from({ length: end.getDate() }, (_, i) => new Date(year, month - 1, i + 1))
  }, [year, month])

  const generate = async () => {
    await fetch(`${baseUrl}/api/schedule/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ department_id: departmentId, year, month }) })
    await load()
  }

  const load = async () => {
    try {
      const r = await fetch(`${baseUrl}/api/schedule/${departmentId}/${year}/${month}`)
      if (!r.ok) return setSchedule(null)
      const data = await r.json()
      setSchedule(data)
    } catch {}
  }

  useEffect(() => { if (departmentId){ loadEmployees(); load() } }, [departmentId, year, month])

  const getEmpShift = (empId, d) => {
    const dateStr = d.toISOString().slice(0,10)
    const found = schedule?.assignments?.find(a => a.employee_id === empId && a.date === dateStr)
    return found?.shift || ''
  }

  const setEmpShift = (emp, d, nextShift) => {
    const dateStr = d.toISOString().slice(0,10)
    const current = getEmpShift(emp.id, d)
    setConfirm({
      message: `Are you sure you want to move ${emp.name} from ${current || '—'} to ${nextShift} on ${d.toLocaleDateString()}?`,
      onConfirm: () => {
        const updated = { ...schedule }
        const idx = updated.assignments.findIndex(a => a.employee_id === emp.id && a.date === dateStr)
        if (idx >= 0) updated.assignments[idx].shift = nextShift
        else updated.assignments.push({ employee_id: emp.id, date: dateStr, shift: nextShift })
        setSchedule(updated)
        setConfirm(null)
      }
    })
  }

  const cycleShift = (emp, d) => {
    const order = ['OFF','D','E','N']
    const current = getEmpShift(emp.id, d)
    const next = order[(order.indexOf(current) + 1) % order.length]
    setEmpShift(emp, d, next)
  }

  return (
    <section id="planning" className="py-8">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Monthly Planner</h2>
          <p className="text-sm text-slate-600">Generate and fine-tune the plan. Click a cell to cycle shifts. Changes are local until export.</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="number" className="border rounded px-2 py-1 w-24" value={year} onChange={e=>setYear(Number(e.target.value))} />
          <select className="border rounded px-2 py-1" value={month} onChange={e=>setMonth(Number(e.target.value))}>
            {Array.from({length:12}, (_,i)=>i+1).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={generate} className="bg-blue-600 text-white rounded px-3 py-2">Generate</button>
        </div>
      </div>

      <div className="overflow-auto bg-white border rounded-xl">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-2 border-r text-left w-48">Employee</th>
              {daysInMonth.map(d => (
                <th key={d.toISOString()} className="p-1 border-r text-center min-w-[40px]">
                  <div className="text-[10px] text-slate-500">{d.toLocaleDateString(undefined,{ month:'short', day:'numeric'})}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp.id} className="border-t">
                <td className="p-2 border-r font-medium text-slate-700 sticky left-0 bg-white">{emp.name}</td>
                {daysInMonth.map(d => (
                  <td key={emp.id + d.toISOString()} className="p-0 border-r">
                    <button onClick={() => cycleShift(emp, d)} className={`w-full h-10 border ${shiftColors[getEmpShift(emp.id, d)] || 'bg-white'}`}>{getEmpShift(emp.id, d)}</button>
                  </td>
                ))}
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td className="p-4 text-slate-500">Add employees to start planning.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirm && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <p className="mb-4">{confirm.message}</p>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1.5" onClick={()=>setConfirm(null)}>Cancel</button>
              <button className="px-3 py-1.5 bg-slate-900 text-white rounded" onClick={confirm.onConfirm}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
