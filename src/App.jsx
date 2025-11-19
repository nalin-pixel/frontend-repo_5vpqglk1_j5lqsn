import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Employees from './components/Employees'
import Planner from './components/Planner'
import ExportPanel from './components/ExportPanel'

function App() {
  const [user, setUser] = useState(null)
  const [departmentId, setDepartmentId] = useState('demo-dept')
  const [schedule, setSchedule] = useState(null)

  useEffect(() => {
    // Seed demo user note: backend expects a user with username/password same for quick demo
  }, [])

  if (!user) return <Login onLogin={(u)=>setUser(u)} />

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLogout={()=>setUser(null)} user={user} />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="font-medium text-blue-900">Welcome</div>
          <p className="text-sm text-blue-800">Plan one month at a time, interpret free-text preferences with the smart assistant, and export your plan for external systems.</p>
        </div>
        <Employees user={user} departmentId={departmentId} />
        <Planner departmentId={departmentId} />
        <ExportPanel schedule={schedule} />
      </main>
    </div>
  )
}

export default App
