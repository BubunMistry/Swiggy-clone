'use client'

import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import { MdLocalOffer, MdCheckCircle, MdArrowForward } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'

export default function OffersPage() {
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    fetch('/data/restaurants.json')
      .then(response => response.json())
      .then(data => setRestaurants(data))
      .catch(error => console.error('Error fetching restaurants:', error))
  }, [])

  const offers = [
    {
      id: 1,
      title: 'Flat 50% OFF',
      code: 'FLAT50',
      description: 'Get flat 50% off on orders above ₹500',
      minOrder: 500,
      discount: 50,
      type: 'flat',
      validTill: 'Dec 31, 2024',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 2,
      title: '20% OFF',
      code: 'NEWUSER',
      description: 'Welcome offer for new users',
      minOrder: 300,
      discount: 20,
      type: 'percent',
      validTill: 'Dec 31, 2024',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 3,
      title: 'FREE DELIVERY',
      code: 'FREEDEL',
      description: 'Free delivery on all orders',
      minOrder: 150,
      discount: 0,
      type: 'delivery',
      validTill: 'Dec 31, 2024',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 4,
      title: '10% OFF',
      code: 'STEALDEAL',
      description: 'Steal deal on your favorite food',
      minOrder: 200,
      discount: 10,
      type: 'percent',
      validTill: 'Dec 31, 2024',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Offers for you</h1>
            <p className="text-gray-600">Explore amazing deals and discounts</p>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${offer.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <MdLocalOffer size={32} />
                    <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">Valid till {offer.validTill}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{offer.title}</h3>
                  <p className="text-sm opacity-90">{offer.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Use Code</p>
                      <p className="text-xl font-bold text-[#ff5200]">{offer.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Min Order</p>
                      <p className="text-lg font-semibold">₹{offer.minOrder}</p>
                    </div>
                  </div>
                  <button className="w-full btn-orange-outline border-2">
                    Copy Code
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Restaurants with Offers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Restaurants with Special Offers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {restaurants.slice(0, 12).map((restaurant) => (
                <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      <Image
                        src={restaurant.image}
                        alt={restaurant.name}
                        width={200}
                        height={150}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-[#ff5200] text-white px-2 py-1 rounded text-xs font-bold">
                        OFFER
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">{restaurant.name}</h3>
                      <p className="text-xs text-gray-500">{restaurant.deliveryTime}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

