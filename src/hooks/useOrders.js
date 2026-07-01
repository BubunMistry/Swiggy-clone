'use client'

import { useCallback, useEffect, useState } from 'react'
import { getOrders } from '../services/orders'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(() => {
    setLoading(true)
    return getOrders()
      .then(setOrders)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { orders, loading, error, refresh, setOrders }
}

