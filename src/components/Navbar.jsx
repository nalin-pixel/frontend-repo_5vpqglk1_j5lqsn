import { useState } from 'react'
import { Menu } from 'lucide-react'

export default function Navbar({ onLogout, user }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600" />
          <div className="font-semibold text-slate-800">SmartAssistenten Turnus</div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <a href="#employees" className="hover:text-slate-900">Employees</a>
          <a href="#planning" className="hover:text-slate-900">Planning</a>
          <a href="#export" className="hover:text-slate-900">Export</a>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm text-slate-600">{user.username} · {user.role}</div>
          )}
          <button onClick={onLogout} className="px-3 py-1.5 rounded bg-slate-900 text-white text-sm">Logout</button>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu size={20} />
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3">
          <nav className="flex flex-col gap-2 text-sm">
            <a href="#employees" className="py-1">Employees</a>
            <a href="#planning" className="py-1">Planning</a>
            <a href="#export" className="py-1">Export</a>
          </nav>
        </div>
      )}
    </header>
  )
}
