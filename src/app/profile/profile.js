"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import {
  MdReceiptLong,
  MdFavoriteBorder,
  MdLocationOn,
  MdPayment,
  MdSettings,
  MdEdit,
  MdDelete,
  MdSave,
  MdClose,
  MdCameraAlt
} from 'react-icons/md';

import { AiFillPropertySafety } from "react-icons/ai";
import { FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const [activeMenu, setActiveMenu] = useState('orders');
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Bubun',
    email: 'bubune@example.com',
    phone: '+1234567890',
    avatar: '/assets/logo/user-avatar.png'
  });
  const [addresses, setAddresses] = useState([
    {
      id: '1',
      label: 'Work',
      address: '123 Tech Park, Sector 5',
      city: 'Kolkata',
      pincode: '700091',
      phone: '+91 9876543210'
    },
    {
      id: '2',
      label: 'Other',
      address: '456 Residential Complex, Block A',
      city: 'Kolkata',
      pincode: '700092',
      phone: '+91 9876543210'
    },
    {
      id: '3',
      label: 'Home',
      address: '789 Park Street, Near Metro Station',
      city: 'Kolkata',
      pincode: '700016',
      phone: '+91 9876543210'
    }
  ]);
  const [editForm, setEditForm] = useState({
    label: '',
    address: '',
    city: '',
    pincode: '',
    phone: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Load orders from localStorage
    const savedOrders = localStorage.getItem('swiggyOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleEditAddress = (id) => {
    const address = addresses.find(a => a.id === id);
    if (address) {
      setEditForm({ ...address });
      setEditingAddressId(id);
      setShowAddForm(false);
    }
  };

  const handleSaveAddress = () => {
    if (editingAddressId) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId ? { ...editForm } : addr
      ));
    } else {
      setAddresses([...addresses, { ...editForm, id: Date.now().toString() }]);
    }
    setEditingAddressId(null);
    setShowAddForm(false);
    setEditForm({ label: '', address: '', city: '', pincode: '', phone: '' });
  };

  const handleDeleteAddress = (id) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handleAddNewAddress = () => {
    setEditForm({ label: '', address: '', city: '', pincode: '', phone: '' });
    setEditingAddressId(null);
    setShowAddForm(true);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setShowAddForm(false);
    setEditForm({ label: '', address: '', city: '', pincode: '', phone: '' });
  };

  const handleSaveProfile = () => {
    setEditingProfile(false);
    // Save to localStorage
    localStorage.setItem('swiggyProfile', JSON.stringify(profileData));
  };

  const handleCancelProfileEdit = () => {
    setEditingProfile(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({...profileData, avatar: reader.result});
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('swiggyProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  return (
    <div className="container mx-auto pb-10 mt-8 px-6">
      {/* User Profile Header */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {!editingProfile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-[100px] h-[100px]"
                />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-semibold text-gray-800">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.email}</p>
                <p className="text-gray-600">{profileData.phone}</p>
              </div>
            </div>
            <button 
              onClick={() => setEditingProfile(true)}
              className="btn-orange"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="User Avatar"
                  width={100}
                  height={100}
                  className="rounded-full object-cover w-[100px] h-[100px]"
                />
                <label className="absolute bottom-0 right-0 bg-[#ff5200] text-white p-2 rounded-full hover:bg-[#e64900] transition cursor-pointer">
                  <MdCameraAlt size={16} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-grow space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveProfile}
                className="btn-orange flex items-center"
              >
                <MdSave className="mr-2" size={18} />
                Save Changes
              </button>
              <button
                onClick={handleCancelProfileEdit}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
              >
                <MdClose className="mr-2" size={18} />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex space-x-6">
        {/* Left Menu */}
        <div className="w-1/4 bg-white shadow-md rounded-lg p-4">
          <ul className="flex flex-col items-start py-5 space-y-12 pl-12">
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('orders')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'orders' ? 'text-orange-500' : ''
                  }`}
              >
                <MdReceiptLong className="mr-6 mb-0" size={24} />
                <span className="text-xl">Orders</span>
              </button>
            </li>
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('swiggyOne')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'swiggyOne' ? 'text-orange-500' : ''
                  }`}
              >
                <AiFillPropertySafety  className="mr-6 mb-0" size={24} />
                <span className="text-xl">Swiggy One</span>
              </button>
            </li>
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('favorites')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'favorites' ? 'text-orange-500' : ''
                  }`}
              >
                <MdFavoriteBorder className="mr-6 mb-0" size={24} />
                <span className="text-xl">Favorites</span>
              </button>
            </li>
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('addresses')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'addresses' ? 'text-orange-500' : ''
                  }`}
              >
                <MdLocationOn className="mr-6 mb-0" size={24} />
                <span className="text-xl">Addresses</span>
              </button>
            </li>
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('payments')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'payments' ? 'text-orange-500' : ''
                  }`}
              >
                <MdPayment className="mr-6 mb-0" size={24} />
                <span className="text-xl">Payments</span>
              </button>
            </li>
            <li className="flex items-start">
              <button
                onClick={() => setActiveMenu('settings')}
                className={`flex items-center text-gray-800 hover:text-orange-500 transition ${activeMenu === 'settings' ? 'text-orange-500' : ''
                  }`}
              >
                <MdSettings className="mr-6 mb-0" size={24} />
                <span className="text-xl">Settings</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Right Content */}
        <div className="w-3/4 bg-white shadow-md rounded-lg p-6">
          {activeMenu === 'orders' && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <MdReceiptLong className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500 text-lg">No orders yet</p>
                  <p className="text-gray-400 text-sm mt-2">Your orders will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.orderId} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <Image
                            src={order.image || order.restaurant?.image || '/assets/restaurants/burgerking.jpg'}
                            alt={order.restaurant?.name || 'Restaurant'}
                            width={96}
                            height={96}
                            className="rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold mb-1 text-gray-800">{order.restaurant?.name || 'Restaurant'}</h3>
                              <p className="text-sm text-gray-500 mb-1">{order.address?.address || order.location || order.address?.city || ''}</p>
                              <p className="text-xs text-gray-400">
                                ORDER {order.orderId} | {order.date || (order.timestamp ? new Date(order.timestamp).toLocaleString() : '')}
                              </p>
                            </div>
                            <div className="flex items-center text-[#00A651] bg-green-50 px-3 py-1 rounded-full">
                              <FaCheckCircle className="mr-1" size={16} />
                              <span className="text-sm font-semibold">Delivered</span>
                            </div>
                          </div>
                          <div className="border-t border-gray-200 pt-3 mt-3">
                            <div className="space-y-2 mb-3">
                              {order.items?.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-700">
                                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                                  </span>
                                  <span className="text-gray-800 font-medium">₹{item.itemTotal || (item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                              <span className="text-gray-600 font-medium">Total Paid</span>
                              <span className="text-lg font-bold text-[#ff5200]">₹{order.total}</span>
                            </div>
                            <div className="flex gap-3 mt-4">
                              <button className="btn-orange text-sm px-4 py-2">
                                Reorder
                              </button>
                              <button className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition">
                                Help
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeMenu === 'swiggyOne' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Swiggy One</h2>
              <p className="text-gray-600">
                Exclusive deals and promotions just for you! Sign up for Swiggy One to enjoy unlimited free delivery on all orders, early access to new features, and more.
              </p>
            </div>
          )}
          {activeMenu === 'favorites' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
              <p className="text-gray-600">Your favorite restaurants and dishes will appear here.</p>
            </div>
          )}
          {activeMenu === 'addresses' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Addresses</h2>
              <ul className="space-y-4">
                {addresses.map((address) => (
                  <li key={address.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    {editingAddressId === address.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Label (Home/Work/etc)"
                          value={editForm.label}
                          onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <textarea
                          placeholder="Address"
                          value={editForm.address}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="City"
                            value={editForm.city}
                            onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            placeholder="Pincode"
                            value={editForm.pincode}
                            onChange={(e) => setEditForm({...editForm, pincode: e.target.value})}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveAddress}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                          >
                            <MdSave className="mr-2" size={18} />
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                          >
                            <MdClose className="mr-2" size={18} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-2">
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold mr-3">
                              {address.label}
                            </span>
                          </div>
                          <p className="text-gray-800 font-medium mb-1">{address.address}</p>
                          <p className="text-gray-600 text-sm">{address.city} - {address.pincode}</p>
                          <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditAddress(address.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                          >
                            <MdEdit className="mr-1" size={18} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="border border-red-300 hover:bg-red-50 text-red-600 px-4 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                          >
                            <MdDelete className="mr-1" size={18} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              {showAddForm && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                  <h3 className="font-semibold mb-3">Add New Address</h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Label (Home/Work/etc)"
                      value={editForm.label}
                      onChange={(e) => setEditForm({...editForm, label: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={editForm.city}
                        onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={editForm.pincode}
                        onChange={(e) => setEditForm({...editForm, pincode: e.target.value})}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveAddress}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                      >
                        <MdSave className="mr-2" size={18} />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg transition duration-200 font-semibold flex items-center"
                      >
                        <MdClose className="mr-2" size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!showAddForm && editingAddressId === null && (
                <button
                  onClick={handleAddNewAddress}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg uppercase transition duration-200 mt-4 font-semibold"
                >
                  Add New Address
                </button>
              )}
            </div>
          )}
          {activeMenu === 'payments' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Payments</h2>
              <p className="text-gray-600">Manage your saved cards and payment methods here.</p>
            </div>
          )}
          {activeMenu === 'settings' && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Settings</h2>
              <p className="text-gray-600">Update your preferences and notification settings here.</p>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Notification & Email Notifications</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="notifications"
                    className="form-checkbox text-orange-500"
                  />
                  <label htmlFor="notifications" className="ml-2 text-gray-600">
                    Receive notifications about order status and promotions
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
