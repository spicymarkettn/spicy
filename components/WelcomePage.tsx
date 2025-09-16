import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { BasketIcon } from './icons';

const WelcomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-8 animate-fade-in">
            <div className="mb-8">
                 <div className="bg-yellow-400 p-6 rounded-full inline-block mb-6 shadow-lg transform transition-transform hover:scale-110">
                    <BasketIcon className="w-16 h-16 text-gray-900" />
                 </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white" style={{ animation: 'fadeInDown 1s' }}>
                    {t('welcome.title')}{' '}
                    <span className="text-yellow-400">{t('header.appNameSpicy')}{t('header.appNameMarket')}</span>
                </h1>
                <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto" style={{ animation: 'fadeInUp 1s 0.5s', animationFillMode: 'backwards' }}>
                    {t('welcome.subtitle')}
                </p>
            </div>

            <div style={{ animation: 'fadeInUp 1s 1s', animationFillMode: 'backwards' }}>
                <Link
                    to="/signin"
                    className="inline-block py-4 px-10 bg-yellow-500 hover:bg-yellow-600 rounded-full text-gray-900 font-bold text-xl transition-transform duration-300 transform hover:scale-105 shadow-xl"
                >
                    {t('welcome.getStarted')}
                </Link>
            </div>
            
            <style>{`
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default WelcomePage;
