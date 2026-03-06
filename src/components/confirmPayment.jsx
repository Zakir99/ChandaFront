const confirmPayment = ({
  memberId,
  memberName,
  monthId,
  month,
  paymentId,
  monthIndex,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Process Payment</h3>
          <button
            onClick={() => setPaymentModal(null)}
            className="text-gray-400 cursor-pointer hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <p className="text-sm text-gray-400">Member</p>
            <p className="text-lg font-semibold text-white">
              {memberName}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Month</p>
              <p className="text-lg font-semibold text-white">
                {month?.month.charAt(0).toUpperCase() +
                  month?.month.slice(1)}
              </p>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-400">Amount</p>
              <p className="text-lg font-semibold text-green-400">
                Rs {month?.amount_per_member}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() =>
              handlePayment(
                paymentModal.paymentId,
                paymentModal.memberId,
                paymentModal.monthIndex,
              )
            }
            className="w-full flex items-center gap-3 p-4 bg-linear-to-r from-green-600 to-green-500 rounded-lg hover:from-green-700 hover:to-green-600 transition-all shadow-lg shadow-green-500/20 cursor-pointer"
          >
            <DollarSign className="w-5 h-5 text-white" />
            <div className="text-left">
              <p className="text-white font-semibold">Pay</p>
            </div>
          </button>

          <button
            onClick={() => setPaymentModal(null)}
            className="w-full p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-all text-gray-300 text-sm cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
