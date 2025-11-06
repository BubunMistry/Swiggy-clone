'use client'

import Link from 'next/link'
import { MdHome, MdSearch, MdRestaurant } from 'react-icons/md'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Image
            src="/assets/logo/swiggy-logo.png"
            alt="Swiggy"
            width={200}
            height={80}
            className="mx-auto mb-6"
          />
          <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-600 text-lg mb-8">
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link href="/" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <MdHome className="mx-auto mb-2 text-[#ff5200]" size={32} />
            <p className="font-semibold text-gray-800">Go Home</p>
          </Link>
          <Link href="/search" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <MdSearch className="mx-auto mb-2 text-[#ff5200]" size={32} />
            <p className="font-semibold text-gray-800">Search</p>
          </Link>
          <Link href="/offers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <MdRestaurant className="mx-auto mb-2 text-[#ff5200]" size={32} />
            <p className="font-semibold text-gray-800">Browse Restaurants</p>
          </Link>
        </div>

        <Link href="/" className="btn-orange inline-flex items-center">
          <MdHome className="mr-2" size={20} />
          Back to Home
        </Link>
      </div>
    </div>
  )
}

