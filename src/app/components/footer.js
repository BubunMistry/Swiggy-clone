"use client"; // This directive makes the component a Client Component

import Image from 'next/image'; // Import the Image component from Next.js

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 bottom-0 w-full">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo Section */}
          <div className="flex items-center">
            <Image
              src="/assets/logo/swiggy text.svg" // Path to your logo image
              alt="Swiggy Logo"
              width={150}
              height={50}
            />
          </div>

          {/* Company Section */}
          <div>
            <h5 className="font-bold text-white text-xl mb-4">Company</h5>
            <ul>
              <li><a href="#" className="hover:text-white">About</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Team</a></li>
              <li><a href="#" className="hover:text-white">Swiggy One</a></li>
              <li><a href="#" className="hover:text-white">Swiggy Instamart</a></li>
              <li><a href="#" className="hover:text-white">Swiggy Genie</a></li>
              <li><a href="#" className="hover:text-white">Contact us</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h5 className="font-bold text-white text-xl mb-4">Support</h5>
            <ul>
              <li><a href="#" className="hover:text-white">Help & Support</a></li>
              <li><a href="#" className="hover:text-white">Partner with us</a></li>
              <li><a href="#" className="hover:text-white">Ride with us</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h5 className="font-bold text-white text-xl mb-4">Legal</h5>
            <ul>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Investor Relations</a></li>
            </ul>
          </div>

          {/* Cities Section */}
          <div>
            <h5 className="font-bold text-white text-xl mb-4">We deliver to:</h5>
            <ul>
              <li><a href="#" className="hover:text-white">Bangalore</a></li>
              <li><a href="#" className="hover:text-white">Gurgaon</a></li>
              <li><a href="#" className="hover:text-white">Hyderabad</a></li>
              <li><a href="#" className="hover:text-white">Delhi</a></li>
              <li><a href="#" className="hover:text-white">Mumbai</a></li>
              <li><a href="#" className="hover:text-white">Pune</a></li>
              <li><a href="#" className="hover:text-white">589 cities</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 mb-2">© 2024 Bundl Technologies Pvt. Ltd</p>
          <p className="text-gray-500 text-sm">
            Made with <span className="text-red-500">♥</span> by <a href="https://fusiondev.in" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 transition">@Fusion Dev</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
