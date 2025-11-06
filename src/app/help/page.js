'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/footer'
import { MdHelpOutline, MdSearch, MdPhone, MdEmail, MdChat, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'Simply browse restaurants, add items to your cart, select your delivery address, choose a payment method, and place your order. You can track your order in real-time.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, Credit/Debit Cards, Wallets (Paytm, PhonePe, Amazon Pay), and Cash on Delivery.'
    },
    {
      id: 3,
      question: 'How long does delivery take?',
      answer: 'Delivery time varies by restaurant and location. Typically, orders are delivered within 30-45 minutes. You can see the estimated delivery time before placing your order.'
    },
    {
      id: 4,
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order within a few minutes of placing it. Once the restaurant starts preparing your order, cancellation may not be possible.'
    },
    {
      id: 5,
      question: 'Do you offer refunds?',
      answer: 'Refunds are processed for cancelled orders or in case of issues with your order. Refunds are credited to your original payment method within 5-7 business days.'
    },
    {
      id: 6,
      question: 'How do I track my order?',
      answer: 'You can track your order from the Orders section in your profile. You will receive real-time updates about your order status.'
    },
    {
      id: 7,
      question: 'What if I have a complaint?',
      answer: 'You can reach out to us through the Help section in your order details, or contact our customer support team via email or phone.'
    },
    {
      id: 8,
      question: 'Are there any delivery charges?',
      answer: 'Delivery charges vary based on distance and restaurant. Orders above ₹500 usually have free delivery. You can see the delivery fee before placing your order.'
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <MdHelpOutline className="mx-auto mb-4 text-[#ff5200]" size={64} />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">How can we help you?</h1>
            <p className="text-gray-600 text-lg">Find answers to common questions</p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#ff5200] focus:border-transparent text-lg"
              />
              <MdSearch className="absolute left-4 top-4 text-gray-400" size={24} />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdPhone className="text-blue-600" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">+91 1800-123-4567</p>
              <p className="text-sm text-gray-500">24/7 Support</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdEmail className="text-[#00A651]" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">support@swiggy.com</p>
              <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MdChat className="text-[#ff5200]" size={32} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Chat with us</p>
              <p className="text-sm text-gray-500">Available 9 AM - 9 PM</p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                filteredFaqs.map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-800 text-left">{faq.question}</span>
                      {openFaq === faq.id ? (
                        <MdKeyboardArrowUp className="text-[#ff5200]" size={24} />
                      ) : (
                        <MdKeyboardArrowDown className="text-gray-400" size={24} />
                      )}
                    </button>
                    {openFaq === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

