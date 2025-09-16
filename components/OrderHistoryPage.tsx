


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderItem } from '../App';
import { useTranslation } from '../lib/i18n';
import { ArrowLeftIcon } from './icons';

interface PlacedOrder {
    orderId: number;
    items: OrderItem[];
    total: number;
    date: string;
    username: string;
    paymentStatus: 'Paid' | 'Unpaid';
    paymentMethod: string | null;
    transactionId: string | null;
}

interface PaymentMethod {
    id: number;
    name: string;
    qrCodeImage: string; // base64 string
}

const OrderHistoryPage: React.FC = () => {
    const [userOrders, setUserOrders] = useState<PlacedOrder[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
    const [chosenMethod, setChosenMethod] = useState<string | null>(null);
    const [transactionId, setTransactionId] = useState('');
    const { t } = useTranslation();

    const loadUserOrders = () => {
        const currentUser = sessionStorage.getItem('currentUser');
        const ordersJSON = localStorage.getItem('orders_database');
        if (ordersJSON && currentUser) {
            const allOrders: PlacedOrder[] = JSON.parse(ordersJSON);
            const filteredOrders = allOrders
                .filter(order => order.username === currentUser)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setUserOrders(filteredOrders);
        }
    }

    useEffect(() => {
        loadUserOrders();

        const methodsJSON = localStorage.getItem('payment_methods_database');
        if (methodsJSON) {
            setPaymentMethods(JSON.parse(methodsJSON));
        }
    }, []);
    
    const handleOpenPaymentModal = (order: PlacedOrder) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setChosenMethod(null);
        setTransactionId('');
    };

    const handleConfirmPayment = () => {
        if (!selectedOrder || !chosenMethod || !transactionId.trim()) return;

        const ordersJSON = localStorage.getItem('orders_database');
        if (ordersJSON) {
            const allOrders: PlacedOrder[] = JSON.parse(ordersJSON);
            const updatedOrders = allOrders.map(order => 
                order.orderId === selectedOrder.orderId
                    ? { ...order, paymentStatus: 'Paid', paymentMethod: chosenMethod, transactionId: transactionId.trim() }
                    : order
            );
            localStorage.setItem('orders_database', JSON.stringify(updatedOrders));
            
            loadUserOrders(); // Reload orders to reflect the change
            handleCloseModal();
        }
    };


    return (
        <div className="p-4 sm:p-6 bg-gray-900 min-h-full text-white animate-fade-in pb-20">
            <div className="flex items-center mb-6">
                <Link to="/account" className="p-2 rounded-full hover:bg-gray-800 transition-colors" aria-label={t('adminVerify.backToLogin')}>
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </Link>
                <h1 className="text-3xl font-bold text-white ms-4">{t('account.options.orderHistory')}</h1>
            </div>
            
            <div className="space-y-6">
                {userOrders.length > 0 ? (
                    userOrders.map(order => (
                        <div key={order.orderId} className="bg-gray-800 p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start flex-wrap gap-2 mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-yellow-400">{t('adminOrders.orderIdLabel')} #{order.orderId}</h2>
                                    <p className="text-sm text-gray-400">{new Date(order.date).toLocaleString()}</p>
                                    <div className="mt-2 flex items-start gap-4 flex-wrap">
                                        <span className={`text-sm font-bold py-1 px-3 rounded-full self-center ${order.paymentStatus === 'Paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                            {order.paymentStatus === 'Paid' ? t('orders.statusPaid') : t('orders.statusUnpaid')}
                                        </span>
                                        {order.paymentMethod && <p className="text-sm text-gray-300">{t('orders.paymentMethodLabel')}: {order.paymentMethod}</p>}
                                        {order.transactionId && <p className="text-sm text-gray-300">{t('orders.transactionIdLabel')}: {order.transactionId}</p>}
                                    </div>
                                </div>
                                <div className="text-right rtl:text-left">
                                    <p className="text-2xl font-bold text-white">${order.total.toFixed(2)}</p>
                                    {order.paymentStatus === 'Unpaid' && (
                                        <button 
                                            onClick={() => handleOpenPaymentModal(order)}
                                            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
                                        >
                                            {t('orders.choosePayment')}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="border-t border-gray-700 pt-4">
                                <h3 className="font-semibold mb-2">{t('adminOrders.itemsLabel')}:</h3>
                                <ul className="space-y-2">
                                    {order.items.map(item => (
                                        <li key={item.product.id} className="flex items-center">
                                            <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-12 object-cover rounded me-4"/>
                                            <div>
                                                <p className="font-medium text-gray-200">{item.product.name}</p>
                                                <p className="text-sm text-gray-400">{t('adminOrders.quantityLabel')}: {item.quantity} &times; {item.product.price}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-800 p-8 rounded-lg text-center">
                        <p className="text-gray-400">{t('orders.emptyMessage')}</p>
                    </div>
                )}
            </div>
            {/* Payment Modal */}
            {isModalOpen && selectedOrder && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-lg max-h-full overflow-y-auto custom-scrollbar">
                        <h2 className="text-2xl font-bold mb-4 text-center">{t('orders.selectPaymentTitle')}</h2>
                        <div className="space-y-4">
                            {paymentMethods.map(method => (
                                <div 
                                    key={method.id}
                                    onClick={() => setChosenMethod(method.name)}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${chosenMethod === method.name ? 'border-yellow-500 bg-gray-700' : 'border-gray-600 hover:border-gray-500 bg-gray-900'}`}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <img src={method.qrCodeImage} alt={method.name} className="w-24 h-24 object-contain bg-white p-1 rounded flex-shrink-0" />
                                        <p className="text-lg font-semibold text-center sm:text-left rtl:sm:text-right">{method.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {chosenMethod && (
                            <div className="mt-6 pt-4 border-t border-gray-600 animate-fade-in">
                                <label htmlFor="transactionId" className="text-sm font-bold text-gray-300 block mb-2">{t('orders.transactionIdLabel')}</label>
                                <input
                                    id="transactionId"
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder={t('orders.transactionIdPlaceholder')}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        )}

                        <div className="flex justify-center sm:justify-end gap-4 pt-6 mt-4 border-t border-gray-700">
                            <button onClick={handleCloseModal} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded">{t('adminProducts.cancelButton')}</button>
                            <button onClick={handleConfirmPayment} disabled={!chosenMethod || !transactionId.trim()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:bg-gray-500 disabled:cursor-not-allowed">{t('orders.confirmPayment')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryPage;