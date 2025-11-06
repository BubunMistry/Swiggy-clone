'use client'

import { useEffect, useState } from 'react'
import { MdCheckCircle, MdHome, MdShoppingBag, MdAccessTime } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'

export default function ConfirmationPage() {
    const [orderData, setOrderData] = useState(null)

    useEffect(() => {
        const order = localStorage.getItem('lastOrder')
        if (order) {
            setOrderData(JSON.parse(order))
        }
    }, [])

    if (!orderData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">No order found</p>
                    <Link href="/" className="text-orange-500 hover:text-orange-600 mt-4 inline-block">
                        Go to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdCheckCircle className="text-[#00A651]" size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Your order has been confirmed and will be delivered soon</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                <p className="font-semibold text-gray-800">{orderData.orderId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Restaurant</p>
                                <p className="font-semibold text-gray-800">{orderData.restaurant?.name || 'Restaurant'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="font-semibold text-[#ff5200]">₹{orderData.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <div className="flex items-center justify-center space-x-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <MdAccessTime className="text-orange-500" size={24} />
                                </div>
                                <p className="text-sm text-gray-600">Estimated Delivery</p>
                                <p className="font-semibold text-gray-800">52 MINS</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <MdShoppingBag className="text-blue-500" size={24} />
                                </div>
                                <p className="text-sm text-gray-600">Items</p>
                                <p className="font-semibold text-gray-800">{orderData.items.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link
                            href="/"
                            className="inline-block w-full md:w-auto btn-orange px-8 py-3"
                        >
                            <MdHome className="inline mr-2" size={20} />
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                {/* Order Details */}
                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Order Details</h2>
                    <div className="space-y-4">
                        {orderData.items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                                <Image
                                    src={item.image || '/assets/menu/item1.jpg'}
                                    alt={item.name}
                                    width={60}
                                    height={60}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

