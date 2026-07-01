'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getDriverLocation } from '../services/drivers'

export function useDriverLocation(driverId) {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!driverId) return undefined
    let mounted = true

    getDriverLocation(driverId)
      .then((data) => {
        if (mounted) setLocation(data)
      })
      .catch((err) => {
        if (mounted) setError(err)
      })

    const channel = supabase
      .channel(`driver-location-${driverId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'driver_locations', filter: `driver_id=eq.${driverId}` }, (payload) => {
        if (mounted) setLocation(payload.new)
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(channel)
    }
  }, [driverId])

  return { location, error }
}
