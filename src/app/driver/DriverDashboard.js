'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MdCheckCircle, MdDeliveryDining, MdMyLocation, MdPlayArrow, MdStop } from 'react-icons/md'
import { useCurrentActor } from '../../hooks/useCurrentActor'
import { updateDriverLocation } from '../../services/drivers'
import { acceptOpenOrder, getDriverAssignments, getOpenDeliveryOrders, respondToAssignment, updateOrderStatus } from '../../services/orders'
import { ListSkeleton } from '../components/Skeleton'

const nextStatuses = ['picked_up', 'on_the_way', 'delivered']

export default function DriverDashboard() {
  const { driver } = useCurrentActor()
  const [assignments, setAssignments] = useState([])
  const [openOrders, setOpenOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [simulatingOrderId, setSimulatingOrderId] = useState(null)
  const movementRef = useRef(null)

  const loadAssignments = useCallback(() => {
    if (!driver?.id) return
    setLoading(true)
    Promise.all([getDriverAssignments(driver.id), getOpenDeliveryOrders()])
      .then(([assignmentRows, openRows]) => {
        setAssignments(assignmentRows)
        setOpenOrders(openRows)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }, [driver?.id])

  useEffect(() => {
    loadAssignments()
    return () => {
      if (movementRef.current) clearInterval(movementRef.current)
    }
  }, [loadAssignments])

  const reply = async (assignment, accept) => {
    await respondToAssignment(assignment.id, accept)
    loadAssignments()
  }

  const setStatus = async (order, status) => {
    await updateOrderStatus(order.id, status, `Driver updated order to ${status}`)
    loadAssignments()
  }

  const acceptOpen = async (order) => {
    await acceptOpenOrder(order.id, driver.id)
    loadAssignments()
  }

  const toggleMovement = async (order) => {
    if (movementRef.current) {
      clearInterval(movementRef.current)
      movementRef.current = null
      setSimulatingOrderId(null)
      return
    }

    setSimulatingOrderId(order.id)
    let step = 0
    movementRef.current = setInterval(async () => {
      step += 1
      await updateDriverLocation({
        driverId: driver.id,
        orderId: order.id,
        latitude: 22.5726 + step * 0.0018,
        longitude: 88.3639 + step * 0.0015,
        heading: (step * 18) % 360,
      })
    }, 2500)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#ff5200] text-white flex items-center justify-center">
            <MdDeliveryDining size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600">Logged in as {driver?.name || 'No rider selected'}.</p>
          </div>
        </div>

        {loading && <ListSkeleton count={3} />}
        {error && <p className="text-red-600">Could not load driver orders: {error.message}</p>}
        {!loading && assignments.length === 0 && openOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            No pending or active delivery requests for this rider.
          </div>
        )}

        <div className="space-y-4">
          {openOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-orange-100 p-5">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-50 text-[#ff5200] px-3 py-1 rounded-full text-xs font-bold">{order.order_number}</span>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Open order</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{order.restaurant?.name || 'Restaurant'}</h2>
                  <p className="text-gray-600">{order.delivery_address?.address}, {order.delivery_address?.city}</p>
                  <p className="text-sm text-gray-500 mt-1">Total: Rs {order.total}</p>
                </div>
                <button onClick={() => acceptOpen(order)} className="px-4 py-2 rounded-lg bg-[#00A651] text-white text-sm font-semibold">
                  Accept delivery
                </button>
              </div>
            </div>
          ))}
          {assignments.map((assignment) => {
            const order = assignment.order
            const isPending = assignment.status === 'assigned' && !order.driver_id
            return (
              <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-orange-50 text-[#ff5200] px-3 py-1 rounded-full text-xs font-bold">{order.order_number}</span>
                      <span className="bg-green-50 text-[#00A651] px-3 py-1 rounded-full text-xs font-bold capitalize">{order.status.replaceAll('_', ' ')}</span>
                      {isPending && <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Request</span>}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{order.restaurant?.name || 'Restaurant'}</h2>
                    <p className="text-gray-600">{order.delivery_address?.address}, {order.delivery_address?.city}</p>
                    <p className="text-sm text-gray-500 mt-1">Total: Rs {order.total}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {isPending ? (
                      <>
                        <button onClick={() => reply(assignment, true)} className="px-3 py-2 rounded-lg bg-[#00A651] text-white text-sm font-semibold">Accept</button>
                        <button onClick={() => reply(assignment, false)} className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold">Reject</button>
                      </>
                    ) : (
                      nextStatuses.map((status) => (
                        <button
                          key={status}
                          onClick={() => setStatus(order, status)}
                          disabled={order.status === 'delivered'}
                          className="px-3 py-2 rounded-lg border border-gray-300 hover:border-[#ff5200] hover:text-[#ff5200] text-sm font-semibold disabled:opacity-50"
                        >
                          {status.replaceAll('_', ' ')}
                        </button>
                      ))
                    )}
                    <button
                      onClick={() => toggleMovement(order)}
                      disabled={isPending}
                      className={`px-3 py-2 rounded-lg text-white text-sm font-semibold flex items-center gap-1 ${
                        simulatingOrderId === order.id ? 'bg-gray-800' : 'bg-[#00A651]'
                      } disabled:bg-gray-300`}
                    >
                      {simulatingOrderId === order.id ? <MdStop /> : <MdPlayArrow />}
                      {simulatingOrderId === order.id ? 'Stop Movement' : 'Simulate Movement'}
                    </button>
                    <button
                      onClick={() => updateDriverLocation({ driverId: driver.id, orderId: order.id, latitude: 22.5726, longitude: 88.3639 })}
                      disabled={isPending}
                      className="px-3 py-2 rounded-lg bg-orange-50 text-[#ff5200] text-sm font-semibold flex items-center gap-1 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <MdMyLocation />
                      Share location
                    </button>
                  </div>
                </div>
                {order.status === 'delivered' && (
                  <p className="mt-4 text-[#00A651] flex items-center gap-1 font-semibold"><MdCheckCircle /> Delivered successfully</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
