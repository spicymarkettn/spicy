
import React, { useState, useEffect } from 'react';
import { useTranslation } from '../lib/i18n';

interface PaymentMethod {
    id: number;
    name: string;
    qrCodeImage: string; // base64 string
}

const AdminPaymentMethodsPage: React.FC = () => {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [newMethod, setNewMethod] = useState({ name: '', qrCodeImage: '' });
    const [newFile, setNewFile] = useState<File | null>(null);

    const { t } = useTranslation();

    const loadMethods = () => {
        const methodsJSON = localStorage.getItem('payment_methods_database');
        if (methodsJSON) {
            setMethods(JSON.parse(methodsJSON));
        }
    };

    useEffect(() => {
        loadMethods();
    }, []);

    const saveMethods = (updatedMethods: PaymentMethod[]) => {
        localStorage.setItem('payment_methods_database', JSON.stringify(updatedMethods));
        setMethods(updatedMethods);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, forModal: boolean) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (forModal && editingMethod) {
                    setEditingMethod({ ...editingMethod, qrCodeImage: base64String });
                } else {
                    setNewMethod({ ...newMethod, qrCodeImage: base64String });
                    setNewFile(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddMethod = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMethod.name || !newMethod.qrCodeImage) {
            alert('Please provide a name and a QR code image.');
            return;
        }
        const newMethodObject: PaymentMethod = {
            id: Date.now(),
            name: newMethod.name,
            qrCodeImage: newMethod.qrCodeImage,
        };
        saveMethods([...methods, newMethodObject]);
        setNewMethod({ name: '', qrCodeImage: '' });
        setNewFile(null);
        // Reset the file input visually
        const fileInput = document.getElementById('new-qr-code') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleDeleteMethod = (id: number) => {
        if (window.confirm(t('adminPayment.deleteConfirm'))) {
            saveMethods(methods.filter(m => m.id !== id));
        }
    };

    const handleEditMethod = (method: PaymentMethod) => {
        setEditingMethod(method);
        setIsModalOpen(true);
    };

    const handleUpdateMethod = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMethod) return;
        saveMethods(methods.map(m => (m.id === editingMethod.id ? editingMethod : m)));
        setIsModalOpen(false);
        setEditingMethod(null);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">{t('adminPayment.title')}</h1>
                <p className="text-gray-400 mt-1">{t('adminPayment.subtitle')}</p>
            </div>

            {/* Add Method Form */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-white mb-4">{t('adminPayment.addNewMethod')}</h2>
                <form onSubmit={handleAddMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <input value={newMethod.name} onChange={e => setNewMethod({ ...newMethod, name: e.target.value })} placeholder={t('adminPayment.methodNamePlaceholder')} className="p-3 bg-gray-700 rounded border border-gray-600 w-full" required />
                    <div className="p-3 bg-gray-700 rounded border border-gray-600 w-full">
                        <label htmlFor="new-qr-code" className="cursor-pointer text-gray-400 hover:text-white">
                            {newFile ? newFile.name : t('adminPayment.selectFile')}
                        </label>
                        <input id="new-qr-code" type="file" onChange={(e) => handleFileChange(e, false)} className="hidden" accept="image/*" required />
                    </div>
                    <button type="submit" className="md:col-start-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded w-full md:w-auto justify-self-end">{t('adminPayment.addMethodButton')}</button>
                </form>
            </div>

            {/* Methods List */}
            <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="p-4">{t('adminPayment.tableHeaderName')}</th>
                            <th className="p-4">{t('adminPayment.tableHeaderQrCode')}</th>
                            <th className="p-4">{t('adminPayment.tableHeaderActions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {methods.map(method => (
                            <tr key={method.id} className="border-b border-gray-700 last:border-0">
                                <td className="p-4 font-medium">{method.name}</td>
                                <td className="p-2"><img src={method.qrCodeImage} alt={`${method.name} QR Code`} className="w-16 h-16 object-contain rounded bg-white p-1" /></td>
                                <td className="p-4 space-x-2 rtl:space-x-reverse">
                                    <button onClick={() => handleEditMethod(method)} className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-1 px-3 rounded text-sm">{t('adminPayment.editButton')}</button>
                                    <button onClick={() => handleDeleteMethod(method.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm">{t('adminPayment.deleteButton')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isModalOpen && editingMethod && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">{t('adminPayment.editModalTitle')}</h2>
                        <form onSubmit={handleUpdateMethod} className="space-y-4">
                            <input name="name" value={editingMethod.name} onChange={e => setEditingMethod({ ...editingMethod, name: e.target.value })} placeholder={t('adminPayment.methodNamePlaceholder')} className="p-3 bg-gray-700 rounded border border-gray-600 w-full" />
                            <div>
                                <img src={editingMethod.qrCodeImage} alt="Current QR" className="w-24 h-24 mx-auto rounded bg-white p-1 mb-2" />
                                <div className="p-3 bg-gray-700 rounded border border-gray-600 w-full text-center">
                                    <label htmlFor="edit-qr-code" className="cursor-pointer text-gray-400 hover:text-white">{t('adminPayment.selectFile')}</label>
                                    <input id="edit-qr-code" type="file" onChange={e => handleFileChange(e, true)} className="hidden" accept="image/*" />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded">{t('adminPayment.cancelButton')}</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{t('adminPayment.saveButton')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentMethodsPage;
