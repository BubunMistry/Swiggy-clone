import { supabase } from '../lib/supabaseClient'

export function normalizeRestaurant(restaurant) {
  return {
    ...restaurant,
    id: restaurant.original_id || restaurant.id,
    dbId: restaurant.id,
    deliveryTime: restaurant.delivery_time,
    costForTwo: restaurant.cost_for_two,
    menuItems: (restaurant.menu_items || []).map((item) => ({
      ...item,
      id: item.original_id || item.id,
      dbId: item.id,
      originalPrice: item.original_price,
      addOns: item.add_ons || [],
    })),
  }
}

export async function getRestaurants() {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, menu_items(*)')
    .eq('is_active', true)
    .order('original_id', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeRestaurant)
}

export async function getRestaurantByOriginalId(originalId) {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, menu_items(*)')
    .eq('original_id', Number(originalId))
    .maybeSingle()

  if (error) throw error
  return data ? normalizeRestaurant(data) : null
}

export async function getRestaurantByRouteId(routeId) {
  const numericId = Number(routeId)
  const query = supabase.from('restaurants').select('*, menu_items(*)')

  const { data, error } = Number.isFinite(numericId)
    ? await query.eq('original_id', numericId).maybeSingle()
    : await query.eq('id', routeId).maybeSingle()

  if (error) throw error
  return data ? normalizeRestaurant(data) : null
}

export async function createRestaurant(payload) {
  const { data, error } = await supabase
    .from('restaurants')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateRestaurant(id, payload) {
  const { data, error } = await supabase
    .from('restaurants')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteRestaurant(id) {
  const { error } = await supabase.from('restaurants').delete().eq('id', id)
  if (error) throw error
}
