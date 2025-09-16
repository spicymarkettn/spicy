

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../lib/i18n';

const SignInPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();

  useEffect(() => {
    const regularUsersJSON = localStorage.getItem('user_database');
    const database = regularUsersJSON ? JSON.parse(regularUsersJSON) : [];

    const defaultUserExists = database.some((user: any) => user.username === '1');

    if (!defaultUserExists) {
      const defaultUser = {
        username: '1',
        password: '1',
        timestamp: new Date().toISOString(),
        role: 'user',
        displayName: '1',
        photo: '',
        address: '',
        phone: '',
      };
      const updatedDatabase = [...database, defaultUser];
      localStorage.setItem('user_database', JSON.stringify(updatedDatabase));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!username.trim() || !password.trim()) {
      setError(t('signIn.emptyFieldsError'));
      return;
    }

    const regularUsersJSON = localStorage.getItem('user_database');
    const adminUsersJSON = localStorage.getItem('admin_database');
    const regularUsers = regularUsersJSON ? JSON.parse(regularUsersJSON) : [];
    const adminUsers = adminUsersJSON ? JSON.parse(adminUsersJSON) : [];
    const allUsers = [...regularUsers, ...adminUsers];

    // Find a user where both username and password match in the combined list
    const userFound = allUsers.find(
      (user: any) => user.username === username && user.password === password
    );

    if (userFound) {
      // Set authentication flag and current user in session storage
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('currentUser', userFound.username);

      // Check user role for navigation
      if (userFound.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/home');
      }
    } else {
      // No matching user found
      setError(t('signIn.authError'));
    }
  };

  const languages: { code: 'en' | 'fr' | 'ar', name: string }[] = [
      { code: 'en', name: 'English' },
      { code: 'fr', name: 'Français' },
      { code: 'ar', name: 'العربية' },
  ];

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg animate-fade-in">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">{t('signIn.title')}</h1>
          <p className="text-gray-400">{t('signIn.subtitle')}</p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-300 block mb-2">
              {t('general.username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('signIn.emailPlaceholder')}
              aria-label={t('general.username')}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-300 block mb-2">
              {t('general.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('signIn.passwordPlaceholder')}
              aria-label={t('general.password')}
            />
          </div>

          <div className="pt-2 pb-1">
            <div className="flex space-x-2 rtl:space-x-reverse">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code)}
                  className={`flex-1 py-2 px-2 rounded-lg font-bold text-sm transition-colors duration-200 ${
                    language === lang.code
                      ? 'bg-yellow-500 text-gray-900'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
          
          {error && (
            <p className="text-red-500 text-sm text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition-colors duration-200"
          >
            {t('signIn.logInButton')}
          </button>
        </form>
        <div className="space-y-4 pt-4 border-t border-gray-700">
            <p className="text-center text-sm text-gray-400">
              {t('signIn.noAccount')}{' '}
              <Link to="/signup" className="font-bold text-blue-500 hover:text-blue-600 transition-colors">
                {t('signIn.signUpLink')}
              </Link>
            </p>
            <p className="text-center text-sm">
                <Link to="/admin-verify" className="text-gray-400 hover:text-white transition-colors duration-200">
                    {t('signIn.adminPanelLink')}
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;