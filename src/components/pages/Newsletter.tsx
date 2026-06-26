'use client'

import React, { useState } from 'react';
import { InputField } from '@/components/ui/input-field';

const Newsletter: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        privacyAccepted: false,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!formData.privacyAccepted) {
            setMessage({ type: 'error', text: 'Please accept the privacy policy' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: 'Successfully subscribed to newsletter!' });
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    privacyAccepted: false,
                });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to subscribe' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'first-name' ? 'firstName' : 
             id === 'last-name' ? 'lastName' : 
             id === 'privacy-policy' ? 'privacyAccepted' : id]: 
             type === 'checkbox' ? checked : value,
        }));
    };

    return (
        <section className="bg-white py-16 px-4 sm:px-8">
            <div className="container mx-auto text-center max-w-3xl">
                <h2 className="atlas-display-heading text-brand-dark-blue mb-2">STAY INFORMED</h2>
                <div className="w-16 h-1 bg-brand-dark-blue mx-auto mb-4"></div>
                <p className="text-gray-600 mb-8">
                    Subscribe to our weekly newsletter to get the latest news and updates from Citizens' Atlas.
                </p>
                
                {message && (
                    <div className={`mb-6 p-4 rounded-md ${
                        message.type === 'success' 
                            ? 'bg-green-50 text-green-800 border border-green-200' 
                            : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                        {message.text}
                    </div>
                )}

                <form className="text-left" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <InputField
                            type="text"
                            id="first-name"
                            label="First name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        <InputField
                            type="text"
                            id="last-name"
                            label="Last name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-6">
                        <InputField
                            type="email"
                            id="email"
                            label="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="flex items-start mb-6">
                        <input 
                            id="privacy-policy" 
                            type="checkbox" 
                            checked={formData.privacyAccepted}
                            onChange={handleChange}
                            className="h-4 w-4 text-brand-medium-blue border-gray-300 rounded focus:ring-brand-medium-blue mt-1"
                            disabled={loading}
                        />
                        <label htmlFor="privacy-policy" className="ml-2 text-sm text-gray-600">
                            View our <a href="#" className="text-brand-medium-blue hover:underline">Privacy Policy</a>.
                        </label>
                    </div>
                    <div className="text-center">
                        <button 
                            type="submit" 
                            className="bg-brand-dark-blue text-white font-bold py-3 px-12 rounded-md hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
