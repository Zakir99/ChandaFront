import React, { useState } from 'react';
import { X, Calendar, DollarSign, Send, Users, User, AlertCircle, CreditCard, TrendingUp, IndianRupee } from 'lucide-react';
import axios from 'axios';
import Config from '../Js/Config';
const PaymentModal = ({ 
  isOpen, 
  onClose, 
  data,
  onSubmit 
}) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [selectedFamilies, setSelectedFamilies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !data) return null;
  
  const { support, families = [] } = data;

  const calculateTotalAmount = () => {
    if (support.amount_per_member && support.amount_per_member !== "0.00") {
      const amountPerMember = parseFloat(support.amount_per_member);
      const familyCount = families.filter(f => f.status === 'paid').length;
      return (amountPerMember * familyCount).toFixed(2);
    }
    return "0.00";
  };

  const totalAmount = calculateTotalAmount();

  const handleFamilySelection = (familyId) => {
    setSelectedFamilies(prev => {
      if (prev.includes(familyId)) {
        return prev.filter(id => id !== familyId);
      } else {
        return [...prev, familyId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post(`${Config.apiUrl}payment/paySupport`, {
        support_id: support.id,
        amount: parseFloat(paymentAmount),
        paid_at: paymentDate,
        selected_families: selectedFamilies,
      });
      
      setPaymentAmount('');
      setPaymentDate('');
      setSelectedFamilies([]);
      onClose();
    } catch (error) {
      console.error('Payment submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative transform overflow-hidden rounded-2xl bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl transition-all w-full max-w-3xl border border-gray-700/50">
          
          {/* Header */}
          <div className="relative px-8 py-6 border-b border-gray-700/50">
            <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-linear-to-br from-emerald-500 to-blue-600 rounded-xl shadow-lg shadow-emerald-500/20">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Payment Support
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">
                    Process payment for {support.deceased_name}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl p-2.5 hover:bg-white/10 transition-all duration-200 group"
              >
                <X className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            
            {/* Deceased Information Card */}
            <div className="mb-6 p-5 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-emerald-400" />
                <h4 className="font-semibold text-gray-100">Deceased Information</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="font-medium text-gray-200">{support.deceased_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Death Type</p>
                  <span className={`inline-flex items-center px-4 py-0.5 rounded-full text-sm font-medium ${
                    support.death_type === 'external' 
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {support.death_type === 'external' ? 'External' : 'Local'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Relationship</p>
                  <p className="font-medium text-gray-200">{support.relationship || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Amount per Member</p>
                  <p className="font-bold text-xl bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    Rs {support.amount_per_member || '0.00'}
                  </p>
                </div>
              </div>
            </div>

            {/* Families to Pay */}
            {/* {families.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-gray-100">Select Families to Pay</h4>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <span className="text-sm font-medium text-blue-300">
                      {selectedFamilies.length} of {families.length} selected
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {families.map(family => (
                    <div
                      key={family.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        selectedFamilies.includes(family.id)
                          ? 'border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                          : 'border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50'
                      }`}
                      onClick={() => handleFamilySelection(family.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-100 mb-2">{family.family_name}</p>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              family.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {family.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                            <span className="text-sm text-gray-400">
                              ${family.amount || '0.00'}
                            </span>
                          </div>
                        </div>
                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          selectedFamilies.includes(family.id)
                            ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30'
                            : 'border-gray-600'
                        }`}>
                          {selectedFamilies.includes(family.id) && (
                            <div className="h-2.5 w-2.5 bg-white rounded-sm" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Payment Summary Card */}
            <div className="mb-6 p-5 bg-linear-to-br from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-100 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span>Payment Summary</span>
                </h4>
                <div className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Rs {totalAmount}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-400">Number of families</span>
                  <span className="font-medium text-gray-200">{families.length} families</span>
                </div>
                 <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-400">Paid families</span>
                  <span className="font-medium text-gray-200">{families.filter(f => f.status === 'paid').length} families</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/30 rounded-lg">
                  <span className="text-sm text-gray-400">Due families</span>
                  <span className="font-medium text-gray-200">{families.filter(f => f.status !== 'paid').length} families</span>
                </div>
                <div className="border-t border-gray-700/50 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-100">Calculated Total</span>
                    <span className="font-bold text-2xl bg-linear-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                      Rs {totalAmount}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount to Send
                  </label>
                  <div className="relative group">
                    
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="pl-8 block w-full rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all py-3 px-4"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the amount to be sent
                  </p>
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="inline-block h-4 w-4 mr-1" />
                    Payment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    // min={today}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="block w-full rounded-xl border border-gray-700 bg-gray-800/50 text-gray-100 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all py-3 px-4"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Select when payment should be processed
                  </p>
                </div>
              </div>

              {/* Payment Method Notice */}
              {support.pay_from_account !== undefined && (
                <div className="mb-6">
                  <div className={`flex items-start space-x-3 p-4 rounded-xl border ${
                    support.pay_from_account 
                      ? 'bg-emerald-500/10 border-emerald-500/30' 
                      : 'bg-amber-500/10 border-amber-500/30'
                  }`}>
                    <AlertCircle className={`h-5 w-5 mt-0.5 shrink-0 ${
                      support.pay_from_account 
                        ? 'text-emerald-400' 
                        : 'text-amber-400'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-100 mb-1">
                        {support.pay_from_account 
                          ? 'Automatic Payment Enabled'
                          : 'Manual Payment Required'
                        }
                      </p>
                      <p className="text-sm text-gray-400">
                        {support.pay_from_account
                          ? 'The amount will be automatically deducted from your linked account.'
                          : 'You need to make the payment manually through your preferred method.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !paymentAmount || !paymentDate }
                  className="px-6 py-3 cursor-pointer text-sm font-medium text-white bg-linear-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg shadow-emerald-500/20 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Payment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </div>
  );
};

export default PaymentModal;