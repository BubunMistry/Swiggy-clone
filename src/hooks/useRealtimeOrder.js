'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getOrderById } from '../services/orders'

export function useRealtimeOrder(orderId, initialOrder = null) {
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(Boolean(orderId) && !initialOrder)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!orderId) return undefined
    let mounted = true

    getOrderById(orderId)
      .then((data) => {
        if (mounted) setOrder(data)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    const channel = supabase
      .channel(`order-${orderId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, async () => {
        const nextOrder = await getOrderById(orderId)
        if (mounted) setOrder(nextOrder)
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_assignments', filter: `order_id=eq.${orderId}` }, async () => {
        const nextOrder = await getOrderById(orderId)
        if (mounted) setOrder(nextOrder)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { order, loading, error }
}

