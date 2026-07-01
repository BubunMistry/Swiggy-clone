'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { MdClose, MdDelete, MdEdit, MdLocationOn, MdReceiptLong, MdSave } from 'react-icons/md'
import { useCurrentActor } from '../../hooks/useCurrentActor'
import { ListSkeleton } from '../components/Skeleton'
import { getCustomerOrders } from '../../services/orders'
import { deleteUser, deleteUserAddress, getUserAddresses, updateUser, upsertUserAddress } from '../../services/users'

const emptyAddress = { label: 'Home', address: '', city: '', pincode: '', phone: '', latitude: '22.5726', longitude: '88.3639' }

export default function Profile() {
  const { customer, refresh } = useCurrentActor()
  const [activeMenu, setActiveMenu] = useState('orders')
  const [profileData, setProfileData] = useState({ name: '', email: '', phone: '', avatar_url: '' })
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [addressForm, setAddressForm] = useState(emptyAddress)
  const [message, setMessage] = useState('')

  const loadData = useCallback(async () => {
    if (!customer?.id) return
    setLoading(true)
    setProfileData({ name: customer.name || '', email: customer.email || '', phone: customer.phone || '', avatar_url: customer.avatar_url || '' })
    const [addressRows, orderRows] = await Promise.all([
      getUserAddresses(customer.id),
      getCustomerOrders(customer.id),
    ])
    setAddresses(addressRows)
    setOrders(orderRows)
    setLoading(false)
  }, [customer])

  useEffect(() => {
    loadData().catch((error) => {
      setMessage(error.message)
      setLoading(false)
    })
  }, [loadData])

  const saveProfile = async () => {
    try {
      await updateUser(customer.id, profileData)
      await refresh()
      setEditingProfile(false)
      setMessage('Profile updated in Supabase.')
    } catch (error) {
      setMessage(`Profile image needs the latest schema.sql avatar_url column. ${error.message}`)
    }
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setProfileData((current) => ({ ...current, avatar_url: reader.result }))
    reader.readAsDataURL(file)
  }

  const removeCurrentUser = async () => {
    if (!confirm('Delete this customer from Supabase?')) return
    await deleteUser(customer.id)
    await refresh()
    setMessage('Customer deleted. Choose another customer from the top switcher.')
  }

  const editAddress = (address = null) => {
    setEditingAddress(address?.id || 'new')
    setAddressForm(address || emptyAddress)
  }

  const saveAddress = async () => {
    try {
      await upsertUserAddress({ ...addressForm, id: editingAddress === 'new' ? undefined : editingAddress, user_id: customer.id })
      setEditingAddress(null)
      setAddressForm(emptyAddress)
      await loadData()
      setMessage('Address saved in Supabase.')
    } catch (error) {
      setMessage(`Address table is not ready yet. Run the updated supabase/schema.sql once. ${error.message}`)
    }
  }

  const removeAddress = async (id) => {
    try {
      await deleteUserAddress(id)
      await loadData()
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <div className="container mx-auto pb-10 mt-8 px-6">
      {message && <div className="mb-4 bg-orange-50 text-[#ff5200] rounded-lg p-3 text-sm">{message}</div>}

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {loading ? (
          <ListSkeleton count={1} />
        ) : !editingProfile ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profileData.avatar_url || '/assets/logo/user-avatar.png'} alt="User Avatar" width={96} height={96} className="rounded-full object-cover w-24 h-24" />
              <div className="ml-6">
                <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-gray-600">{profileData.phone}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingProfile(true)} className="btn-orange flex items-center gap-2"><MdEdit /> Edit</button>
              <button onClick={removeCurrentUser} className="border border-red-300 text-red-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2"><MdDelete /> Delete</button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            <input value={profileData.name} onChange={(event) => setProfileData({ ...profileData, name: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Name" />
            <input value={profileData.email} onChange={(event) => setProfileData({ ...profileData, email: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Email" />
            <input value={profileData.phone} onChange={(event) => setProfileData({ ...profileData, phone: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Phone" />
            <label className="md:col-span-3 border border-dashed border-gray-300 rounded-lg px-3 py-3 cursor-pointer hover:bg-gray-50">
              <span className="font-semibold text-gray-700">Upload profile image</span>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
            <div className="md:col-span-3 flex gap-2">
              <button onClick={saveProfile} className="btn-orange flex items-center gap-2"><MdSave /> Save</button>
              <button onClick={() => setEditingProfile(false)} className="border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2"><MdClose /> Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="bg-white shadow-md rounded-lg p-4">
          {[
            ['orders', MdReceiptLong, 'Orders'],
            ['addresses', MdLocationOn, 'Addresses'],
          ].map(([id, Icon, label]) => (
            <button key={id} onClick={() => setActiveMenu(id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg font-semibold ${activeMenu === id ? 'bg-orange-50 text-[#ff5200]' : 'text-gray-700 hover:bg-gray-50'}`}>
              <Icon size={22} />
              {label}
            </button>
          ))}
        </aside>

        <section className="lg:col-span-3 bg-white shadow-md rounded-lg p-6">
          {activeMenu === 'orders' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Orders</h2>
              {loading ? <ListSkeleton count={4} /> : orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No orders yet.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-5">
                      <div className="flex items-start gap-4">
                        <Image src={order.restaurant?.image || '/assets/restaurants/burgerking.jpg'} alt={order.restaurant?.name || 'Restaurant'} width={96} height={96} className="rounded-lg object-cover" />
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-800">{order.restaurant?.name || 'Restaurant'}</h3>
                              <p className="text-xs text-gray-400">ORDER {order.order_number} | {new Date(order.created_at).toLocaleString()}</p>
                              <p className="text-sm text-gray-500 mt-1">Rider: {order.driver?.name || 'Not assigned yet'}</p>
                            </div>
                            <span className="self-start bg-green-50 text-[#00A651] px-3 py-1 rounded-full text-sm font-semibold capitalize">{order.status.replaceAll('_', ' ')}</span>
                          </div>
                          <div className="mt-3 border-t pt-3">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.item_name} x{item.quantity}</span>
                                <span>Rs {item.line_total}</span>
                              </div>
                            ))}
                            <div className="flex justify-between mt-3 pt-3 border-t font-bold">
                              <span>Total Paid</span>
                              <span className="text-[#ff5200]">Rs {order.total}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'addresses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Addresses</h2>
                <button onClick={() => editAddress()} className="btn-orange">Add Address</button>
              </div>
              {editingAddress && (
                <div className="bg-gray-50 border rounded-lg p-4 mb-4 grid md:grid-cols-2 gap-3">
                  <input value={addressForm.label} onChange={(event) => setAddressForm({ ...addressForm, label: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Label" />
                  <input value={addressForm.phone || ''} onChange={(event) => setAddressForm({ ...addressForm, phone: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Phone" />
                  <input value={addressForm.address} onChange={(event) => setAddressForm({ ...addressForm, address: event.target.value })} className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Address" />
                  <input value={addressForm.city || ''} onChange={(event) => setAddressForm({ ...addressForm, city: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="City" />
                  <input value={addressForm.pincode || ''} onChange={(event) => setAddressForm({ ...addressForm, pincode: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Pincode" />
                  <input value={addressForm.latitude || ''} onChange={(event) => setAddressForm({ ...addressForm, latitude: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Latitude" />
                  <input value={addressForm.longitude || ''} onChange={(event) => setAddressForm({ ...addressForm, longitude: event.target.value })} className="border rounded-lg px-3 py-2" placeholder="Longitude" />
                  <div className="md:col-span-2 flex gap-2">
                    <button onClick={saveAddress} className="btn-orange">Save Address</button>
                    <button onClick={() => setEditingAddress(null)} className="border rounded-lg px-4 py-2">Cancel</button>
                  </div>
                </div>
              )}
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4 flex justify-between gap-4">
                    <div>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">{address.label}</span>
                      <p className="mt-2 font-medium text-gray-800">{address.address}</p>
                      <p className="text-sm text-gray-600">{address.city} - {address.pincode}</p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                      <p className="text-xs text-gray-500">{Number(address.latitude).toFixed(5)}, {Number(address.longitude).toFixed(5)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => editAddress(address)} className="text-[#ff5200]"><MdEdit size={22} /></button>
                      <button onClick={() => removeAddress(address.id)} className="text-red-600"><MdDelete size={22} /></button>
                    </div>
                  </div>
                ))}
                {!loading && addresses.length === 0 && <p className="text-gray-500">No saved addresses yet.</p>}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
