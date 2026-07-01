import { supabase } from '../lib/supabaseClient'
import { MOCK_ADMIN_ID, MOCK_CUSTOMER_ID } from '../lib/mockActors'

export function orderSelect() {
  return `
    *,
    restaurant:restaurants(*),
    driver:drivers(*),
    order_items(*, menu_item:menu_items(*)),
    delivery_assignments(*, driver:drivers(*))
  `
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect())
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect())
    .eq('id', orderId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getCustomerOrders(customerId = MOCK_CUSTOMER_ID) {
  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect())
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getDriverAssignments(driverId) {
  const { data, error } = await supabase
    .from('delivery_assignments')
    .select('*, order:orders(*, restaurant:restaurants(*), order_items(*, menu_item:menu_items(*)))')
    .eq('driver_id', driverId)
    .in('status', ['assigned', 'accepted', 'picked_up', 'on_the_way'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getOpenDeliveryOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select(orderSelect())
    .is('driver_id', null)
    .in('status', ['placed', 'accepted', 'preparing'])
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function acceptOpenOrder(orderId, driverId) {
  const { data: driver, error: driverError } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()

  if (driverError) throw driverError
  if (driver.current_status !== 'available') throw new Error('You are already busy with another order.')

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .update({ driver_id: driverId, status: 'accepted' })
    .eq('id', orderId)
    .is('driver_id', null)
    .select()
    .single()

  if (orderError) throw orderError

  const { error: assignmentError } = await supabase.from('delivery_assignments').upsert({
    order_id: orderId,
    driver_id: driverId,
    status: 'accepted',
    accepted_at: new Date().toISOString(),
  }, { onConflict: 'order_id,driver_id' })
  if (assignmentError) throw assignmentError

  await supabase.from('drivers').update({ current_status: 'assigned' }).eq('id', driverId)
  await logOrderStatus(orderId, 'accepted', 'Rider accepted open delivery')
  return order
}

export async function placeOrder({ customerId = MOCK_CUSTOMER_ID, restaurant, items, address, paymentMethod, totals, notes }) {
  const orderNumber = `FUD${Date.now()}`
  const restaurantDbId = restaurant?.dbId || restaurant?.id

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      restaurant_id: restaurantDbId,
      status: 'placed',
      payment_method: paymentMethod,
      subtotal: totals.itemTotal,
      delivery_fee: totals.deliveryFee,
      gst: totals.gst,
      platform_fee: totals.platformFee,
      discount: totals.discount,
      total: totals.finalTotal,
      delivery_address: address,
      notes,
    })
    .select()
    .single()

  if (orderError) throw orderError

  const orderItems = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.dbId || null,
    item_name: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    add_ons: item.selectedAddOns || [],
    line_total: item.itemTotal,
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  await logOrderStatus(order.id, 'placed', 'Order placed by customer')

  return getOrderById(order.id)
}

export async function updateOrderStatus(orderId, status, note = '') {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId)
    .select(orderSelect())
    .single()

  if (error) throw error
  await logOrderStatus(orderId, status, note || `Status changed to ${status}`)

  if (status === 'delivered') {
    await supabase.from('delivery_assignments').update({
      status: 'delivered',
      completed_at: new Date().toISOString(),
    }).eq('order_id', orderId)

    if (data.driver_id) {
      await supabase.from('drivers').update({ current_status: 'available' }).eq('id', data.driver_id)
    }
  }

  if (status === 'picked_up' || status === 'on_the_way') {
    await supabase.from('delivery_assignments').update({ status }).eq('order_id', orderId).eq('driver_id', data.driver_id)
    if (data.driver_id) {
      await supabase.from('drivers').update({ current_status: 'delivering' }).eq('id', data.driver_id)
    }
  }

  return data
}

export async function requestDriverAssignment(orderId, driverId) {
  const { data: driver, error: driverError } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', driverId)
    .single()

  if (driverError) throw driverError
  if (driver.current_status !== 'available') {
    throw new Error(`${driver.name} is not available for a new order.`)
  }

  const { data: order, error: orderReadError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()

  if (orderReadError) throw orderReadError
  if (order.driver_id) throw new Error('This order already has an accepted rider.')
  if (!['accepted', 'preparing'].includes(order.status)) {
    throw new Error('Accept the restaurant order before requesting a rider.')
  }

  await supabase
    .from('delivery_assignments')
    .delete()
    .eq('order_id', orderId)
    .in('status', ['assigned'])

  const { error: assignmentError } = await supabase.from('delivery_assignments').upsert({
    order_id: orderId,
    driver_id: driverId,
    status: 'assigned',
  }, { onConflict: 'order_id,driver_id' })

  if (assignmentError) throw assignmentError
  return getOrderById(orderId)
}

export async function respondToAssignment(assignmentId, accept) {
  const { data: assignment, error: assignmentReadError } = await supabase
    .from('delivery_assignments')
    .select('*, order:orders(*)')
    .eq('id', assignmentId)
    .single()

  if (assignmentReadError) throw assignmentReadError
  if (!accept) {
    const { error } = await supabase
      .from('delivery_assignments')
      .update({ status: 'cancelled' })
      .eq('id', assignmentId)
    if (error) throw error
    return assignment
  }

  const { data: driver, error: driverError } = await supabase
    .from('drivers')
    .select('*')
    .eq('id', assignment.driver_id)
    .single()

  if (driverError) throw driverError
  if (driver.current_status !== 'available') throw new Error('You are already busy with another order.')

  const { error: orderError } = await supabase
    .from('orders')
    .update({ driver_id: assignment.driver_id })
    .eq('id', assignment.order_id)
    .is('driver_id', null)

  if (orderError) throw orderError

  const { error: assignmentError } = await supabase
    .from('delivery_assignments')
    .update({ status: 'accepted', accepted_at: new Date().toISOString() })
    .eq('id', assignmentId)

  if (assignmentError) throw assignmentError

  const { error: driverStatusError } = await supabase
    .from('drivers')
    .update({ current_status: 'assigned' })
    .eq('id', assignment.driver_id)

  if (driverStatusError) throw driverStatusError
  await logOrderStatus(assignment.order_id, 'accepted', 'Rider accepted delivery')
  return getOrderById(assignment.order_id)
}

export async function logOrderStatus(orderId, status, note) {
  const { error } = await supabase.from('order_status_logs').insert({
    order_id: orderId,
    status,
    note,
    created_by: MOCK_ADMIN_ID,
  })

  if (error) throw error
}
