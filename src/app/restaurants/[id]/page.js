'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MdStar, MdShoppingCart, MdSearch, MdAdd, MdRemove, MdChevronRight, MdClose, MdLocationOn, MdAccessTime, MdLocalOffer } from 'react-icons/md'
import { FaCircle } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import { useCart } from '../../context/CartContext'

const deals = [
  { id: 1, discount: "10% OFF", code: "USE STEALDEAL" },
  { id: 2, discount: "20% OFF", code: "USE NEWUSER" },
  { id: 3, discount: "FREE DELIVERY", code: "USE FREEDEL" }
]

export default function RestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = parseInt(params.id)
  const [restaurant, setRestaurant] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [popupItem, setPopupItem] = useState(null)
  const [activeTab, setActiveTab] = useState('order')
  const { cart, customizations, addToCart, removeFromCart, getTotalItems, getTotalPrice } = useCart()

  useEffect(() => {
    fetch('/data/restaurants.json')
      .then(response => response.json())
      .then(data => {
        const foundRestaurant = data.find(r => r.id === restaurantId)
        if (foundRestaurant) {
          setRestaurant(foundRestaurant)
        } else {
          router.push('/')
        }
      })
      .catch(error => {
        console.error('Error fetching restaurant data:', error)
        router.push('/')
      })
  }, [restaurantId, router])

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant...</p>
        </div>
      </div>
    )
  }

  const filteredMenuItems = restaurant.menuItems?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAddToCart = (item) => {
    setPopupItem(item)
  }

  const confirmAddToCart = (item, selectedOptions) => {
    addToCart(item, restaurant, selectedOptions)
    setPopupItem(null)
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-[#ff5200] transition-colors">Home</Link>
          <MdChevronRight className="inline mx-1" />
          <span className="text-gray-600">Kolkata</span>
          <MdChevronRight className="inline mx-1" />
          <span className="text-gray-800 font-medium">{restaurant.name}</span>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('order')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'order'
                ? 'text-black border-b-4 border-[#ff5200]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Order Online
          </button>
          <button
            onClick={() => setActiveTab('dineout')}
            className={`pb-3 font-semibold transition-colors ${
              activeTab === 'dineout'
                ? 'text-black border-b-4 border-[#ff5200]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Dineout
          </button>
        </div>

        {/* Restaurant Header */}
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff5200]/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Image 
                src={restaurant.image} 
                alt={restaurant.name} 
                width={200} 
                height={200} 
                className="w-full md:w-48 h-48 object-cover rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300"
              />
            </div>
            <div className="flex-grow">
              <h1 className="text-3xl font-bold mb-3 text-gray-800">{restaurant.name}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <div className="flex items-center bg-[#E6F7ED] px-3 py-1 rounded-full">
                  <MdStar className="w-4 h-4 text-[#00A651] mr-1" />
                  <span className="font-semibold text-[#00A651]">{restaurant.rating}</span>
                  <span className="text-gray-600 text-xs ml-1">({Math.floor(Math.random() * 5 + 5)}K+ ratings)</span>
                </div>
                <div className="text-gray-600 text-sm">
                  ₹{restaurant.costForTwo || '300'} for two
                </div>
                <div className="text-gray-600 text-sm">
                  {restaurant.cuisine || 'Momos, Chinese'}
                </div>
                <div className="text-gray-600 text-sm">
                  {restaurant.deliveryTime}
                </div>
              </div>
              <p className="text-sm text-gray-500">{restaurant.address}</p>
            </div>
          </div>
        </div>

        {/* Deals */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Deals for you</h2>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            <div className="flex-shrink-0 bg-[#6A1B9A] p-4 rounded-2xl shadow-md min-w-[200px] text-white">
              <div className="mb-2">
                <div className="text-lg font-bold mb-2">Extra ₹20 Off</div>
                <span className="inline-block text-xs bg-white/20 px-2 py-1 rounded font-semibold">SAVE X2</span>
              </div>
              <div className="text-sm">Use code SAVE20</div>
            </div>
            <div className="flex-shrink-0 bg-[#ff5200] p-4 rounded-2xl shadow-md min-w-[200px] text-white">
              <div className="mb-2">
                <div className="text-lg font-bold mb-2">Items At ₹99</div>
                <span className="inline-block text-xs bg-white/20 px-2 py-1 rounded font-semibold">DEAL OF DAY</span>
              </div>
              <div className="text-sm">Limited time offer</div>
            </div>
            {deals.slice(0, 1).map((deal) => (
              <div key={deal.id} className="flex-shrink-0 bg-[#ff5200] p-4 rounded-lg shadow-md min-w-[200px] text-white">
                <div className="flex items-center mb-2">
                  <MdLocalOffer className="text-white mr-2" size={20} />
                  <div className="text-lg font-bold">{deal.discount}</div>
                </div>
                <div className="text-sm">{deal.code}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Menu Section Divider */}
        <div className="text-center my-6">
          <span className="text-gray-400 text-sm">-MENU-</span>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for dishes..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <MdSearch className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-full bg-white hover:bg-green-50 hover:border-[#00A651] transition-all whitespace-nowrap shadow-sm hover:shadow-md">
            <FaCircle className="text-[#00A651]" size={14} />
            <span className="text-sm font-medium">Vegetarian</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-lg bg-white hover:bg-red-50 hover:border-red-500 transition-all whitespace-nowrap shadow-sm hover:shadow-md">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#FF0000">
              <path d="M12 2L2 22h20L12 2z"/>
            </svg>
            <span className="text-sm font-medium">Non-Vegetarian</span>
          </button>
          <button className="px-5 py-2.5 border-2 border-gray-300 rounded-lg bg-white hover:bg-orange-50 hover:border-[#ff5200] transition-all whitespace-nowrap shadow-sm hover:shadow-md">
            <span className="text-sm font-medium">Bestseller</span>
          </button>
          <button className="px-5 py-2.5 border-2 border-gray-300 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-500 transition-all whitespace-nowrap shadow-sm hover:shadow-md">
            <span className="text-sm font-medium">Recommended</span>
          </button>
        </div>

        {/* Menu Items */}
        <section>
          {filteredMenuItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">No items found matching your search.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredMenuItems.map((item) => {
                const isVeg = item.name.toLowerCase().includes('veg') || item.name.toLowerCase().includes('vegetable')
                return (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md p-4 transition-all duration-300 border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="flex-grow">
                        <div className="flex items-start gap-2 mb-1">
                          {isVeg ? (
                            <FaCircle className="text-[#00A651] mt-1 flex-shrink-0" size={14} />
                          ) : (
                            <svg className="w-3.5 h-3.5 mt-1 flex-shrink-0" viewBox="0 0 24 24" fill="#FF0000">
                              <path d="M12 2L2 22h20L12 2z"/>
                            </svg>
                          )}
                          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                        </div>
                        {item.description ? (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 ml-5">{item.description}</p>
                        ) : (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2 ml-5">
                            Delicious {item.name.toLowerCase()} made with fresh ingredients. Perfect combination of flavors that will satisfy your taste buds. Order now and enjoy a delightful meal!
                          </p>
                        )}
                        <div className="ml-5 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[#00A651] font-semibold text-lg">₹{item.price}</p>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <>
                                <p className="text-gray-400 line-through text-sm">₹{item.originalPrice}</p>
                                <span className="text-xs text-[#00A651] font-semibold bg-green-50 px-1.5 py-0.5 rounded">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                </span>
                              </>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>⭐ 4.2</span>
                            <span>•</span>
                            <span>🔥 Popular</span>
                            <span>•</span>
                            <span>⚡ Fast delivery</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            width={118} 
                            height={96} 
                            className="w-[118px] h-24 object-cover rounded-2xl" 
                          />
                          {item.isNew && (
                            <div className="absolute top-1 left-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-semibold">
                              NEWLY LAUNCHED
                            </div>
                          )}
                        </div>
                        {cart[item.id] ? (
                          <div className="flex items-center gap-2 bg-[#00A651] px-3 py-1.5 rounded-full">
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-white hover:bg-[#00A651]/80 rounded p-1 transition"
                            >
                              <MdRemove size={18} />
                            </button>
                            <span className="text-white font-bold w-6 text-center">{cart[item.id]}</span>
                            <button 
                              onClick={() => handleAddToCart(item)}
                              className="text-white hover:bg-[#00A651]/80 rounded p-1 transition"
                            >
                              <MdAdd size={18} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleAddToCart(item)}
                            className="bg-[#00A651] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#008f45] transition-colors shadow-sm"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Cart Footer */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-black text-white px-4 py-2 text-center text-sm">
              Deal of the Day unlocked!
            </div>
            <Link href="/checkout" className="bg-[#00A651] text-white p-4 flex justify-between items-center shadow-lg">
              <span className="font-semibold">{getTotalItems()} item added</span>
              <div className="flex items-center space-x-2 bg-[#00A651] px-6 py-2 rounded">
                <span className="font-semibold">VIEW CART</span>
                <MdShoppingCart className="w-5 h-5" />
              </div>
            </Link>
          </div>
        )}

        {/* Add-on Options Popup */}
        {popupItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{popupItem.name}</h3>
                <button 
                  onClick={() => setPopupItem(null)} 
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              {popupItem.addOns && popupItem.addOns.length > 0 && (
                <>
                  <p className="text-sm text-gray-600 mb-4">Customize your order:</p>
                  <div className="space-y-3">
                    {popupItem.addOns.map(option => (
                      <div key={option.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <label htmlFor={`option-${popupItem.id}-${option.id}`} className="flex items-center cursor-pointer flex-grow">
                          <input
                            type="checkbox"
                            id={`option-${popupItem.id}-${option.id}`}
                            className="mr-3 w-4 h-4 text-orange-500"
                            defaultChecked={customizations[popupItem.id]?.[option.id] || false}
                          />
                          <span className="text-gray-800">{option.name}</span>
                        </label>
                        <span className="text-orange-500 font-semibold">+₹{option.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <button
                onClick={() => {
                  const selectedOptions = popupItem.addOns?.reduce((acc, option) => {
                    const checkbox = document.getElementById(`option-${popupItem.id}-${option.id}`)
                    acc[option.id] = checkbox?.checked || false
                    return acc
                  }, {}) || {}
                  confirmAddToCart(popupItem, selectedOptions)
                }}
                className="mt-6 w-full bg-[#00A651] hover:bg-[#008f45] text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}


