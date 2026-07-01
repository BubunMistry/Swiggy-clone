'use client'

import { useEffect, useMemo, useState } from 'react'
import { MdAssignmentInd, MdRestaurant, MdShoppingBag, MdTwoWheeler } from 'react-icons/md'
import { supabase } from '../../lib/supabaseClient'
import { ORDER_STATUSES } from '../../lib/mockActors'
import { useOrders } from '../../hooks/useOrders'
import { useRestaurants } from '../../hooks/useRestaurants'
import { requestDriverAssignment, updateOrderStatus } from '../../services/orders'
import { getAvailableDrivers, getDrivers } from '../../services/drivers'
import { ListSkeleton } from '../components/Skeleton'

export default function AdminDashboard() {
  const { orders, loading, error, refresh } = useOrders()
  const { restaurants, setRestaurants } = useRestaurants()
  const [drivers, setDrivers] = useState([])
  const [availableDrivers, setAvailableDrivers] = useState([])
  const [users, setUsers] = useState([])
  const [expandedOrderId, setExpandedOrderId] = useState(null)
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    image: '/assets/restaurants/burgerking.jpg',
    delivery_time: '30 mins',
    cuisine: '',
    cost_for_two: 300,
    rating: 4.2,
    latitude: 22.5726,
    longitude: 88.3639,
  })
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    image: '/assets/menu/item1.jpg',
    description: '',
    is_veg: true,
  })

  useEffect(() => {
    getDrivers().then(setDrivers)
    getAvailableDrivers().then(setAvailableDrivers)
    supabase.from('users').select('*').order('created_at', { ascending: true }).then(({ data }) => setUsers(data || []))
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        refresh()
        getDrivers().then(setDrivers)
        getAvailableDrivers().then(setAvailableDrivers)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_assignments' }, refresh)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations' }, refresh)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [refresh])

  const stats = useMemo(() => {
    const delivered = orders.filter((order) => order.status === 'delivered')
    return {
      totalOrders: orders.length,
      activeOrders: orders.filter((order) => !['delivered', 'cancelled'].includes(order.status)).length,
      totalRestaurants: restaurants.length,
      totalDrivers: drivers.length,
      revenue: delivered.reduce((sum, order) => sum + Number(order.total || 0), 0),
      deliveredOrders: delivered.length,
    }
  }, [orders, restaurants, drivers])

  const addRestaurant = async (event) => {
    event.preventDefault()
    const { data, error: addError } = await supabase
      .from('restaurants')
      .insert({
        ...newRestaurant,
        is_active: true,
      })
      .select('*, menu_items(*)')
      .single()

    if (!addError) {
      if (newMenuItem.name && newMenuItem.price) {
        await supabase.from('menu_items').insert({
          restaurant_id: data.id,
          name: newMenuItem.name,
          price: Number(newMenuItem.price),
          image: newMenuItem.image,
          description: newMenuItem.description,
          is_veg: newMenuItem.is_veg,
          add_ons: [],
          is_available: true,
        })
      }
      setRestaurants((current) => [{ ...data, dbId: data.id, deliveryTime: data.delivery_time, menuItems: [] }, ...current])
      setNewRestaurant({ name: '', address: '', image: '/assets/restaurants/burgerking.jpg', delivery_time: '30 mins', cuisine: '', cost_for_two: 300, rating: 4.2, latitude: 22.5726, longitude: 88.3639 })
      setNewMenuItem({ name: '', price: '', image: '/assets/menu/item1.jpg', description: '', is_veg: true })
      refresh()
    }
  }

  const requestRider = async (orderId, driverId) => {
    await requestDriverAssignment(orderId, driverId)
    await Promise.all([refresh(), getDrivers().then(setDrivers), getAvailableDrivers().then(setAvailableDrivers)])
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Superpower Dashboard</h1>
          <p className="text-gray-600">All restaurants, orders, drivers, assignments, and status controls.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-8">
          {[
            ['Total Orders', stats.totalOrders, MdShoppingBag],
            ['Active Orders', stats.activeOrders, MdAssignmentInd],
            ['Restaurants', stats.totalRestaurants, MdRestaurant],
            ['Drivers', stats.totalDrivers, MdTwoWheeler],
            ['Revenue', `Rs ${stats.revenue}`, MdShoppingBag],
            ['Delivered', stats.deliveredOrders, MdAssignmentInd],
          ].map(([label, value, Icon]) => (
            <div key={label} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <Icon className="text-[#ff5200] mb-2" size={24} />
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-5">
            <h2 className="text-xl font-bold text-gray-800 mb-4">All orders</h2>
            {loading && <ListSkeleton count={4} />}
            {error && <p className="text-red-600">Could not load orders: {error.message}</p>}
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#ff5200]">{order.order_number}</p>
                      <h3 className="font-bold text-gray-900">{order.restaurant?.name || 'Restaurant'}</h3>
                      <p className="text-sm text-gray-600">{order.delivery_address?.address || 'No address'} | Rs {order.total}</p>
                      <p className="text-sm text-gray-500">Accepted rider: {order.driver?.name || 'Not accepted yet'}</p>
                      {order.delivery_assignments?.filter((assignment) => assignment.status === 'assigned').map((assignment) => (
                        <p key={assignment.id} className="text-xs text-blue-600 mt-1">Pending rider request: {assignment.driver?.name}</p>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={order.status}
                        onChange={(event) => updateOrderStatus(order.id, event.target.value, 'Admin changed status').then(refresh)}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                        disabled={Boolean(order.driver_id) || !['accepted', 'preparing'].includes(order.status)}
                        className="bg-[#ff5200] text-white rounded-lg px-3 py-2 text-sm font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Find available riders
                      </button>
                    </div>
                  </div>
                  {expandedOrderId === order.id && (
                    <div className="mt-4 border-t border-gray-100 pt-4">
                      <h4 className="font-bold text-gray-800 mb-2">Available riders</h4>
                      {availableDrivers.length === 0 ? (
                        <p className="text-sm text-gray-500">No free riders right now.</p>
                      ) : (
                        <div className="grid md:grid-cols-2 gap-2">
                          {availableDrivers.map((driver) => (
                            <button
                              key={driver.id}
                              onClick={() => requestRider(order.id, driver.id)}
                              className="text-left border border-gray-200 rounded-lg p-3 hover:border-[#ff5200] hover:bg-orange-50"
                            >
                              <p className="font-bold text-gray-800">{driver.name}</p>
                              <p className="text-xs text-gray-500">{driver.phone} | {driver.vehicle_number}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {!loading && orders.length === 0 && <p className="text-gray-500">No orders yet.</p>}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Riders</h2>
              <div className="max-h-64 overflow-auto space-y-3">
                {drivers.map((driver) => (
                  <div key={driver.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-gray-800">{driver.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${driver.current_status === 'available' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{driver.current_status}</span>
                    </div>
                    <p className="text-xs text-gray-500">{driver.vehicle_number}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Restaurants</h2>
              <div className="max-h-80 overflow-auto space-y-3">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.dbId || restaurant.id} className="border border-gray-100 rounded-lg p-3">
                    <p className="font-bold text-gray-800">{restaurant.name}</p>
                    <p className="text-xs text-gray-500">{restaurant.deliveryTime || restaurant.delivery_time} | {restaurant.rating}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Customers and users</h2>
              <div className="max-h-64 overflow-auto space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-bold text-gray-800">{user.name}</p>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{user.role}</span>
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-500">{user.phone}</p>
                  </div>
                ))}
                {users.length === 0 && <p className="text-sm text-gray-500">Seed users will appear here after running the seed script.</p>}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add restaurant</h2>
              <form onSubmit={addRestaurant} className="space-y-3">
                <input
                  value={newRestaurant.name}
                  onChange={(event) => setNewRestaurant({ ...newRestaurant, name: event.target.value })}
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input
                  value={newRestaurant.address}
                  onChange={(event) => setNewRestaurant({ ...newRestaurant, address: event.target.value })}
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <input value={newRestaurant.image} onChange={(event) => setNewRestaurant({ ...newRestaurant, image: event.target.value })} placeholder="Restaurant image path" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                <input value={newRestaurant.cuisine} onChange={(event) => setNewRestaurant({ ...newRestaurant, cuisine: event.target.value })} placeholder="Cuisine" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                <div className="grid grid-cols-2 gap-2">
                  <input value={newRestaurant.delivery_time} onChange={(event) => setNewRestaurant({ ...newRestaurant, delivery_time: event.target.value })} placeholder="Delivery time" className="border border-gray-300 rounded-lg px-3 py-2" required />
                  <input type="number" value={newRestaurant.cost_for_two} onChange={(event) => setNewRestaurant({ ...newRestaurant, cost_for_two: Number(event.target.value) })} placeholder="Cost for two" className="border border-gray-300 rounded-lg px-3 py-2" required />
                  <input type="number" step="0.1" value={newRestaurant.rating} onChange={(event) => setNewRestaurant({ ...newRestaurant, rating: Number(event.target.value) })} placeholder="Rating" className="border border-gray-300 rounded-lg px-3 py-2" required />
                  <input type="number" step="0.0001" value={newRestaurant.latitude} onChange={(event) => setNewRestaurant({ ...newRestaurant, latitude: Number(event.target.value) })} placeholder="Latitude" className="border border-gray-300 rounded-lg px-3 py-2" required />
                  <input type="number" step="0.0001" value={newRestaurant.longitude} onChange={(event) => setNewRestaurant({ ...newRestaurant, longitude: Number(event.target.value) })} placeholder="Longitude" className="border border-gray-300 rounded-lg px-3 py-2" required />
                </div>
                <div className="border-t pt-3 space-y-2">
                  <p className="text-sm font-bold text-gray-700">First menu item</p>
                  <input value={newMenuItem.name} onChange={(event) => setNewMenuItem({ ...newMenuItem, name: event.target.value })} placeholder="Dish name" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                  <input type="number" value={newMenuItem.price} onChange={(event) => setNewMenuItem({ ...newMenuItem, price: event.target.value })} placeholder="Price" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                  <input value={newMenuItem.image} onChange={(event) => setNewMenuItem({ ...newMenuItem, image: event.target.value })} placeholder="Dish image path" className="w-full border border-gray-300 rounded-lg px-3 py-2" required />
                  <textarea value={newMenuItem.description} onChange={(event) => setNewMenuItem({ ...newMenuItem, description: event.target.value })} placeholder="Description" className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                </div>
                <button className="w-full btn-orange">Add</button>
              </form>
            </section>
          </aside>
        </div>
      </div>
    </main>
  )
}
