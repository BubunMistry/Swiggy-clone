'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState({})
  const [customizations, setCustomizations] = useState({})
  const [restaurant, setRestaurant] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('swiggyCart')
    const savedCustomizations = localStorage.getItem('swiggyCustomizations')
    const savedRestaurant = localStorage.getItem('swiggyRestaurant')
    
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    if (savedCustomizations) {
      setCustomizations(JSON.parse(savedCustomizations))
    }
    if (savedRestaurant) {
      setRestaurant(JSON.parse(savedRestaurant))
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('swiggyCart', JSON.stringify(cart))
    localStorage.setItem('swiggyCustomizations', JSON.stringify(customizations))
    if (restaurant) {
      localStorage.setItem('swiggyRestaurant', JSON.stringify(restaurant))
    }
  }, [cart, customizations, restaurant])

  const addToCart = (item, restaurantData, selectedOptions = {}) => {
    setCart(prevCart => ({
      ...prevCart,
      [item.id]: (prevCart[item.id] || 0) + 1
    }))
    setCustomizations(prevCustomizations => ({
      ...prevCustomizations,
      [item.id]: selectedOptions
    }))
    if (restaurantData) {
      setRestaurant(restaurantData)
    }
  }

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      const newCart = { ...prevCart }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
        const newCustomizations = { ...customizations }
        delete newCustomizations[itemId]
        setCustomizations(newCustomizations)
      }
      return newCart
    })
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
    } else {
      setCart(prevCart => ({
        ...prevCart,
        [itemId]: quantity
      }))
    }
  }

  const clearCart = () => {
    setCart({})
    setCustomizations({})
    setRestaurant(null)
    localStorage.removeItem('swiggyCart')
    localStorage.removeItem('swiggyCustomizations')
    localStorage.removeItem('swiggyRestaurant')
  }

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)
  }

  const getTotalPrice = (menuItems = []) => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(item => item.id === parseInt(itemId))
      if (!item) return total
      
      const itemTotal = item.price * quantity
      const customizationTotal = customizations[itemId] 
        ? Object.entries(customizations[itemId]).reduce((sum, [optionId, isSelected]) => {
            if (isSelected) {
              const option = item.addOns?.find(opt => opt.id === parseInt(optionId))
              return sum + (option?.price || 0)
            }
            return sum
          }, 0)
        : 0
      return total + itemTotal + (customizationTotal * quantity)
    }, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      customizations,
      restaurant,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

