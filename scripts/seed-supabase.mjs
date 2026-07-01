/**
 * Seed Fuddu Delivery data into Supabase from the existing JSON file.
 *
 * Run after applying supabase/schema.sql in the Supabase SQL editor:
 *   npm run seed:supabase
 *
 * The script uses NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY
 * or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY from .env.local. The schema's local
 * development RLS policies allow the publishable key to work for this project.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const envPath = path.join(root, '.env.local')
const jsonPath = path.join(root, 'public', 'data', 'restaurants.json')

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...valueParts] = line.split('=')
        return [key, valueParts.join('=').replace(/^["']|["']$/g, '')]
      })
  )
}

function inferCategory(itemName) {
  const name = itemName.toLowerCase()
  if (name.includes('pizza') || name.includes('garlic bread')) return 'Pizza'
  if (name.includes('burger') || name.includes('fries')) return 'Burgers'
  if (name.includes('cake') || name.includes('brownie') || name.includes('muffin')) return 'Desserts'
  if (name.includes('momo') || name.includes('noodle') || name.includes('fried rice')) return 'Chinese'
  if (name.includes('shawarma') || name.includes('kebab') || name.includes('hummus')) return 'Middle Eastern'
  if (name.includes('kulfi') || name.includes('lassi') || name.includes('rasgulla')) return 'Sweets'
  return 'Fast Food'
}

function isVeg(itemName) {
  const name = itemName.toLowerCase()
  return ['veg', 'fries', 'coke', 'cake', 'muffin', 'brownie', 'falafel', 'hummus', 'jalebi', 'lassi', 'kulfi', 'pista', 'pasta', 'garlic bread', 'salad'].some((word) => name.includes(word))
}

function throwSetupError(error) {
  if (error?.code === 'PGRST205' || error?.message?.includes('schema cache')) {
    throw new Error(`Supabase tables are missing. First open Supabase SQL Editor, run supabase/schema.sql, then run npm run seed:supabase again. Original error: ${error.message}`)
  }
  throw error
}

const env = parseEnv(await fs.readFile(envPath, 'utf8'))
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase URL/key in .env.local')
}

const supabase = createClient(supabaseUrl, supabaseKey)
const restaurants = JSON.parse(await fs.readFile(jsonPath, 'utf8'))

const demoCustomers = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Bubun Customer', email: 'customer@fuddudelivery.local', phone: '+91 9876543210', role: 'customer' },
  { id: '11111111-1111-4111-8111-111111111112', name: 'Ananya Sen', email: 'ananya@fuddudelivery.local', phone: '+91 9876500001', role: 'customer' },
  { id: '11111111-1111-4111-8111-111111111113', name: 'Rahul Das', email: 'rahul@fuddudelivery.local', phone: '+91 9876500002', role: 'customer' },
  { id: '11111111-1111-4111-8111-111111111114', name: 'Mira Roy', email: 'mira@fuddudelivery.local', phone: '+91 9876500003', role: 'customer' },
  { id: '11111111-1111-4111-8111-111111111115', name: 'Arjun Dutta', email: 'arjun@fuddudelivery.local', phone: '+91 9876500004', role: 'customer' },
]

const demoDriverUsers = [
  { id: '33333333-3333-4333-8333-333333333333', name: 'Ravi Rider', email: 'driver@fuddudelivery.local', phone: '+91 9123456780', role: 'driver' },
  { id: '33333333-3333-4333-8333-333333333334', name: 'Amit Rider', email: 'amit.driver@fuddudelivery.local', phone: '+91 9123456781', role: 'driver' },
  { id: '33333333-3333-4333-8333-333333333335', name: 'Neha Rider', email: 'neha.driver@fuddudelivery.local', phone: '+91 9123456782', role: 'driver' },
  { id: '33333333-3333-4333-8333-333333333336', name: 'Suman Rider', email: 'suman.driver@fuddudelivery.local', phone: '+91 9123456783', role: 'driver' },
  { id: '33333333-3333-4333-8333-333333333337', name: 'Puja Rider', email: 'puja.driver@fuddudelivery.local', phone: '+91 9123456784', role: 'driver' },
]

const mockUsers = [
  ...demoCustomers,
  { id: '22222222-2222-4222-8222-222222222222', name: 'Fuddu Admin', email: 'admin@fuddudelivery.local', phone: '+91 9000000000', role: 'admin' },
  ...demoDriverUsers,
]

const { error: usersError } = await supabase.from('users').upsert(mockUsers, { onConflict: 'id' })
if (usersError) throwSetupError(usersError)

const demoAddresses = demoCustomers.map((customer, index) => ({
  user_id: customer.id,
  label: index % 2 === 0 ? 'Home' : 'Work',
  address: ['789 Park Street', 'Sector V Tech Park', 'Salt Lake Block A', 'New Town Action Area 1', 'Ballygunge Circular Road'][index],
  city: 'Kolkata',
  pincode: ['700016', '700091', '700064', '700156', '700019'][index],
  phone: customer.phone,
  latitude: 22.5726 + index * 0.008,
  longitude: 88.3639 + index * 0.009,
  is_default: true,
}))

const { error: addressDeleteError } = await supabase.from('user_addresses').delete().in('user_id', demoCustomers.map((customer) => customer.id))
if (addressDeleteError && addressDeleteError.code !== 'PGRST205') throw addressDeleteError
if (!addressDeleteError) {
  const { error: addressSeedError } = await supabase.from('user_addresses').insert(demoAddresses)
  if (addressSeedError && addressSeedError.code !== 'PGRST205') throw addressSeedError
}

const demoDrivers = [
  { id: '44444444-4444-4444-8444-444444444444', user_id: '33333333-3333-4333-8333-333333333333', name: 'Ravi Rider', phone: '+91 9123456780', vehicle_number: 'WB 20 FD 4242', current_status: 'available' },
  { id: '44444444-4444-4444-8444-444444444445', user_id: '33333333-3333-4333-8333-333333333334', name: 'Amit Rider', phone: '+91 9123456781', vehicle_number: 'WB 20 FD 4243', current_status: 'assigned' },
  { id: '44444444-4444-4444-8444-444444444446', user_id: '33333333-3333-4333-8333-333333333335', name: 'Neha Rider', phone: '+91 9123456782', vehicle_number: 'WB 20 FD 4244', current_status: 'delivering' },
  { id: '44444444-4444-4444-8444-444444444447', user_id: '33333333-3333-4333-8333-333333333336', name: 'Suman Rider', phone: '+91 9123456783', vehicle_number: 'WB 20 FD 4245', current_status: 'available' },
  { id: '44444444-4444-4444-8444-444444444448', user_id: '33333333-3333-4333-8333-333333333337', name: 'Puja Rider', phone: '+91 9123456784', vehicle_number: 'WB 20 FD 4246', current_status: 'offline' },
]

const { error: driverError } = await supabase.from('drivers').upsert(demoDrivers, { onConflict: 'id' })
if (driverError) throw driverError

const categories = [...new Set(restaurants.flatMap((restaurant) => restaurant.menuItems.map((item) => inferCategory(item.name))))]
const { error: categoryError } = await supabase
  .from('categories')
  .upsert(categories.map((name) => ({ name })), { onConflict: 'name' })
if (categoryError) throw categoryError

const { data: categoryRows, error: categoryRowsError } = await supabase.from('categories').select('*')
if (categoryRowsError) throw categoryRowsError
const categoryByName = new Map(categoryRows.map((category) => [category.name, category.id]))

for (const restaurant of restaurants) {
  const { data: restaurantRow, error: restaurantError } = await supabase
    .from('restaurants')
    .upsert({
      original_id: restaurant.id,
      name: restaurant.name,
      rating: Number(restaurant.rating || 4),
      delivery_time: restaurant.deliveryTime,
      address: restaurant.address,
      image: restaurant.image,
      cuisine: restaurant.cuisine || 'Fast Food, Delivery Favorites',
      cost_for_two: restaurant.costForTwo || 300,
      latitude: 22.5726 + restaurant.id * 0.003,
      longitude: 88.3639 + restaurant.id * 0.003,
      is_active: true,
    }, { onConflict: 'original_id' })
    .select()
    .single()

  if (restaurantError) throw restaurantError

  const menuRows = restaurant.menuItems.map((item) => {
    const categoryName = inferCategory(item.name)
    return {
      original_id: item.id,
      restaurant_id: restaurantRow.id,
      category_id: categoryByName.get(categoryName),
      name: item.name,
      description: `Fresh ${item.name.toLowerCase()} from ${restaurant.name}.`,
      price: item.price,
      image: item.image,
      rating: 4.2,
      add_ons: item.addOns || [],
      is_veg: isVeg(item.name),
      is_available: true,
    }
  })

  const { error: menuError } = await supabase
    .from('menu_items')
    .upsert(menuRows, { onConflict: 'original_id' })

  if (menuError) throw menuError
}

await supabase.from('driver_locations').upsert({
  driver_id: '44444444-4444-4444-8444-444444444444',
  latitude: 22.5726,
  longitude: 88.3639,
  heading: 0,
}, { onConflict: 'driver_id' })

const { data: restaurantRows, error: restaurantsReadError } = await supabase
  .from('restaurants')
  .select('*, menu_items(*)')
  .order('original_id', { ascending: true })
if (restaurantsReadError) throw restaurantsReadError

const demoOrders = [
  { order_number: 'FUD-DEMO-1001', customer_id: demoCustomers[0].id, driver_id: demoDrivers[0].id, restaurant: restaurantRows[0], status: 'placed', payment_method: 'upi', address: { type: 'Home', name: 'Bubun', address: '789 Park Street', city: 'Kolkata', pincode: '700016', phone: '+91 9876543210' } },
  { order_number: 'FUD-DEMO-1002', customer_id: demoCustomers[1].id, driver_id: demoDrivers[1].id, restaurant: restaurantRows[1], status: 'accepted', payment_method: 'card', address: { type: 'Work', name: 'Ananya Sen', address: 'Sector V Tech Park', city: 'Kolkata', pincode: '700091', phone: '+91 9876500001' } },
  { order_number: 'FUD-DEMO-1003', customer_id: demoCustomers[2].id, driver_id: demoDrivers[2].id, restaurant: restaurantRows[2], status: 'on_the_way', payment_method: 'cash', address: { type: 'Home', name: 'Rahul Das', address: 'Salt Lake, Block A', city: 'Kolkata', pincode: '700064', phone: '+91 9876500002' } },
  { order_number: 'FUD-DEMO-1004', customer_id: demoCustomers[3].id, driver_id: demoDrivers[3].id, restaurant: restaurantRows[3], status: 'delivered', payment_method: 'wallet', address: { type: 'Other', name: 'Mira Roy', address: 'New Town Action Area 1', city: 'Kolkata', pincode: '700156', phone: '+91 9876500003' } },
  { order_number: 'FUD-DEMO-1005', customer_id: demoCustomers[4].id, driver_id: demoDrivers[4].id, restaurant: restaurantRows[4], status: 'preparing', payment_method: 'upi', address: { type: 'Home', name: 'Arjun Dutta', address: 'Ballygunge Circular Road', city: 'Kolkata', pincode: '700019', phone: '+91 9876500004' } },
].filter((order) => order.restaurant)

const seededOrderIds = []

for (const [index, demoOrder] of demoOrders.entries()) {
  const items = (demoOrder.restaurant.menu_items || []).slice(0, 2)
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const deliveryFee = subtotal >= 500 ? 0 : 49
  const gst = Math.round(subtotal * 0.05)
  const platformFee = 2
  const total = subtotal + deliveryFee + gst + platformFee

  const hasAcceptedRider = ['on_the_way', 'delivered'].includes(demoOrder.status)
  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .upsert({
      order_number: demoOrder.order_number,
      customer_id: demoOrder.customer_id,
      restaurant_id: demoOrder.restaurant.id,
      driver_id: hasAcceptedRider ? demoOrder.driver_id : null,
      status: demoOrder.status,
      payment_method: demoOrder.payment_method,
      subtotal,
      delivery_fee: deliveryFee,
      gst,
      platform_fee: platformFee,
      discount: 0,
      total,
      delivery_address: demoOrder.address,
      notes: `Demo order ${index + 1}`,
    }, { onConflict: 'order_number' })
    .select()
    .single()

  if (orderError) throw orderError
  seededOrderIds.push(orderRow.id)

  await supabase.from('order_items').delete().eq('order_id', orderRow.id)
  const { error: orderItemsError } = await supabase.from('order_items').insert(items.map((item) => ({
    order_id: orderRow.id,
    menu_item_id: item.id,
    item_name: item.name,
    quantity: 1,
    unit_price: item.price,
    add_ons: [],
    line_total: item.price,
  })))
  if (orderItemsError) throw orderItemsError

  const assignmentStatus = {
    placed: 'assigned',
    accepted: 'accepted',
    preparing: 'accepted',
    picked_up: 'picked_up',
    on_the_way: 'on_the_way',
    delivered: 'delivered',
    cancelled: 'cancelled',
  }[demoOrder.status]
  await supabase.from('delivery_assignments').delete().eq('order_id', orderRow.id)
  if (demoOrder.status !== 'placed') {
    const { error: assignmentError } = await supabase.from('delivery_assignments').upsert({
      order_id: orderRow.id,
      driver_id: demoOrder.driver_id,
      status: hasAcceptedRider ? assignmentStatus : 'assigned',
      accepted_at: hasAcceptedRider ? new Date().toISOString() : null,
      completed_at: demoOrder.status === 'delivered' ? new Date().toISOString() : null,
    }, { onConflict: 'order_id,driver_id' })
    if (assignmentError) throw assignmentError
  }

  await supabase.from('order_status_logs').delete().eq('order_id', orderRow.id)
  const statusTrail = ['placed', 'accepted', 'preparing', 'picked_up', 'on_the_way', 'delivered']
  const currentIndex = statusTrail.indexOf(demoOrder.status)
  const logs = statusTrail.slice(0, Math.max(currentIndex + 1, 1)).map((status) => ({
    order_id: orderRow.id,
    status,
    note: `Demo status: ${status}`,
    created_by: '22222222-2222-4222-8222-222222222222',
  }))
  const { error: logsError } = await supabase.from('order_status_logs').insert(logs)
  if (logsError) throw logsError

  const { error: locationError } = await supabase.from('driver_locations').upsert({
    driver_id: demoOrder.driver_id,
    order_id: orderRow.id,
    latitude: 22.5726 + index * 0.012,
    longitude: 88.3639 + index * 0.014,
    heading: index * 35,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'driver_id' })
  if (locationError) throw locationError
}

console.log(`Seeded ${restaurants.length} restaurants, ${restaurants.reduce((sum, restaurant) => sum + restaurant.menuItems.length, 0)} menu items, ${demoCustomers.length} customers, ${demoDrivers.length} drivers, and ${seededOrderIds.length} demo orders into Supabase.`)
