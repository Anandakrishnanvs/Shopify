import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-10 hidden md:block">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">S</div>
            <div>
              <p className="font-bold text-sm leading-tight">Shopify</p>
              <p className="text-gray-400 text-xs">ONLINE SHOPPING</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1"><span className="text-white font-semibold">Address:</span>Thirunakara , Kottayam</p>
          <p className="text-gray-400 text-sm mb-1"><span className="text-white font-semibold">E-mail:</span> shopifyy31@gmail.com</p>
          <p className="text-gray-400 text-sm"><span className="text-white font-semibold">Phone:</span> 0481-281234</p>
        </div>

        {/* Shopping and Categories */}
        <div>
          <h3 className="font-bold text-base mb-4">Shopping and Categories</h3>
          <ul className="space-y-2">
            <li><Link to="/products/Men" className="text-gray-400 hover:text-white transition-colors text-sm">Men's Shopping</Link></li>
            <li><Link to="/products/Women" className="text-gray-400 hover:text-white transition-colors text-sm">Women's Shopping</Link></li>
            <li><Link to="/products/Kids" className="text-gray-400 hover:text-white transition-colors text-sm">Kid's Shopping</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="font-bold text-base mb-4">Useful Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Homepage</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">Help</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
          </ul>
        </div>

        {/* Help & Information */}
        <div>
          <h3 className="font-bold text-base mb-4">Help &amp; Information</h3>
          <ul className="space-y-2">
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ'S</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">Tracking Id</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-500 mt-8 pt-8 border-t border-gray-700 text-sm">
        © 2024 Shopify Online Shopping. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;