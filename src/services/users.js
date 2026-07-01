import { supabase } from '../lib/supabaseClient'
import { MOCK_CUSTOMER_ID } from '../lib/mockActors'

export async function getUsers(role) {
  let query = supabase.from('users').select('*').order('created_at', { ascending: true })
  if (role) query = query.eq('role', role)
  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getUserById(id = MOCK_CUSTOMER_ID) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function findUserByLogin(identifier, role = 'customer') {
  const value = identifier.trim().toLowerCase()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', role)
    .or(`email.ilike.${value},phone.ilike.${value}`)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createUser(payload) {
  const { data, error } = await supabase
    .from('users')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateUser(id, payload) {
  const { data, error } = await supabase
    .from('users')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteUser(id) {
  const { error } = await supabase.from('users').delete().eq('id', id)
  if (error) throw error
}

export async function getUserAddresses(userId) {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: true })

  if (error?.code === 'PGRST205' || error?.message?.includes('user_addresses')) {
    throw new Error('user_addresses table is missing. Run the latest supabase/schema.sql in Supabase SQL Editor.')
  }
  if (error) throw error
  return data || []
}

export function normalizeAddress(address, customer) {
  if (!address) return null
  return {
    ...address,
    type: address.label || 'Home',
    name: customer?.name || 'Customer',
    latitude: Number(address.latitude || 22.5726),
    longitude: Number(address.longitude || 88.3639),
  }
}

export async function upsertUserAddress(payload) {
  const query = payload.id
    ? supabase.from('user_addresses').update(payload).eq('id', payload.id)
    : supabase.from('user_addresses').insert(payload)

  const { data, error } = await query.select().single()
  if (error) throw error
  return data
}

export async function deleteUserAddress(id) {
  const { error } = await supabase.from('user_addresses').delete().eq('id', id)
  if (error) throw error
}
