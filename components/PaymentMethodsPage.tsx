
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { ArrowLeftIcon } from './icons';

interface PaymentMethod {
    id: number;
    name: string;
    qrCodeImage: string; // base64 string
}

const PaymentMethodsPage: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const methodsJSON = localStorage.getItem('payment_methods_database');
        if (methodsJSON) {
            setMethods(JSON.parse(methodsJSON));
        }
    }, []);

    return (
        <div className="p-4 sm:p-6 bg-gray-900 min-h-full text-white animate-fade-in pb-20">
            <div className="flex items-center mb-6">
                <Link to="/account" className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={t('payment.backToAccount')}>
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-3xl font-bold text-white ms-4">{t('payment.title')}</h1>
            </div>

            <p className="text-gray-400 mb-8">{t('payment.subtitle')}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {methods.length > 0 ? (
                    methods.map(method => (
                        <div key={method.id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center">
                            <h2 className="text-2xl font-bold text-yellow-400 mb-4">{method.name}</h2>
                            <div className="bg-white p-2 rounded-lg">
                                <img 
                                    src={method.qrCodeImage} 
                                    alt={`${method.name} QR Code`} 
                                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain" 
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-800 p-8 rounded-lg text-center md:col-span-2">
                        <p className="text-gray-400 text-lg">{t('payment.noMethods')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodsPage;
