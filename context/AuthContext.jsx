import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || `Login failed (${res.status})`);
        return false;
      }

      if (!data?.token) {
        toast.error('Login failed (missing token)');
        return false;
      }

      sessionStorage.setItem('token', data.token);
      const nextUser = { _id: data._id, name: data.name, email: data.email };
      setUser(nextUser);
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      toast.success(`Welcome back, ${nextUser.name}!`);
      return true;
    } catch (error) {
      toast.error(error?.message || 'Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || `Registration failed (${res.status})`);
        return false;
      }

      if (!data?.token) {
        toast.error('Registration failed (missing token)');
        return false;
      }

      sessionStorage.setItem('token', data.token);
      const nextUser = { _id: data._id, name: data.name, email: data.email };
      setUser(nextUser);
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      toast.success(`Welcome, ${nextUser.name}!`);
      return true;
    } catch (error) {
      toast.error(error?.message || 'Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, phone, address, city, state, country, zipCode, password) => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone, address, city, state, country, zipCode, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || `Update failed (${res.status})`);
        return false;
      }

      sessionStorage.setItem('token', data.token);
      const nextUser = {
        _id: data._id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        zipCode: data.zipCode
      };
      setUser(nextUser);
      sessionStorage.setItem('user', JSON.stringify(nextUser));
      toast.success('Profile updated successfully!');
      return true;
    } catch (error) {
      toast.error(error?.message || 'Update failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch('/api/auth/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.message || `Account deletion failed (${res.status})`);
        return false;
      }

      setUser(null);
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      toast.success('Your account has been permanently deleted.');
      return true;
    } catch (error) {
      toast.error(error?.message || 'Account deletion failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    toast.success('You have been logged out.');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, register, updateProfile, deleteAccount, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};