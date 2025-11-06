"use client";

import { useState, useEffect } from "react";
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
  );
};

const OfferPage = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('/data/restaurants.json');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setRestaurants(data.slice(0, 16)); // Ensure we only display up to 16 items
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};

export default OfferPage;
