"use client";

import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { FaStar } from 'react-icons/fa'; // Import star icon
import Link from 'next/link'; // Import Link

const Shopssmall = () => {
  const [sliderItems, setSliderItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('/data/restaurants.json');
        const data = await response.json();
        setSliderItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSwipe = (event) => {
    const swipeDirection = event.dir;
    if (swipeDirection === 'Right') {
      setCurrentIndex((currentIndex + 1) % sliderItems.length);
    } else if (swipeDirection === 'Left') {
      setCurrentIndex((currentIndex - 1 + sliderItems.length) % sliderItems.length);
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwipe,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div className="block lg:hidden" {...handlers}> {/* Show on sm to md, hide on lg and above */}
      <div className="relative flex overflow-x-auto scrollbar-none container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-nowrap w-full px-5">
          {sliderItems.map((item) => (
            <Link key={item.id} href={`/restaurants/${item.id}`} passHref>
              <div className="flex-shrink-0 w-40 h-auto p-2 cursor-pointer group">
                <div className="bg-white rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-md hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 border border-gray-100">
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={`Restaurant ${item.name}`}
                      className="w-full h-28 object-cover mb-2 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-1 right-1 bg-white px-1.5 py-0.5 rounded shadow-sm border border-green-100">
                      <FaStar className="text-[#00A651] inline mr-0.5" size={8} />
                      <span className="text-[10px] font-bold text-[#00A651]">{item.rating}</span>
                    </div>
                  </div>
                  {/* Restaurant details */}
                  <div className="text-center px-2 pb-2">
                    <p className="text-sm font-bold text-gray-800 mb-1 line-clamp-1">{item.name}</p> {/* Restaurant name */}
                    <div className="flex items-center justify-center mb-1">
                      <FaStar className="text-[#00A651] mr-1" size={12} /> {/* Star icon - green */}
                      <p className="text-xs font-bold text-[#00A651]">{item.rating}</p> {/* Rating */}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">Delivery: {item.deliveryTime}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{item.address}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shopssmall;
