'use client'

import { createContext, useContext, useState } from 'react'

const SearchContext = createContext()

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    try {
      const response = await fetch('/data/restaurants.json')
      const restaurants = await response.json()
      
      const results = []
      const queryLower = query.toLowerCase()
      
      restaurants.forEach(restaurant => {
        // Search in restaurant name
        if (restaurant.name.toLowerCase().includes(queryLower)) {
          results.push({
            type: 'restaurant',
            id: restaurant.id,
            name: restaurant.name,
            rating: restaurant.rating,
            deliveryTime: restaurant.deliveryTime,
            address: restaurant.address,
            image: restaurant.image
          })
        }
        
        // Search in menu items
        if (restaurant.menuItems) {
          restaurant.menuItems.forEach(item => {
            if (item.name.toLowerCase().includes(queryLower)) {
              results.push({
                type: 'menuItem',
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                itemId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                rating: restaurant.rating,
                deliveryTime: restaurant.deliveryTime
              })
            }
          })
        }
      })
      
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <SearchContext.Provider value={{
      searchQuery,
      setSearchQuery,
      searchResults,
      performSearch,
      isSearching
    }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

