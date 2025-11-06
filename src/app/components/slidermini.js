"use client";

import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import Link from 'next/link'; // Import Link from Next.js

const SliderMini = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderItems = [
    { id: 1, image: '/assets/carousel/biryani.png', link: '/restaurants/biryani' },
    { id: 2, image: '/assets/carousel/pizza.png', link: '/restaurants/pizza' },
    { id: 3, image: '/assets/carousel/momo.png', link: '/restaurants/momo' },
    { id: 4, image: '/assets/carousel/chinese.png', link: '/restaurants/chinese' },
    { id: 5, image: '/assets/carousel/noodles.png', link: '/restaurants/noodles' },
    { id: 6, image: '/assets/carousel/cakes.png', link: '/restaurants/cakes' },
    { id: 7, image: '/assets/carousel/dosa.png', link: '/restaurants/dosa' },
    { id: 8, image: '/assets/carousel/ice-cream.png', link: '/restaurants/ice-cream' },
    { id: 9, image: '/assets/carousel/kebabs.png', link: '/restaurants/kebabs' },
    { id: 10, image: '/assets/carousel/khichdi.png', link: '/restaurants/khichdi' },
    { id: 11, image: '/assets/carousel/north india.png', link: '/restaurants/north-india' },
    { id: 12, image: '/assets/carousel/paratha.png', link: '/restaurants/paratha' },
    { id: 13, image: '/assets/carousel/rolls.png', link: '/restaurants/rolls' },
    { id: 14, image: '/assets/carousel/sharma.png', link: '/restaurants/sharma' },
    { id: 15, image: '/assets/carousel/south india.png', link: '/restaurants/south-india' },
    { id: 16, image: '/assets/carousel/pasta.png', link: '/restaurants/pasta' },
    { id: 17, image: '/assets/carousel/pastry.png', link: '/restaurants/pastry' },
    { id: 18, image: '/assets/carousel/rasgulla.png', link: '/restaurants/rasgulla' },
    { id: 19, image: '/assets/carousel/burgers.png', link: '/restaurants/burgers' },
    { id: 20, image: '/assets/carousel/salad.png', link: '/restaurants/salad' },
  ];

  const handleSwipe = (event) => {
    const swipeDirection = event.dir;
    if (swipeDirection === 'Right') {
      setCurrentIndex((currentIndex - 1 + sliderItems.length) % sliderItems.length);
    } else if (swipeDirection === 'Left') {
      setCurrentIndex((currentIndex + 1) % sliderItems.length);
    }
  };

  const handlers = useSwipeable({
    onSwiped: handleSwipe,
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <div {...handlers} className="relative flex overflow-x-auto scrollbar-none container mx-auto py-4 md:hidden lg:hidden">
      <div className="flex flex-nowrap w-full">
        {sliderItems.map((item) => (
          <div key={item.id} className="flex-shrink-0 w-36 h-36 p-2"> {/* Adjusted size */}
            <Link href={item.link} passHref>
              <div className="bg-white rounded-lg h-full flex items-center justify-center overflow-hidden cursor-pointer">
                <img
                  src={item.image}
                  alt={`Food item ${item.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderMini;
