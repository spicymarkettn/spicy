
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { ArrowLeftIcon } from './icons';

const ChangePasswordPage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            setError(t('changePassword.emptyFieldsError'));
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            setError(t('changePassword.passwordMismatchError'));
            return;
        }

        const currentUser = sessionStorage.getItem('currentUser');
        const usersJSON = localStorage.getItem('user_database');

        if (currentUser && usersJSON) {
            let users = JSON.parse(usersJSON);
            const userIndex = users.findIndex((u: any) => u.username === currentUser);

            if (userIndex === -1) {
                navigate('/');
                return;
            }

            const user = users[userIndex];
            if (user.password !== passwords.currentPassword) {
                setError(t('changePassword.currentPasswordError'));
                return;
            }

            users[userIndex] = { ...user, password: passwords.newPassword };
            localStorage.setItem('user_database', JSON.stringify(users));

            setSuccess(t('changePassword.passwordUpdatedSuccess'));
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });

            setTimeout(() => {
                setSuccess('');
                navigate('/account');
            }, 2000);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-900 min-h-full text-white animate-fade-in">
            <div className="flex items-center mb-6">
                <Link to="/account" className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={t('changePassword.backToAccount')}>
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-3xl font-bold text-white ms-4">{t('changePassword.title')}</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">{t('changePassword.currentPasswordLabel')}</label>
                    <input type="password" id="currentPassword" name="currentPassword" value={passwords.currentPassword} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">{t('changePassword.newPasswordLabel')}</label>
                    <input type="password" id="newPassword" name="newPassword" value={passwords.newPassword} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">{t('changePassword.confirmPasswordLabel')}</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" value={passwords.confirmPassword} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" required />
                </div>
                
                {error && <p className="text-red-400 text-center">{error}</p>}
                {success && <p className="text-green-400 text-center">{success}</p>}

                <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors disabled:bg-gray-500" disabled={!!success}>
                    {t('changePassword.saveButton')}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordPage;
