'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { MdAccessTime, MdCheckCircle, MdHome, MdShoppingBag } from 'react-icons/md'
import Link from 'next/link'
import Image from 'next/image'
import DeliveryTracker from '../../components/DeliveryTracker'
import { useRealtimeOrder } from '../../../hooks/useRealtimeOrder'

function ConfirmationContent() {
    const searchParams = useSearchParams()
    const [orderId, setOrderId] = useState(null)

    useEffect(() => {
        setOrderId(searchParams.get('order') || localStorage.getItem('lastOrderId'))
    }, [searchParams])

    const { order: orderData, loading } = useRealtimeOrder(orderId)

    if (loading || (orderId && !orderData)) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Loading live order...</div>
    }

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

    const items = orderData.order_items || []

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MdCheckCircle className="text-[#00A651]" size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h1>
                        <p className="text-gray-600">Your order is live and will update automatically</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Order ID</p>
                                <p className="font-semibold text-gray-800">{orderData.order_number}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Restaurant</p>
                                <p className="font-semibold text-gray-800">{orderData.restaurant?.name || 'Restaurant'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                                <p className="font-semibold text-[#ff5200]">Rs {orderData.total}</p>
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
                                <p className="font-semibold text-gray-800">{items.length}</p>
                            </div>
                        </div>
                    </div>

                    <Link href="/" className="inline-block w-full md:w-auto btn-orange px-8 py-3">
                        <MdHome className="inline mr-2" size={20} />
                        Continue Shopping
                    </Link>
                </div>

                <div className="mt-6">
                    <DeliveryTracker order={orderData} />
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Order Details</h2>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-0">
                                <Image
                                    src={item.menu_item?.image || '/assets/menu/item1.jpg'}
                                    alt={item.item_name}
                                    width={60}
                                    height={60}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-800">{item.item_name}</h3>
                                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">Rs {item.line_total}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ConfirmationPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">Loading live order...</div>}>
            <ConfirmationContent />
        </Suspense>
    )
}
