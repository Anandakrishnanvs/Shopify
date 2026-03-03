import React from 'react';

const ContactPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div
                className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-white tracking-wide">
                    Get In Touch
                </h1>
            </div>

            {/* Cards Section */}
            <div className="container mx-auto px-4 -mt-16 md:-mt-24 relative z-20 mb-20">
                <div className="flex flex-col md:flex-row gap-6 justify-center max-w-5xl mx-auto">

                    {/* Sales Card */}
                    <div className="bg-white p-8 md:p-12 shadow-lg flex-1 flex flex-col items-center text-center">
                        <div className="mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-black">
                                <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Talk To Sales</h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-8">
                            orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.....
                        </p>
                        <a href="#" className="text-gray-900 font-medium hover:underline mt-auto">
                            View all global Members
                        </a>
                    </div>

                    {/* Customer Support Card */}
                    <div className="bg-white p-8 md:p-12 shadow-lg flex-1 flex flex-col items-center text-center">
                        <div className="mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-black">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 00-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.712-1.538 5.236 5.236 0 013.712 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.651-1.098 3.736 3.736 0 00-2.651 1.098z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Customer support</h2>
                        <p className="text-gray-600 text-sm leading-relaxed mb-8">
                            orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.....
                        </p>
                        <button className="mt-auto border-2 border-black font-bold text-black py-2 px-6 hover:bg-black hover:text-white transition-colors">
                            Customer Support
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;
