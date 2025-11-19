
import React from 'react';

const Newsletter: React.FC = () => {
    return (
        <section className="bg-white py-16 px-4 sm:px-8">
            <div className="container mx-auto text-center max-w-3xl">
                <h2 className="text-4xl font-extrabold text-brand-dark-blue mb-2">STAY INFORMED</h2>
                <div className="w-16 h-1 bg-brand-dark-blue mx-auto mb-4"></div>
                <p className="text-gray-600 mb-8">
                    Subscribe to our weekly newsletter to get the latest news and updates from Citizens' Atlas.
                </p>
                <form className="text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                            <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">First name <span className="text-red-500">*</span></label>
                            <input type="text" id="first-name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue" />
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">Last name <span className="text-red-500">*</span></label>
                            <input type="text" id="last-name" className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address <span className="text-red-500">*</span></label>
                        <input type="email" id="email" className="w-full p-3 border border-gray-300 rounded-md focus:ring-brand-medium-blue focus:border-brand-medium-blue" />
                    </div>
                    <div className="flex items-start mb-6">
                        <input id="privacy-policy" type="checkbox" className="h-4 w-4 text-brand-medium-blue border-gray-300 rounded focus:ring-brand-medium-blue mt-1"/>
                        <label htmlFor="privacy-policy" className="ml-2 text-sm text-gray-600">
                            View our <a href="#" className="text-brand-medium-blue hover:underline">Privacy Policy</a>.
                        </label>
                    </div>
                    <div className="text-center">
                        <button type="submit" className="bg-brand-light-blue text-white font-bold py-3 px-12 rounded-md hover:bg-blue-600 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
