'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MdLocationOn, MdKeyboardArrowDown, MdSearch, MdLocalOffer, MdHelp, MdPerson, MdShoppingCart, MdMenu, MdClose } from 'react-icons/md'
import { useCart } from '../context/CartContext'

export default function Navbar() {
    const [location, setLocation] = useState('Khudirabad, Daspara, Bipadbhanjan ...')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearchInput, setShowSearchInput] = useState(false)
    const router = useRouter()
    const { getTotalItems } = useCart()
    const cartCount = getTotalItems()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
            setSearchQuery('')
            setShowSearchInput(false)
        }
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between lg:justify-evenly h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <Link href="/">
                                <Image src="/assets/logo/swiggy-logo.png" alt="Logo" width={60} height={25} className="text-orange-500 transform hover:scale-110 cursor-pointer" />
                            </Link>
                        </div>
                        <div className="hidden lg:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="/" className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                                    <span className="font-bold underline">HOME</span>
                                    <span className="ml-2 text-gray-500 no-underline max-w-xs truncate">{location}</span>
                                    <MdKeyboardArrowDown className="ml-1" />
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            <Link href="/corporate" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center">
                                <MdLocationOn className="mr-1" size={20} />

                                Swiggy Corporate
                            </Link>
                            <div className="relative">
                                {showSearchInput ? (
                                    <form onSubmit={handleSearch} className="flex items-center" onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search restaurants and food"
                                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                                            autoFocus
                                            onBlur={(e) => {
                                                // Delay to allow form submission
                                                setTimeout(() => {
                                                    if (!e.target.value) {
                                                        setShowSearchInput(false)
                                                    }
                                                }, 200)
                                            }}
                                        />
                                        <button type="submit" className="ml-2 btn-orange px-4 py-2">
                                            <MdSearch size={20} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSearchInput(false)
                                                setSearchQuery('')
                                            }}
                                            className="ml-2 text-gray-500 hover:text-gray-700"
                                        >
                                            <MdClose size={20} />
                                        </button>
                                    </form>
                                ) : (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setShowSearchInput(true)
                                        }}
                                        className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center"
                                    >
                                        <MdSearch className="mr-1" size={20} />
                                        Search
                                    </button>
                                )}
                            </div>
                            <Link href="/offers" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center">
                                <MdLocalOffer className="mr-1" size={20} />
                                Offers
                                <span className="ml-1 bg-yellow-400 text-xs font-bold px-1 rounded">NEW</span>
                            </Link>
                            <Link href="/help" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center">
                                <MdHelp className="mr-1" size={20} />
                                Help
                            </Link>
                            <Link href="/profile" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center">
                                <MdPerson className="mr-1" size={23} />
                                Bubun
                            </Link>
                            <Link href="/checkout" className="text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-md font-medium flex items-center">
                                <MdShoppingCart className="mr-1" size={20} />
                                Cart
                                {cartCount > 0 && (
                                    <span className="ml-1 bg-[#00A651] text-white text-xs font-bold px-1 rounded">{cartCount}</span>
                                )}
                            </Link>
                        </div>
                    </div>
                    <div className="flex md:hidden">
                        <button
                            onClick={() => router.push('/search')}
                            className="text-gray-700 hover:bg-gray-100 p-2 rounded-md"
                        >
                            <MdSearch className="h-6 w-6" size={20} />
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                            aria-controls="mobile-menu"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <MdClose className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <MdMenu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state. */}
            <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`} id="mobile-menu">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link href="/" className="text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        HOME
                    </Link>
                    <Link href="/corporate" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        Swiggy Corporate
                    </Link>
                    <Link href="/offers" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        Offers
                        <span className="ml-1 bg-yellow-400 text-xs font-bold px-1 rounded">NEW</span>
                    </Link>
                    <Link href="/help" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        Help
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        Bubun
                    </Link>
                    <Link href="/checkout" className="text-gray-700 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                        Cart
                        {cartCount > 0 && (
                            <span className="ml-1 bg-[#00A651] text-white text-xs font-bold px-1 rounded">{cartCount}</span>
                        )}
                    </Link>
                </div>
            </div>
        </nav>
    )
}