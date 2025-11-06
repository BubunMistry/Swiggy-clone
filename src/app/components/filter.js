"use client";

import { useState, useEffect } from 'react';
import { IoFilterSharp, IoSearchSharp } from 'react-icons/io5';
import { BiSolidSortAlt } from 'react-icons/bi';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Filter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/data/restaurants.json')
            .then(response => response.json())
            .then(data => {
                setRestaurants(data);
                setFilteredRestaurants(data);
            })
            .catch(error => console.error('Error fetching restaurants:', error));
    }, []);

    useEffect(() => {
        if (searchTerm.trim()) {
            const filtered = restaurants.filter(restaurant => 
                restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                restaurant.menuItems?.some(item => 
                    item.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredRestaurants(filtered);
        } else {
            setFilteredRestaurants(restaurants);
        }
    }, [searchTerm, restaurants]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <div className="lg:sticky top-0 z-10 flex flex-wrap gap-3 py-4 bg-white border-gray-200 container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Button with Icon */}
            <button className="flex items-center border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                <IoFilterSharp className="mr-1.5" size={14} />
                Filter
            </button>

            {/* Sort By Button with Icon */}
            <button className="flex items-center border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                <BiSolidSortAlt className="mr-1.5" size={14} />
                Sort By
                <svg className="ml-1.5 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Filter Buttons Without Icons */}
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Fast Delivery
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                New on Swiggy
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Ratings 4.0+
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Pure Veg
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Offers
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Rs. 300-Rs. 600
            </button>
            <button className="border-2 border-gray-300 font-bold rounded-full px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 text-xs transition shadow-sm">
                Less than Rs. 300
            </button>

            {/* Search Box with Icon */}
            <form onSubmit={handleSearchSubmit} className="ml-auto flex items-center flex-grow">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search restaurant and food"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border rounded-full px-4 py-3 bg-gray-100 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent pl-8 transition"
                    />
                    <IoSearchSharp className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                </div>
            </form>
        </div>
    );
}
