'use client'

import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import { MdBusiness, MdPeople, MdEmail, MdPhone, MdLocationOn, MdArrowRight } from 'react-icons/md'
import Image from 'next/image'
import Link from 'next/link'

export default function CorporatePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#ff5200] to-[#ff6b2b] text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <MdBusiness className="mx-auto mb-6" size={64} />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Swiggy Corporate</h1>
              <p className="text-xl mb-8">Delicious food delivered to your office, every day</p>
              <button className="btn-orange bg-white text-[#ff5200] hover:bg-gray-100 px-8 py-3 text-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdPeople className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Meals</h3>
              <p className="text-gray-600">Order meals for your entire team with bulk discounts and flexible scheduling.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdBusiness className="text-[#00A651]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Corporate Accounts</h3>
              <p className="text-gray-600">Set up corporate accounts with invoicing, expense management, and reporting.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdLocationOn className="text-[#ff5200]" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Locations</h3>
              <p className="text-gray-600">Manage orders across multiple office locations from a single dashboard.</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Get in Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#ff5200] rounded-full flex items-center justify-center flex-shrink-0">
                  <MdEmail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                  <p className="text-gray-600">corporate@swiggy.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#ff5200] rounded-full flex items-center justify-center flex-shrink-0">
                  <MdPhone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                  <p className="text-gray-600">+91 1800-123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

