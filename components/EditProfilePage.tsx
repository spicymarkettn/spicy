
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';
import { ArrowLeftIcon, AccountIcon } from './icons';

interface UserProfile {
  username: string;
  displayName: string;
  photo: string;
  address: string;
  phone: string;
}

const EditProfilePage: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>({
        username: '',
        displayName: '',
        photo: '',
        address: '',
        phone: '',
    });
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const currentUser = sessionStorage.getItem('currentUser');
        const usersJSON = localStorage.getItem('user_database');
        if (currentUser && usersJSON) {
            const users = JSON.parse(usersJSON);
            const userProfile = users.find((u: any) => u.username === currentUser);
            if (userProfile) {
                setProfile(userProfile);
            } else {
                navigate('/account');
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfile(prev => ({ ...prev, photo: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const usersJSON = localStorage.getItem('user_database');
        if (usersJSON) {
            let users = JSON.parse(usersJSON);
            users = users.map((u: any) => u.username === profile.username ? profile : u);
            localStorage.setItem('user_database', JSON.stringify(users));
            setSuccessMessage(t('editProfile.successMessage'));
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-900 min-h-full text-white animate-fade-in">
            <div className="flex items-center mb-6">
                <Link to="/account" className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={t('editProfile.backToAccount')}>
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-3xl font-bold text-white ms-4">{t('editProfile.title')}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                <div className="flex flex-col items-center space-y-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                        {profile.photo ? (
                            <img src={profile.photo} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 hover:border-yellow-500 transition-colors" />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-700 hover:border-yellow-500 transition-colors">
                                <AccountIcon className="w-16 h-16 text-gray-500" />
                            </div>
                        )}
                    </label>
                    <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    <label htmlFor="photo-upload" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg cursor-pointer transition-colors">
                        {t('editProfile.uploadButton')}
                    </label>
                </div>
                
                <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">{t('editProfile.displayNameLabel')}</label>
                    <input type="text" id="displayName" name="displayName" value={profile.displayName} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">{t('editProfile.addressLabel')}</label>
                    <textarea id="address" name="address" value={profile.address} onChange={handleInputChange} rows={3} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">{t('editProfile.phoneLabel')}</label>
                    <input type="tel" id="phone" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                </div>
                
                {successMessage && <p className="text-green-400 text-center">{successMessage}</p>}
                
                <button type="submit" className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold rounded-lg transition-colors">
                    {t('editProfile.saveButton')}
                </button>
            </form>
        </div>
    );
};

export default EditProfilePage;
