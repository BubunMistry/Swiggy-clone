"use client";

import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Link from "next/link";

const getRestaurantNameFromImage = (imagePath) => {
    const nameWithExtension = imagePath.split("/").pop();
    return nameWithExtension
        .replace(".jpg", "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const RestaurantCard = ({ restaurant }) => {
    const path = `/restaurants/${restaurant.id}`;
    const ratingCount = Math.floor(Math.random() * 5 + 3) + 'K+';
    const cuisine = restaurant.cuisine || 'Fast Food, Burgers, Rolls & Wraps';

    return (
        <div className="p-4">
            <Link href={path}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform transition-all duration-300 hover:-translate-y-2 border border-gray-100 group cursor-pointer">
                    <div className="relative overflow-hidden">
                        <img
                            src={restaurant.image}
                            alt={restaurant.name}
                            className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-2xl shadow-lg">
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                                <span className="text-yellow-400">⭐</span> {restaurant.rating} <span className="text-gray-300 font-normal">({ratingCount} ratings)</span>
                            </span>
                        </div>
                    </div>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-[#ff5200] transition-colors duration-300">{restaurant.name}</h3>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {restaurant.deliveryTime}
                            </span>
                            {restaurant.costForTwo && (
                                <span className="text-xs font-semibold text-[#ff5200] bg-orange-50 px-2 py-1 rounded-full">
                                    ₹{restaurant.costForTwo} for two
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mb-2">{cuisine}</p>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-3">{restaurant.address}</p>
                    </div>
                </div>
            </Link>
        </div>
    );
};

const RestaurantSlider = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4;

    useEffect(() => {
        fetch('/data/restaurants.json')
            .then(response => response.json())
            .then(data => {
                setRestaurants(data);
            })
            .catch(error => console.error('Error fetching restaurant data:', error));
    }, []);

    const totalItems = restaurants.length;
    const maxIndex = Math.ceil(totalItems / itemsToShow) - 1;

    const handleNext = () => {
        if (currentIndex < maxIndex) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handlers = useSwipeable({
        onSwipedLeft: handleNext,
        onSwipedRight: handlePrev,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 hidden lg:block"> {/* Hide on md and below, show on lg and above */}
            <div {...handlers} className="relative flex items-center">
                <button
                    onClick={handlePrev}
                    className={`absolute left-0 z-10 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition duration-300 ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={currentIndex === 0}
                >
                    &lt;
                </button>
                <div className="overflow-hidden w-full">
                    <div
                        className="flex transition-transform duration-500"
                        style={{
                            transform: `translateX(-${currentIndex * (400 / itemsToShow)}%)`,
                            width: `${(totalItems / itemsToShow) * 25}%`,
                        }}
                    >
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                style={{ flex: `0 0 ${100 / itemsToShow}%` }}
                            >
                                <RestaurantCard restaurant={restaurant} />
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={handleNext}
                    className={`absolute right-0 z-10 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-800 transition duration-300 ${currentIndex >= maxIndex ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    disabled={currentIndex >= maxIndex}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default RestaurantSlider;
