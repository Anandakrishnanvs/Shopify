import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, isLoggedIn, logout, updateProfile, deleteAccount, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    password: '',
  });

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        country: user.country || '',
        zipCode: user.zipCode || '',
        password: '',
      });
    }
  }, [isLoggedIn, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const success = await updateProfile(
      formData.name,
      formData.phone,
      formData.address,
      formData.city,
      formData.state,
      formData.country,
      formData.zipCode,
      formData.password
    );
    if (success) {
      setIsEditing(false);
      setFormData({ ...formData, password: '' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) {
      const success = await deleteAccount();
      if (success) {
        navigate('/');
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold">My Profile</h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 234 567 8900"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                placeholder="Street address..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip / Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password (leave blank to keep current)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    phone: user.phone || '',
                    address: user.address || '',
                    city: user.city || '',
                    state: user.state || '',
                    country: user.country || '',
                    zipCode: user.zipCode || '',
                    password: ''
                  });
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded focus:outline-none transition"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
              </div>
            )}
            {user.address && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <p className="mt-1 text-lg text-gray-900">
                  {user.address}
                  {(user.city || user.state) && <br />}
                  {[user.city, user.state].filter(Boolean).join(', ')}
                  {(user.zipCode || user.country) && <br />}
                  {[user.zipCode, user.country].filter(Boolean).join(' ')}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 pt-6 border-t flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-2 px-4 rounded transition text-center"
          >
            Logout
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 bg-red-100 hover:bg-red-600 text-red-700 hover:text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;