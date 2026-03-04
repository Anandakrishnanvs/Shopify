import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
    {
        question: 'What Is Shopify and How Does It Sell?',
        answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
        question: 'Can I Get a Fashion Designer Here?',
        answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    },
    {
        question: 'How Do I Track My Order?',
        answer:
            'Once your order is shipped, you will receive an email with a tracking number. You can use this number on our Tracking page or directly on the carrier\'s website to monitor the status of your delivery in real time.',
    },
    {
        question: 'What Is Your Return Policy?',
        answer:
            'We offer a 30-day return policy on all unused and unwashed items with original tags attached. To initiate a return, visit your profile page and select the order you wish to return. Refunds are processed within 5–7 business days after we receive the item.',
    },
    {
        question: 'What Payment Methods Do You Accept?',
        answer:
            'We accept all major credit and debit cards (Visa, Mastercard, Amex), UPI, net banking, and Cash on Delivery for eligible pin codes. All online transactions are secured with 256-bit SSL encryption.',
    },
    {
        question: 'How Long Does Shipping Take?',
        answer:
            'Standard shipping takes 5–7 business days. Express shipping (2–3 business days) is available at checkout for an additional fee. Orders above ₹5000 qualify for free standard shipping automatically.',
    },
    {
        question: 'Can I Change or Cancel My Order?',
        answer:
            'You can modify or cancel your order within 1 hour of placing it by contacting our support team. After the order is dispatched, cancellations are not possible, but you may initiate a return once the item is delivered.',
    },
    {
        question: 'Are the Product Sizes True to Size?',
        answer:
            'Our products generally run true to size. Each product page includes a detailed size guide. If you are between sizes, we recommend sizing up for a more comfortable fit. Feel free to contact us if you need personalised sizing advice.',
    },
];

const AccordionItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 last:border-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center py-4 text-left text-gray-800 font-semibold hover:text-primary transition-colors"
            >
                <span>{question}</span>
                <span className={`text-xl transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>+</span>
            </button>
            {open && (
                <p className="text-gray-600 text-sm leading-relaxed pb-4 pr-4">
                    {answer}
                </p>
            )}
        </div>
    );
};

const FAQPage = () => {
    const half = Math.ceil(faqs.length / 2);
    const leftFaqs = faqs.slice(0, half);
    const rightFaqs = faqs.slice(half);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-white px-6 py-12 md:py-16">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Shopify FAQ'S</h1>
                    <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                        been the industry's standard dummy text ever since the 1500s, when an unknown printer took a
                        galley of type and scrambled it to make a type specimen book. It has survived not only five
                        centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It
                        was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
                        passages, and more recently with desktop publishing software like Aldus PageMaker including
                        versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting
                        industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when
                        an unknown printer took a galley of type and scrambled it to make a type specimen book. It has
                        survived not only five centuries, but also the leap into electronic typesetting, remaining
                        essentially unchanged.
                    </p>
                </div>
            </section>

            {/* Get Started Section */}
            <section className="bg-gray-100 px-6 py-12 md:py-16">
                <div className="container mx-auto max-w-5xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
                        Get Started Shopping With Shopify
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                        {/* Left Column */}
                        <div>
                            {leftFaqs.map((faq, i) => (
                                <AccordionItem key={i} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                        {/* Right Column */}
                        <div>
                            {rightFaqs.map((faq, i) => (
                                <AccordionItem key={i} question={faq.question} answer={faq.answer} />
                            ))}
                        </div>
                    </div>

                    {/* Discover More Button */}
                    <div className="flex justify-center mt-10">
                        <Link
                            to="/products"
                            className="border-2 border-gray-800 text-gray-800 font-semibold px-10 py-3 rounded hover:bg-gray-800 hover:text-white transition-colors duration-300"
                        >
                            Discover More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FAQPage;
