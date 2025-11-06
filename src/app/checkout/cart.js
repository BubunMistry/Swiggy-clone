'use client'

import { useState, useEffect } from 'react'
import { MdShoppingBag, MdHelp, MdPerson, MdLocationOn, MdAdd, MdRemove, MdClose, MdEdit, MdCheckCircle, MdCreditCard, MdAccountBalanceWallet, MdPhoneAndroid, MdAttachMoney, MdDelete, MdChevronRight, MdLock, MdLocalOffer } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { useRouter } from 'next/navigation'

export default function Cart() {
    const router = useRouter()
    const { cart, customizations, restaurant, removeFromCart, updateQuantity, getTotalItems, getTotalPrice, clearCart } = useCart()
    const [selectedAddress, setSelectedAddress] = useState(0)
    const [selectedPayment, setSelectedPayment] = useState('')
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [showCouponInput, setShowCouponInput] = useState(false)
    const [suggestions, setSuggestions] = useState('')
    const [noContactDelivery, setNoContactDelivery] = useState(false)
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [newAddress, setNewAddress] = useState({ type: 'Home', address: '', city: '', pincode: '', phone: '' })
    const [menuItems, setMenuItems] = useState([])

    const addresses = [
        {
            id: 1,
            type: 'Work',
            name: 'Bubun',
            address: '123 Tech Park, Sector 5',
            city: 'Kolkata',
            pincode: '700091',
            phone: '+91 9876543210'
        },
        {
            id: 2,
            type: 'Other',
            name: 'Bubun',
            address: '456 Residential Complex, Block A',
            city: 'Kolkata',
            pincode: '700092',
            phone: '+91 9876543210'
        },
        {
            id: 3,
            type: 'Home',
            name: 'Bubun',
            address: '789 Park Street, Near Metro Station',
            city: 'Kolkata',
            pincode: '700016',
            phone: '+91 9876543210'
        }
    ]

    const coupons = [
        { code: 'STEALDEAL', discount: 10, type: 'percent', minOrder: 200 },
        { code: 'NEWUSER', discount: 20, type: 'percent', minOrder: 300 },
        { code: 'FREEDEL', discount: 0, type: 'delivery', minOrder: 150 },
        { code: 'FLAT50', discount: 50, type: 'flat', minOrder: 500 }
    ]

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: MdPhoneAndroid, description: 'PhonePe, Google Pay, Paytm' },
        { id: 'card', name: 'Credit/Debit Card', icon: MdCreditCard, description: 'Visa, Mastercard, RuPay' },
        { id: 'wallet', name: 'Wallets', icon: MdAccountBalanceWallet, description: 'Paytm, PhonePe, Amazon Pay' },
        { id: 'cash', name: 'Cash on Delivery', icon: MdAttachMoney, description: 'Pay when you receive' }
    ]

    useEffect(() => {
        if (restaurant) {
            setMenuItems(restaurant.menuItems || [])
        } else {
            // Load restaurant data if not in context
            fetch('/data/restaurants.json')
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        setMenuItems(data[0].menuItems || [])
                    }
                })
                .catch(error => console.error('Error fetching restaurant data:', error))
        }
    }, [restaurant])

    if (getTotalItems() === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <MdShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-6">Add items to your cart to continue</p>
                    <Link href="/" className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
                        Browse Restaurants
                    </Link>
                </div>
            </div>
        )
    }

    const itemTotal = getTotalPrice(menuItems)
    const deliveryFee = itemTotal >= 500 ? 0 : 94
    const gst = Math.round(itemTotal * 0.05) // 5% GST
    const platformFee = 2

    let discount = 0
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.round(itemTotal * (appliedCoupon.discount / 100))
        } else if (appliedCoupon.type === 'flat') {
            discount = appliedCoupon.discount
        } else if (appliedCoupon.type === 'delivery') {
            discount = deliveryFee
        }
    }

    const finalTotal = itemTotal + deliveryFee + gst + platformFee - discount

    const applyCoupon = () => {
        const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase())
        if (coupon && itemTotal >= coupon.minOrder) {
            setAppliedCoupon(coupon)
            setShowCouponInput(false)
        } else {
            alert('Invalid coupon code or minimum order not met')
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
    }

    const handlePlaceOrder = () => {
        if (!selectedPayment) {
            alert('Please select a payment method')
            return
        }
        // Store order details and redirect to confirmation
        const orderData = {
            items: Object.entries(cart).map(([itemId, quantity]) => {
                const item = menuItems.find(i => i.id === parseInt(itemId))
                const customizationTotal = customizations[itemId] 
                    ? Object.entries(customizations[itemId]).reduce((sum, [optionId, isSelected]) => {
                        if (isSelected) {
                            const option = item.addOns?.find(opt => opt.id === parseInt(optionId))
                            return sum + (option?.price || 0)
                        }
                        return sum
                    }, 0)
                    : 0
                return {
                    ...item,
                    quantity,
                    customizations: customizations[itemId] || {},
                    itemTotal: (item.price + customizationTotal) * quantity
                }
            }),
            restaurant: restaurant,
            address: addresses[selectedAddress],
            paymentMethod: selectedPayment,
            total: finalTotal,
            orderId: `ORD${Date.now()}`,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            deliveryDate: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
            image: restaurant?.image || '/assets/restaurants/burgerking.jpg',
            location: addresses[selectedAddress]?.city || 'Kolkata'
        }
        
        // Save to lastOrder for confirmation page
        localStorage.setItem('lastOrder', JSON.stringify(orderData))
        
        // Save to orders list for profile page
        const existingOrders = JSON.parse(localStorage.getItem('swiggyOrders') || '[]')
        const newOrders = [orderData, ...existingOrders]
        localStorage.setItem('swiggyOrders', JSON.stringify(newOrders))
        
        clearCart()
        router.push('/checkout/confirmation')
    }

    const cartItems = Object.entries(cart).map(([itemId, quantity]) => {
        const item = menuItems.find(i => i.id === parseInt(itemId))
        return { ...item, quantity, itemId: parseInt(itemId) }
    }).filter(item => item.id)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <Link href="/">
                                <Image src="/assets/logo/swiggy-logo.png" alt="Swiggy" width={120} height={40} className="cursor-pointer" />
                            </Link>
                            <h1 className="ml-4 text-xl font-bold text-gray-800">Checkout</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/help" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center transition">
                                <MdHelp className="mr-1" size={20} />
                                Help
                            </Link>
                            <Link href="/profile" className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium flex items-center transition">
                                <MdPerson className="mr-1" size={23} />
                                Bubun
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column - Main Content */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <MdLocationOn className="h-6 w-6 text-orange-500 mr-2" />
                                    <h2 className="text-lg font-semibold text-gray-800">Delivery address</h2>
                                </div>
                                <button 
                                    onClick={() => setShowAddressModal(true)}
                                    className="text-orange-500 font-semibold hover:text-orange-600 transition"
                                >
                                    CHANGE
                                </button>
                            </div>
                            {addresses[selectedAddress] && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="flex items-center mb-2">
                                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                                                    {addresses[selectedAddress].type}
                                                </span>
                                                <span className="font-semibold text-gray-800">{addresses[selectedAddress].name}</span>
                                            </div>
                                            <p className="text-gray-700 mb-1">{addresses[selectedAddress].address}</p>
                                            <p className="text-gray-600 text-sm">{addresses[selectedAddress].city} - {addresses[selectedAddress].pincode}</p>
                                            <p className="text-gray-600 text-sm mt-1">{addresses[selectedAddress].phone}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold text-green-600">52 MINS</span> - Estimated delivery time
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Restaurant Info */}
                        {restaurant && (
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center">
                                    <Image 
                                        src={restaurant.image || '/assets/restaurants/burgerking.jpg'} 
                                        alt={restaurant.name} 
                                        width={60} 
                                        height={60} 
                                        className="w-16 h-16 rounded-full object-cover mr-4" 
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{restaurant.name}</h3>
                                        <p className="text-sm text-gray-500">{restaurant.address || 'Restaurant Address'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your order</h2>
                            <div className="space-y-4">
                                {cartItems.map((item) => {
                                    const itemCustomizations = customizations[item.itemId] || {}
                                    const customizationTotal = Object.entries(itemCustomizations).reduce((sum, [optionId, isSelected]) => {
                                        if (isSelected) {
                                            const option = item.addOns?.find(opt => opt.id === parseInt(optionId))
                                            return sum + (option?.price || 0)
                                        }
                                        return sum
                                    }, 0)
                                    const itemPrice = (item.price + customizationTotal) * item.quantity

                                    return (
                                        <div key={item.itemId} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                                            <div className="flex-shrink-0">
                                                <Image 
                                                    src={item.image || '/assets/menu/item1.jpg'} 
                                                    alt={item.name} 
                                                    width={80} 
                                                    height={80} 
                                                    className="w-20 h-20 rounded-lg object-cover" 
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                                        <p className="text-sm text-gray-600">₹{item.price} each</p>
                                                        {Object.entries(itemCustomizations).some(([_, selected]) => selected) && (
                                                            <div className="mt-1 text-xs text-gray-500">
                                                                {item.addOns?.filter(addon => itemCustomizations[addon.id]).map(addon => addon.name).join(', ')}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-800">₹{itemPrice}</p>
                                                        <div className="flex items-center space-x-2 mt-2">
                                                            <button 
                                                                onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                                                                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                                                            >
                                                                <MdRemove size={16} />
                                                            </button>
                                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                            <button 
                                                                onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                                                                className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded text-gray-600 hover:bg-gray-50"
                                                            >
                                                                <MdAdd size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add special instructions</h2>
                            <textarea
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                placeholder="Any suggestions? We will pass it on to the restaurant..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                rows={3}
                            />
                            <div className="flex items-center mt-4">
                                <input 
                                    type="checkbox" 
                                    id="no-contact" 
                                    checked={noContactDelivery}
                                    onChange={(e) => setNoContactDelivery(e.target.checked)}
                                    className="mr-2 w-4 h-4 text-orange-500"
                                />
                                <label htmlFor="no-contact" className="text-sm text-gray-700">
                                    Opt in for No-contact Delivery
                                </label>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose payment method</h2>
                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon
                                    return (
                                        <label
                                            key={method.id}
                                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                                                selectedPayment === method.id
                                                    ? 'border-orange-500 bg-orange-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="payment"
                                                value={method.id}
                                                checked={selectedPayment === method.id}
                                                onChange={(e) => setSelectedPayment(e.target.value)}
                                                className="mr-4 w-5 h-5 text-orange-500"
                                            />
                                            <Icon className="text-gray-600 mr-3" size={24} />
                                            <div className="flex-grow">
                                                <div className="font-semibold text-gray-800">{method.name}</div>
                                                <div className="text-sm text-gray-500">{method.description}</div>
                                            </div>
                                            {selectedPayment === method.id && (
                                                <MdCheckCircle className="text-orange-500" size={24} />
                                            )}
                                        </label>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Bill Details</h2>
                            
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Item Total</span>
                                    <span className="text-gray-800">₹{itemTotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Delivery Fee | 8.5 kms</span>
                                    <span className={deliveryFee === 0 ? 'text-green-600' : 'text-gray-800'}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">GST and Restaurant Charges</span>
                                    <span className="text-gray-800">₹{gst}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Platform Fee</span>
                                    <span className="text-gray-800">₹{platformFee}</span>
                                </div>
                                {appliedCoupon && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount ({appliedCoupon.code})</span>
                                        <span>-₹{discount}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-4 mb-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-gray-800">TO PAY</span>
                                    <span className="text-xl font-bold text-orange-500">₹{finalTotal}</span>
                                </div>
                            </div>

                            {/* Coupon Section */}
                            {!appliedCoupon ? (
                                <button
                                    onClick={() => setShowCouponInput(true)}
                                    className="w-full border-2 border-dashed border-[#ff5200] text-[#ff5200] py-3 px-4 rounded-lg font-semibold hover:bg-orange-50 transition mb-4 flex items-center justify-center"
                                >
                                    <MdLocalOffer className="mr-2" size={20} />
                                    Apply Coupon
                                </button>
                            ) : (
                                <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MdCheckCircle className="text-green-600 mr-2" size={20} />
                                        <span className="text-sm font-semibold text-green-700">{appliedCoupon.code}</span>
                                    </div>
                                    <button onClick={removeCoupon} className="text-red-500 hover:text-red-700">
                                        <MdClose size={20} />
                                    </button>
                                </div>
                            )}

                            {showCouponInput && (
                                <div className="mb-4 p-4 border border-gray-200 rounded-lg">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="Enter coupon code"
                                        className="w-full p-2 border border-gray-300 rounded mb-2"
                                    />
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={applyCoupon}
                                            className="flex-1 btn-orange py-2"
                                        >
                                            Apply
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowCouponInput(false)
                                                setCouponCode('')
                                            }}
                                            className="px-4 border border-gray-300 rounded hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedPayment}
                                className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center transition ${
                                    selectedPayment
                                        ? 'btn-orange shadow-lg'
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <MdLock className="mr-2" size={20} />
                                {selectedPayment ? `PAY ₹${finalTotal}` : 'SELECT PAYMENT METHOD'}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Select Address</h3>
                            <button onClick={() => setShowAddressModal(false)} className="text-gray-500">
                                <MdClose size={24} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {addresses.map((address, index) => (
                                <div
                                    key={address.id}
                                    onClick={() => {
                                        setSelectedAddress(index)
                                        setShowAddressModal(false)
                                    }}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                                        selectedAddress === index
                                            ? 'border-orange-500 bg-orange-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center mb-1">
                                                <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-semibold mr-2">
                                                    {address.type}
                                                </span>
                                                <span className="font-semibold">{address.name}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{address.address}</p>
                                            <p className="text-xs text-gray-500">{address.city} - {address.pincode}</p>
                                        </div>
                                        {selectedAddress === index && (
                                            <MdCheckCircle className="text-orange-500" size={24} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
