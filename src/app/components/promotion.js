"use client"; // This directive makes the component a Client Component

import Image from "next/image";


export default function Promotion() {
    return (
        <div className="bg-gray-200 text-black py-8 container mx-auto px-4 sm:px-6 lg:px-8 md:flex justify-evenly items-center">
            {/* Text Section */}
            <div className="mb-4 md:mb-0 md:w-1/2">
                <h2 className="text-center md:text-start text-2xl lg:text-4xl text-gray-700 font-bold mb-2">
                    For a better experience, <br /> download the Swiggy app now!
                </h2>
            </div>


            {/* logo Section */}
            <div className="flex gap-2 flex-row xs:flex-col items-center justify-center  ">
                <Image
                    src="/assets/logo/play_store.png" // Path to your logo image
                    alt="Swiggy Logo"
                    width={150}
                    height={70}
                />


                <Image
                    src="/assets/logo/app_store.png" // Path to your logo image
                    alt="Swiggy Logo"
                    width={150}
                    height={70}
                />
            </div>
        </div>
    );
}
