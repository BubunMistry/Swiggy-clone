"use client"; // This directive makes the component a Client Component

import { useState } from 'react';
import Link from 'next/link'; // Import Link for navigation

export default function Suggestion() {
  const [showMoreCities, setShowMoreCities] = useState(false);
  const [showMoreCuisines, setShowMoreCuisines] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50">
      {/* Section 1: Best Places to Eat Across Cities */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Best Places to Eat Across Cities</h2>
        <ul className="flex flex-wrap gap-3 text-gray-700">
          <Link href="/bangalore-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Bangalore
            </li>
          </Link>
          <Link href="/pune-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Pune
            </li>
          </Link>
          <Link href="/mumbai-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Mumbai
            </li>
          </Link>
          <Link href="/delhi-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Delhi
            </li>
          </Link>
          <Link href="/hyderabad-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Hyderabad
            </li>
          </Link>
          <Link href="/kolkata-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Kolkata
            </li>
          </Link>
          <Link href="/chennai-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Best Restaurants in Chennai
            </li>
          </Link>
          {showMoreCities && (
            <>
              <Link href="/chandigarh-restaurants" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Best Restaurants in Chandigarh
                </li>
              </Link>
              <Link href="/ahmedabad-restaurants" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Best Restaurants in Ahmedabad
                </li>
              </Link>
              <Link href="/jaipur-restaurants" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Best Restaurants in Jaipur
                </li>
              </Link>
              <Link href="/nagpur-restaurants" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Best Restaurants in Nagpur
                </li>
              </Link>
            </>
          )}
        </ul>
        <button
          onClick={() => setShowMoreCities(!showMoreCities)}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
        >
          {showMoreCities ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Section 2: Best Cuisines Near Me */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Best Cuisines Near Me</h2>
        <ul className="flex flex-wrap gap-3 text-gray-700">
          <Link href="/chinese-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Chinese Restaurant Near Me
            </li>
          </Link>
          <Link href="/south-indian-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              South Indian Restaurant Near Me
            </li>
          </Link>
          <Link href="/indian-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Indian Restaurant Near Me
            </li>
          </Link>
          <Link href="/kerala-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Kerala Restaurant Near Me
            </li>
          </Link>
          <Link href="/korean-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Korean Restaurant Near Me
            </li>
          </Link>
          <Link href="/north-indian-restaurant" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              North Indian Restaurant Near Me
            </li>
          </Link>
          {showMoreCuisines && (
            <>
              <Link href="/seafood-restaurant" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Seafood Restaurant Near Me
                </li>
              </Link>
              <Link href="/bengali-restaurant" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Bengali Restaurant Near Me
                </li>
              </Link>
              <Link href="/punjabi-restaurant" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Punjabi Restaurant Near Me
                </li>
              </Link>
              <Link href="/italian-restaurant" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Italian Restaurant Near Me
                </li>
              </Link>
              <Link href="/andhra-restaurant" className="no-underline">
                <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
                  Andhra Restaurant Near Me
                </li>
              </Link>
            </>
          )}
        </ul>
        <button
          onClick={() => setShowMoreCuisines(!showMoreCuisines)}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
        >
          {showMoreCuisines ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {/* Section 3: Explore Every Restaurant Near Me */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore Every Restaurant Near Me</h2>
        <ul className="flex flex-wrap gap-3 text-gray-700">
          <Link href="/restaurants-near-me" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Explore Restaurants Near Me
            </li>
          </Link>
          <Link href="/top-rated-restaurants" className="no-underline">
            <li className="bg-white border rounded-lg p-3 hover:bg-gray-100 cursor-pointer">
              Explore Top Rated Restaurants Near Me
            </li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
