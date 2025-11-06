'use client'

import { useState, useEffect } from 'react'
import { MdStar, MdShoppingCart, MdSearch, MdAdd, MdRemove, MdChevronRight, MdClose } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'

const deals = [
  { id: 1, discount: "10% OFF", code: "USE STEALDEAL" },
  { id: 2, discount: "20% OFF", code: "USE NEWUSER" },
  { id: 3, discount: "FREE DELIVERY", code: "USE FREEDEL" }
]

export default function Component() {
  const [restaurant, setRestaurant] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [popupItem, setPopupItem] = useState(null)
  const { cart, customizations, addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart()

  useEffect(() => {
    fetch('/data/restaurants.json')
      .then(response => response.json())
      .then(data => {
        // For this example, we'll use the first restaurant in the array
        setRestaurant(data[0])
      })
      .catch(error => console.error('Error fetching restaurant data:', error))
  }, [])

  if (!restaurant) {
    return <div>Loading...</div>
  }

  const filteredMenuItems = restaurant.menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToCart = (item) => {
    setPopupItem(item)
  }

  const confirmAddToCart = (item, selectedOptions) => {
    addToCart(item, restaurant, selectedOptions)
    setPopupItem(null)
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Path */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-500 transition-colors">Home</Link>
        <MdChevronRight className="inline mx-1" />
        <span>{restaurant.name}</span>
      </div>

      {/* Restaurant Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{restaurant.name}</h1>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <MdStar className="w-4 h-4 text-[#00A651] mr-1" />
            <span className="font-semibold text-[#00A651]">{restaurant.rating}</span>
          </div>
          <span>•</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {restaurant.address}
        </div>
      </header>

      {/* Restaurant Image */}
      <div className="mb-6">
        <Image 
          src={restaurant.image} 
          alt={restaurant.name} 
          width={400} 
          height={300} 
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Deals */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Deals for you</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {deals.map((deal) => (
            <div key={deal.id} className="flex-shrink-0 bg-orange-100 p-4 rounded-md">
              <div className="text-lg font-bold text-orange-600">{deal.discount}</div>
              <div className="text-sm text-gray-600">{deal.code}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search menu items"
            className="w-full p-2 pl-10 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MdSearch className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Menu Items */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Menu</h2>
        <div className="space-y-6">
          {filteredMenuItems.map((item) => (
            <div key={item.id} className="flex items-start space-x-4 border-b pb-4">
              <div className="flex-grow">
                <h3 className="font-medium text-lg">{item.name}</h3>
                <p className="text-gray-700 mb-1">₹{item.price}</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Image src={item.image} alt={item.name} width={128} height={128} className="w-32 h-32 object-cover rounded" />
                {cart[item.id] ? (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="btn-orange p-1"
                    >
                      <MdRemove />
                    </button>
                    <span>{cart[item.id]}</span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="btn-orange p-1"
                    >
                      <MdAdd />
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="btn-orange-outline px-4 py-1 text-sm"
                  >
                    ADD
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Footer */}
      {getTotalItems() > 0 && (
        <Link href="/checkout" className="fixed bottom-0 left-0 right-0 btn-orange p-4 flex justify-between items-center z-50 shadow-lg">
          <span className="font-semibold">{getTotalItems()} item(s) | ₹{getTotalPrice(restaurant.menuItems)}</span>
          <div className="flex items-center space-x-2 btn-orange px-4 py-2">
            <span className="font-semibold">VIEW CART</span>
            <MdShoppingCart className="w-5 h-5" />
          </div>
        </Link>
      )}

      {/* Add-on Options Popup */}
      {popupItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{popupItem.name}</h3>
              <button onClick={() => setPopupItem(null)} className="text-gray-500">
                <MdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              {popupItem.addOns.map(option => (
                <div key={option.id} className="flex items-center justify-between">
                  <label htmlFor={`option-${popupItem.id}-${option.id}`} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`option-${popupItem.id}-${option.id}`}
                      className="mr-2"
                    />
                    <span>{option.name}</span>
                  </label>
                  <span>+₹{option.price}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                const selectedOptions = popupItem.addOns.reduce((acc, option) => {
                  acc[option.id] = document.getElementById(`option-${popupItem.id}-${option.id}`).checked;
                  return acc;
                }, {});
                confirmAddToCart(popupItem, selectedOptions);
              }}
              className="mt-6 w-full btn-orange py-2"
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  )
}