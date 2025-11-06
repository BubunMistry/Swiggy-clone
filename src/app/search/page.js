'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import { MdStar, MdLocationOn, MdAccessTime } from 'react-icons/md'

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = async (searchQuery) => {
    setIsLoading(true)
    try {
      const response = await fetch('/data/restaurants.json')
      const restaurants = await response.json()
      
      const searchResults = []
      const queryLower = searchQuery.toLowerCase()
      
      restaurants.forEach(restaurant => {
        // Search in restaurant name
        if (restaurant.name.toLowerCase().includes(queryLower)) {
          searchResults.push({
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
              searchResults.push({
                type: 'menuItem',
                restaurantId: restaurant.id,
                restaurantName: restaurant.name,
                itemId: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                rating: restaurant.rating,
                deliveryTime: restaurant.deliveryTime,
                restaurantImage: restaurant.image
              })
            }
          })
        }
      })
      
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {query ? `Search results for "${query}"` : 'Search'}
      </h1>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching...</p>
          </div>
        ) : results.length === 0 && query ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No results found for &quot;{query}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, index) => (
              result.type === 'restaurant' ? (
                <Link key={index} href={`/restaurants/${result.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <Image
                      src={result.image}
                      alt={result.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2">{result.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MdStar className="text-[#00A651] mr-1" size={18} />
                          <span className="font-semibold">{result.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <MdAccessTime className="mr-1" size={18} />
                          <span>{result.deliveryTime}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{result.address}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link key={index} href={`/restaurants/${result.restaurantId}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex">
                      <Image
                        src={result.image || '/assets/menu/item1.jpg'}
                        alt={result.name}
                        width={150}
                        height={150}
                        className="w-32 h-32 object-cover"
                      />
                      <div className="p-4 flex-grow">
                        <h3 className="font-semibold text-lg mb-1">{result.name}</h3>
                        <p className="text-orange-500 font-semibold mb-2">₹{result.price}</p>
                        <p className="text-sm text-gray-600">{result.restaurantName}</p>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <MdStar className="text-green-600 mr-1" size={14} />
                            {result.rating}
                          </span>
                          <span>•</span>
                          <span>{result.deliveryTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            ))}
          </div>
        )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading search...</p>
          </div>
        </div>
      }>
        <SearchResults />
      </Suspense>
    </>
  )
}

// Force dynamic rendering for search page
export const dynamic = 'force-dynamic'

