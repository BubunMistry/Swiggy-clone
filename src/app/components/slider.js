"use client";

import { useEffect } from 'react';
import Splide from '@splidejs/splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';




const Slider = () => {



  useEffect(() => {
    // Initialize Splide slider
    const splide = new Splide('.splide', {
      type   : 'loop',
      drag   : 'free',
      perPage: 10, // Show 10 images per page
      gap    : '1rem', // Adjust the gap between slides as needed
      breakpoints: {
        1024: {
          perPage: 6, // Adjust for medium screens
        },
        768: {
          perPage: 4, // Adjust for small screens
        },
        480: {
          perPage: 4, // Adjust for very small screens
        },
      },
    }).mount();
    
    return () => splide.destroy(); // Cleanup on component unmount
  }, []);

  const sliderItems = [
    { id: 1, image: '/assets/carousel/biryani.png', link: '/search?q=biryani' },
    { id: 2, image: '/assets/carousel/pizza.png', link: '/search?q=pizza'},
    { id: 3, image: '/assets/carousel/momo.png', link:'/search?q=momo' },
    { id: 4, image: '/assets/carousel/chinese.png', link: '/search?q=chinese' },
    { id: 5, image: '/assets/carousel/noodles.png', link: '/search?q=noodles' },
    { id: 6, image: '/assets/carousel/cakes.png', link: '/search?q=cake' },
    { id: 7, image: '/assets/carousel/dosa.png', link:'/search?q=dosa' },
    { id: 8, image: '/assets/carousel/ice-cream.png', link: '/search?q=ice cream' },
    { id: 9, image: '/assets/carousel/kebabs.png', link: '/search?q=kebab' },
    { id: 10, image: '/assets/carousel/khichdi.png', link: '/search?q=khichdi' },
    { id: 11, image: '/assets/carousel/north india.png', link: '/search?q=north' },
    { id: 12, image: '/assets/carousel/paratha.png', link: '/search?q=paratha' },
    { id: 13, image: '/assets/carousel/rolls.png', link: '/search?q=rolls' },
    { id: 14, image: '/assets/carousel/sharma.png', link: '/search?q=shawarma' },
    { id: 15, image: '/assets/carousel/south india.png', link: '/search?q=south' },
    { id: 16, image: '/assets/carousel/pasta.png', link: '/search?q=pasta' },
    { id: 17, image: '/assets/carousel/pastry.png', link: '/search?q=pastry' },
    { id: 18, image: '/assets/carousel/rasgulla.png', link: '/search?q=rasgulla' },
    { id: 19, image: '/assets/carousel/burgers.png', link: '/search?q=burger' },
    { id: 20, image: '/assets/carousel/salad.png', link: '/search?q=salad' },
  ];

  return (
    <div className="hidden md:block container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="splide">
        <div className="splide__track">
          <ul className="splide__list">
            {sliderItems.map(item => (
              <li key={item.id} className="splide__slide">
                <a href={item.link}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={`Food item ${item.id}`} className="w-full h-auto object-cover" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Slider;
