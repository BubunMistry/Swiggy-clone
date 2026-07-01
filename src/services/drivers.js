import { supabase } from '../lib/supabaseClient'
import { MOCK_DRIVER_ID } from '../lib/mockActors'

export async function getDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getAvailableDrivers() {
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .eq('current_status', 'available')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function findDriverByLogin(identifier) {
  const value = identifier.trim().toLowerCase()
  const { data, error } = await supabase
    .from('drivers')
    .select('*')
    .or(`phone.ilike.${value},name.ilike.${value}`)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateDriverStatus(driverId, currentStatus) {
  const { data, error } = await supabase
    .from('drivers')
    .update({ current_status: currentStatus })
    .eq('id', driverId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateDriverLocation({ driverId = MOCK_DRIVER_ID, orderId, latitude, longitude, heading = 0 }) {
  const { data, error } = await supabase
    .from('driver_locations')
    .upsert({
      driver_id: driverId,
      order_id: orderId,
      latitude,
      longitude,
      heading,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'driver_id' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getDriverLocation(driverId = MOCK_DRIVER_ID) {
  const { data, error } = await supabase
    .from('driver_locations')
    .select('*')
    .eq('driver_id', driverId)
    .maybeSingle()

  if (error) throw error
  return data
}
