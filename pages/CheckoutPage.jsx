import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
    const { cartItems, totalPrice, cartCount, clearCart } = useCart();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        paymentMethod: 'card',
        cardNumber: '',
        cardExpiry: '',
        cardCVC: '',
    });

    const [errors, setErrors] = useState({});
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [loading, setLoading] = useState(false);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const shipping = totalPrice > 5000 ? 0 : 499;
    const tax = totalPrice * 0.08;
    const grandTotal = totalPrice + shipping + tax;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Valid email is required';
        if (!form.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!form.address.trim()) newErrors.address = 'Address is required';
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.state.trim()) newErrors.state = 'State is required';
        if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
        if (!form.country.trim()) newErrors.country = 'Country is required';
        if (form.paymentMethod === 'card') {
            if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, '').length < 16)
                newErrors.cardNumber = 'Valid 16-digit card number is required';
            if (!form.cardExpiry.trim() || !/^\d{2}\/\d{2}$/.test(form.cardExpiry))
                newErrors.cardExpiry = 'Expiry in MM/YY format required';
            if (!form.cardCVC.trim() || form.cardCVC.length < 3)
                newErrors.cardCVC = 'Valid CVC required';
        }
        return newErrors;
    };

    const formatCardNumber = (val) => {
        return val
            .replace(/\D/g, '')
            .substring(0, 16)
            .replace(/(.{4})/g, '$1 ')
            .trim();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOrderPlaced(true);
            clearCart();
        }, 1800);
    };

    if (cartItems.length === 0 && !orderPlaced) {
        return (
            <div className="container mx-auto p-6 text-center py-20">
                <div className="text-6xl mb-4">🛒</div>
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-8">Add items before checking out.</p>
                <Link to="/products" className="bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-colors">
                    Shop Now
                </Link>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
                <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">Order Placed! 🎉</h1>
                    <p className="text-gray-500 mb-2">Thank you, <span className="font-semibold text-gray-700">{form.fullName}</span>!</p>
                    <p className="text-gray-500 mb-6">
                        Your order of <span className="font-semibold text-gray-700">₹{grandTotal.toFixed(2)}</span> has been confirmed.
                        A confirmation will be sent to <span className="font-semibold text-gray-700">{form.email}</span>.
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                        <p className="text-sm text-gray-500 font-semibold mb-1">Delivering to:</p>
                        <p className="text-sm text-gray-700">{form.address}, {form.city}, {form.state} {form.zip}</p>
                        <p className="text-sm text-gray-700">{form.country}</p>
                    </div>
                    <Link
                        to="/"
                        onClick={() => window.location.reload()}
                        className="w-full inline-block bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const inputClass = (field) =>
        `w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-300'
        }`;

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-900">Checkout</h1>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
                <Link to="/cart" className="hover:text-primary">Cart</Link>
                <span>›</span>
                <span className="text-gray-700 font-semibold">Checkout</span>
            </div>

            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Info */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Shipping Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" className={inputClass('fullName')} />
                                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClass('email')} />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" className={inputClass('phone')} />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input name="address" value={form.address} onChange={handleChange} placeholder="123 Main Street, Apt 4B" className={inputClass('address')} />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input name="city" value={form.city} onChange={handleChange} placeholder="New York" className={inputClass('city')} />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                                    <input name="state" value={form.state} onChange={handleChange} placeholder="NY" className={inputClass('state')} />
                                    {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                    <input name="zip" value={form.zip} onChange={handleChange} placeholder="10001" className={inputClass('zip')} />
                                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <select name="country" value={form.country} onChange={handleChange} className={inputClass('country')}>
                                        <option value="">Select country...</option>
                                        <option>United States</option>
                                        <option>India</option>
                                        <option>United Kingdom</option>
                                        <option>Canada</option>
                                        <option>Australia</option>
                                        <option>Germany</option>
                                        <option>France</option>
                                        <option>UAE</option>
                                        <option>Singapore</option>
                                        <option>Other</option>
                                    </select>
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-7 h-7 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                                Payment Method
                            </h2>

                            {/* Method Selector */}
                            <div className="flex gap-3 mb-5">
                                {['card', 'upi', 'cod'].map((method) => (
                                    <label key={method} className={`flex-1 border-2 rounded-lg p-3 cursor-pointer text-center text-sm font-semibold transition ${form.paymentMethod === method ? 'border-primary bg-blue-50 text-primary' : 'border-gray-200 text-gray-500'}`}>
                                        <input type="radio" name="paymentMethod" value={method} onChange={handleChange} className="sr-only" />
                                        {method === 'card' && '💳 Card'}
                                        {method === 'upi' && '📱 UPI'}
                                        {method === 'cod' && '💵 Cash on Delivery'}
                                    </label>
                                ))}
                            </div>

                            {form.paymentMethod === 'card' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                        <input
                                            name="cardNumber"
                                            value={form.cardNumber}
                                            onChange={(e) => setForm(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className={inputClass('cardNumber')}
                                        />
                                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                            <input
                                                name="cardExpiry"
                                                value={form.cardExpiry}
                                                onChange={(e) => {
                                                    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                                    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
                                                    setForm(prev => ({ ...prev, cardExpiry: val }));
                                                }}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className={inputClass('cardExpiry')}
                                            />
                                            {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                            <input
                                                name="cardCVC"
                                                value={form.cardCVC}
                                                onChange={(e) => setForm(prev => ({ ...prev, cardCVC: e.target.value.replace(/\D/g, '').substring(0, 4) }))}
                                                placeholder="123"
                                                maxLength={4}
                                                className={inputClass('cardCVC')}
                                            />
                                            {errors.cardCVC && <p className="text-red-500 text-xs mt-1">{errors.cardCVC}</p>}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1">🔒 Your card info is encrypted and secure.</p>
                                </div>
                            )}

                            {form.paymentMethod === 'upi' && (
                                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                    <p className="text-2xl mb-2">📱</p>
                                    <p>You'll be redirected to your UPI app after placing the order.</p>
                                </div>
                            )}

                            {form.paymentMethod === 'cod' && (
                                <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500 text-sm">
                                    <p className="text-2xl mb-2">💵</p>
                                    <p>Pay with cash when your order is delivered. No online payment needed.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h2 className="text-lg font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1">
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-center gap-3">
                                        <img src={item.images[0]} alt={item.name} className="w-12 h-12 object-cover rounded-md border" />
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">{item.selectedSize} · {item.selectedColor} · ×{item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
                                <div className="flex justify-between">
                                    <span>Subtotal ({cartCount} items)</span>
                                    <span>₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (8%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-green-600 bg-green-50 rounded px-2 py-1">🎉 You qualify for free shipping!</p>
                                )}
                            </div>

                            <div className="flex justify-between font-bold text-lg border-t mt-4 pt-4 text-gray-900">
                                <span>Total</span>
                                <span>₹{grandTotal.toFixed(2)}</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 bg-secondary text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors disabled:bg-orange-300 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        Placing Order...
                                    </>
                                ) : (
                                    '🛍️ Place Order'
                                )}
                            </button>

                            <Link to="/cart" className="block text-center text-sm text-primary hover:underline mt-3">
                                ← Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CheckoutPage;
