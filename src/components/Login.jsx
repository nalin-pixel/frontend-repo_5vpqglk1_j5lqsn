import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('leader')
  const [password, setPassword] = useState('leader')
  const [error, setError] = useState('')

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const r = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!r.ok) throw new Error('Invalid credentials')
      const data = await r.json()
      onLogin(data)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-sm bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-semibold mb-1">Sign in</h1>
        <p className="text-sm text-slate-600 mb-6">Use the demo credentials to continue</p>
        {error && <div className='text-sm text-red-600 mb-3'>{error}</div>}
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-sm text-slate-700">Username</label>
            <input value={username} onChange={e=>setUsername(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-700">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <button className="w-full bg-blue-600 text-white rounded px-3 py-2">Continue</button>
        </form>
      </div>
    </div>
  )
}
