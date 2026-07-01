'use client'

import { useState } from 'react'
import { createUser } from '../../services/users'
import { useCurrentActor } from '../../hooks/useCurrentActor'

export default function RoleSwitcher({ role, onRoleChange }) {
  const roles = ['Customer', 'Driver', 'Admin']
  const {
    customer,
    driver,
    loginCustomer,
    loginDriver,
    logoutCustomer,
    logoutDriver,
    refresh,
  } = useCurrentActor()
  const [panel, setPanel] = useState(null)
  const [adminAuthed, setAdminAuthed] = useState(() => typeof window !== 'undefined' && localStorage.getItem('fudduAdminAuthed') === 'true')
  const [loginForm, setLoginForm] = useState({ customer: '', driver: '', admin: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '' })
  const [message, setMessage] = useState('')

  const submitLogin = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      if (panel === 'customer') {
        await loginCustomer(loginForm.customer)
        onRoleChange('customer')
      }
      if (panel === 'driver') {
        await loginDriver(loginForm.driver)
        onRoleChange('driver')
      }
      if (panel === 'admin') {
        if (loginForm.admin !== 'admin123') throw new Error('Use admin123 for local admin testing.')
        localStorage.setItem('fudduAdminAuthed', 'true')
        setAdminAuthed(true)
        onRoleChange('admin')
      }
      setPanel(null)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const registerCustomer = async (event) => {
    event.preventDefault()
    setMessage('')
    try {
      const created = await createUser({ ...registerForm, role: 'customer' })
      await refresh()
      await loginCustomer(created.email)
      onRoleChange('customer')
      setRegisterForm({ name: '', email: '', phone: '' })
      setPanel(null)
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="sticky top-0 z-[60] bg-[#171a29] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-orange-200">Fuddu Delivery</p>
          <h1 className="text-lg font-bold">Local multi-role testing</h1>
          <p className="text-xs text-gray-300">
            Customer: {customer?.name || 'Logged out'} | Rider: {driver?.name || 'Logged out'}
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="inline-flex bg-white/10 rounded-lg p-1">
            {roles.map((item) => (
              <button
                key={item}
                onClick={() => {
                  const nextRole = item.toLowerCase()
                  if (nextRole === 'customer' && !customer) return setPanel('customer')
                  if (nextRole === 'driver' && !driver) return setPanel('driver')
                  if (nextRole === 'admin' && !adminAuthed) return setPanel('admin')
                  onRoleChange(nextRole)
                }}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  role === item.toLowerCase() ? 'bg-[#ff5200] text-white shadow' : 'text-white hover:bg-white/10'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button onClick={() => setPanel('customer')} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-semibold">Customer Login</button>
          <button onClick={() => setPanel('driver')} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-semibold">Rider Login</button>
          <button onClick={() => setPanel('admin')} className="bg-white/10 hover:bg-white/20 px-3 py-2 rounded-md text-sm font-semibold">Admin Login</button>
          {(customer || driver) && (
            <button
              onClick={() => {
                logoutCustomer()
                logoutDriver()
                localStorage.removeItem('fudduAdminAuthed')
                setAdminAuthed(false)
                onRoleChange('customer')
              }}
              className="bg-red-500/80 hover:bg-red-500 px-3 py-2 rounded-md text-sm font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {panel && (
        <div className="border-t border-white/10 bg-[#202437]">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {message && <p className="mb-3 bg-red-500/20 text-red-100 rounded-md px-3 py-2 text-sm">{message}</p>}
            {panel === 'customer' && (
              <div className="grid lg:grid-cols-2 gap-4">
                <form onSubmit={submitLogin} className="bg-white/5 rounded-lg p-4">
                  <h2 className="font-bold mb-3">Customer Login</h2>
                  <input
                    value={loginForm.customer}
                    onChange={(event) => setLoginForm({ ...loginForm, customer: event.target.value })}
                    placeholder="Email or phone"
                    className="w-full text-gray-900 rounded-md px-3 py-2 mb-3"
                    required
                  />
                  <button className="bg-[#ff5200] px-4 py-2 rounded-md font-semibold">Login</button>
                </form>
                <form onSubmit={registerCustomer} className="bg-white/5 rounded-lg p-4">
                  <h2 className="font-bold mb-3">Register Customer</h2>
                  <div className="grid md:grid-cols-3 gap-2">
                    <input value={registerForm.name} onChange={(event) => setRegisterForm({ ...registerForm, name: event.target.value })} placeholder="Name" className="text-gray-900 rounded-md px-3 py-2" required />
                    <input value={registerForm.email} onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })} placeholder="Email" className="text-gray-900 rounded-md px-3 py-2" required />
                    <input value={registerForm.phone} onChange={(event) => setRegisterForm({ ...registerForm, phone: event.target.value })} placeholder="Phone" className="text-gray-900 rounded-md px-3 py-2" />
                  </div>
                  <button className="mt-3 bg-[#00A651] px-4 py-2 rounded-md font-semibold">Create account</button>
                </form>
              </div>
            )}
            {panel === 'driver' && (
              <form onSubmit={submitLogin} className="bg-white/5 rounded-lg p-4 max-w-xl">
                <h2 className="font-bold mb-3">Rider Login</h2>
                <input
                  value={loginForm.driver}
                  onChange={(event) => setLoginForm({ ...loginForm, driver: event.target.value })}
                  placeholder="Rider name or phone"
                  className="w-full text-gray-900 rounded-md px-3 py-2 mb-3"
                  required
                />
                <button className="bg-[#ff5200] px-4 py-2 rounded-md font-semibold">Login as rider</button>
              </form>
            )}
            {panel === 'admin' && (
              <form onSubmit={submitLogin} className="bg-white/5 rounded-lg p-4 max-w-xl">
                <h2 className="font-bold mb-3">Admin Login</h2>
                <input
                  value={loginForm.admin}
                  onChange={(event) => setLoginForm({ ...loginForm, admin: event.target.value })}
                  placeholder="Local admin PIN"
                  type="password"
                  className="w-full text-gray-900 rounded-md px-3 py-2 mb-3"
                  required
                />
                <button className="bg-[#ff5200] px-4 py-2 rounded-md font-semibold">Login admin</button>
                <span className="ml-3 text-xs text-gray-300">Demo PIN: admin123</span>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
