'use client'

import { MdDeliveryDining, MdHome, MdLocationOn, MdRestaurant } from 'react-icons/md'
import { useDriverLocation } from '../../hooks/useDriverLocation'

const statusIndex = {
  placed: 0,
  accepted: 1,
  preparing: 2,
  picked_up: 3,
  on_the_way: 4,
  delivered: 5,
  cancelled: 0,
}

function toPoint(latitude, longitude, fallback) {
  const lat = Number(latitude)
  const lng = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return fallback
  return { lat, lng }
}

function project(point, bounds) {
  const x = ((point.lng - bounds.minLng) / (bounds.maxLng - bounds.minLng || 1)) * 76 + 12
  const y = 88 - (((point.lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * 70 + 10)
  return { x: Math.max(8, Math.min(92, x)), y: Math.max(10, Math.min(88, y)) }
}

export default function DeliveryTracker({ order }) {
  const { location } = useDriverLocation(order?.driver_id)
  const restaurant = toPoint(order?.restaurant?.latitude, order?.restaurant?.longitude, { lat: 22.5726, lng: 88.3639 })
  const destination = toPoint(order?.delivery_address?.latitude, order?.delivery_address?.longitude, { lat: 22.585, lng: 88.39 })
  const liveBike = location
    ? toPoint(location.latitude, location.longitude, restaurant)
    : {
        lat: restaurant.lat + (destination.lat - restaurant.lat) * ((statusIndex[order?.status] ?? 0) / 5),
        lng: restaurant.lng + (destination.lng - restaurant.lng) * ((statusIndex[order?.status] ?? 0) / 5),
      }

  const bounds = {
    minLat: Math.min(restaurant.lat, destination.lat, liveBike.lat) - 0.01,
    maxLat: Math.max(restaurant.lat, destination.lat, liveBike.lat) + 0.01,
    minLng: Math.min(restaurant.lng, destination.lng, liveBike.lng) - 0.01,
    maxLng: Math.max(restaurant.lng, destination.lng, liveBike.lng) + 0.01,
  }
  const r = project(restaurant, bounds)
  const d = project(destination, bounds)
  const b = project(liveBike, bounds)

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Live delivery route</h2>
          <p className="text-sm text-gray-500">Restaurant to your saved delivery location.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-orange-50 text-[#ff5200] text-sm font-bold capitalize">
          {order?.status?.replaceAll('_', ' ')}
        </span>
      </div>

      <div className="relative h-72 rounded-lg bg-[#eef7f0] border border-gray-200 overflow-hidden">
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: 'linear-gradient(#d7eadc 1px, transparent 1px), linear-gradient(90deg, #d7eadc 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={`M ${r.x} ${r.y} C ${(r.x + b.x) / 2} ${r.y - 12}, ${(b.x + d.x) / 2} ${d.y + 12}, ${d.x} ${d.y}`} fill="none" stroke="#ff5200" strokeWidth="1.6" strokeDasharray="3 2" />
          <path d={`M ${r.x} ${r.y} C ${(r.x + b.x) / 2} ${r.y - 12}, ${(b.x + d.x) / 2} ${d.y + 12}, ${b.x} ${b.y}`} fill="none" stroke="#00A651" strokeWidth="2.4" />
        </svg>

        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${r.x}%`, top: `${r.y}%` }}>
          <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-orange-100">
            <MdRestaurant className="text-[#ff5200]" size={24} />
          </div>
          <p className="text-xs font-semibold mt-1 bg-white/80 rounded px-1">{order?.restaurant?.name || 'Restaurant'}</p>
        </div>

        <div className="absolute -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: `${d.x}%`, top: `${d.y}%` }}>
          <div className="w-11 h-11 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-green-100">
            <MdHome className="text-[#00A651]" size={24} />
          </div>
          <p className="text-xs font-semibold mt-1 bg-white/80 rounded px-1">Delivery</p>
        </div>

        <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
          <div className="w-12 h-12 rounded-full bg-[#171a29] text-white shadow-xl flex items-center justify-center border-2 border-white">
            <MdDeliveryDining size={30} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500">Assigned driver</p>
          <p className="font-bold text-gray-800">{order?.driver?.name || 'Waiting for rider'}</p>
          <p className="text-gray-600">{order?.driver?.phone || 'Available riders can accept this order'}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-gray-500 flex items-center gap-1"><MdLocationOn /> Latest bike location</p>
          <p className="font-bold text-gray-800">
            {location ? `${Number(location.latitude).toFixed(5)}, ${Number(location.longitude).toFixed(5)}` : 'Using order progress until rider shares live location'}
          </p>
          <p className="text-gray-600">{location?.updated_at ? new Date(location.updated_at).toLocaleTimeString() : 'Open Driver view and simulate movement'}</p>
        </div>
      </div>
    </div>
  )
}
