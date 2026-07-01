'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { MOCK_CUSTOMER_ID, MOCK_DRIVER_ID } from '../lib/mockActors'
import { findDriverByLogin, getDrivers } from '../services/drivers'
import { findUserByLogin, getUserById, getUsers } from '../services/users'

const CUSTOMER_KEY = 'fudduCurrentCustomerId'
const DRIVER_KEY = 'fudduCurrentDriverId'
const ActorContext = createContext(null)

export function CurrentActorProvider({ children }) {
  const [customer, setCustomer] = useState(null)
  const [driver, setDriver] = useState(null)
  const [customers, setCustomers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const [customerRows, driverRows] = await Promise.all([
      getUsers('customer'),
      getDrivers(),
    ])
    setCustomers(customerRows)
    setDrivers(driverRows)

    const savedCustomerId = localStorage.getItem(CUSTOMER_KEY) || MOCK_CUSTOMER_ID
    const savedDriverId = localStorage.getItem(DRIVER_KEY) || MOCK_DRIVER_ID
    const activeCustomer = savedCustomerId === 'logged_out'
      ? null
      : customerRows.find((item) => item.id === savedCustomerId) || customerRows[0] || await getUserById(MOCK_CUSTOMER_ID)
    const activeDriver = savedDriverId === 'logged_out'
      ? null
      : driverRows.find((item) => item.id === savedDriverId) || driverRows[0] || null
    setCustomer(activeCustomer)
    setDriver(activeDriver)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh().catch(() => setLoading(false))
  }, [refresh])

  const loginCustomer = async (identifier) => {
    const found = await findUserByLogin(identifier, 'customer')
    if (!found) throw new Error('No customer found with that email or phone.')
    localStorage.setItem(CUSTOMER_KEY, found.id)
    setCustomer(found)
    return found
  }

  const loginDriver = async (identifier) => {
    const found = await findDriverByLogin(identifier)
    if (!found) throw new Error('No rider found with that name or phone.')
    localStorage.setItem(DRIVER_KEY, found.id)
    setDriver(found)
    return found
  }

  const switchCustomer = useCallback(async (id) => {
    localStorage.setItem(CUSTOMER_KEY, id)
    const found = customers.find((item) => item.id === id) || await getUserById(id)
    setCustomer(found)
  }, [customers])

  const switchDriver = useCallback((id) => {
    localStorage.setItem(DRIVER_KEY, id)
    setDriver(drivers.find((item) => item.id === id) || null)
  }, [drivers])

  const logoutCustomer = () => {
    localStorage.setItem(CUSTOMER_KEY, 'logged_out')
    setCustomer(null)
  }

  const logoutDriver = () => {
    localStorage.setItem(DRIVER_KEY, 'logged_out')
    setDriver(null)
  }

  const value = useMemo(() => ({
    customer,
    driver,
    customers,
    drivers,
    loading,
    refresh,
    loginCustomer,
    loginDriver,
    switchCustomer,
    switchDriver,
    logoutCustomer,
    logoutDriver,
  }), [customer, driver, customers, drivers, loading, refresh, switchCustomer, switchDriver])

  return <ActorContext.Provider value={value}>{children}</ActorContext.Provider>
}

export function useCurrentActor() {
  const context = useContext(ActorContext)
  if (!context) {
    throw new Error('useCurrentActor must be used within CurrentActorProvider')
  }
  return context
}
