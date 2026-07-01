'use client'

import { useEffect, useState } from 'react'
import { getRestaurants } from '../services/restaurants'

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    getRestaurants()
      .then((data) => {
        if (mounted) setRestaurants(data)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { restaurants, loading, error, setRestaurants }
}

