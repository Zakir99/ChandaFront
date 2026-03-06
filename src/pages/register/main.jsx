import React, { useState } from "react";
import {
  Check,
  X,
  Minus,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Download,
  UserPlus,
  CreditCard,
  DollarSign,
} from "lucide-react";
import axios from "axios";
import Config from "../../Js/Config";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const PaymentTracker = () => {
  // Sample data with payment status: true (paid), false (unpaid), null (not present)
  const [members, setMembers] = useState([]);
  const {year} = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentModal, setPaymentModal] = useState(null);
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const fetchRegisters = async () => {
      try {
        const response = await axios.get(
          `${Config.apiUrl}registers/yearly/${year}`,
        );
        setMonths(response.data.months);
        const formattedFamilies = response.data.families.map((f) => ({
          ...f,
          payments: f.payments.map((p) => ({
            register_id: Number(p.register_id),
            status: p.status,
            id: p.id,
          })),
        }));

        setMembers(formattedFamilies);
      } catch (error) {
        console.error("Failed to fetch registers:", error);
      }
    };
    fetchRegisters();
  }, []);

  // Calculate total due for a member
  const calculateTotalDue = (payments) => {
    return payments.reduce((total, payment) => {
      if (payment.status === "unpaid") {
        const month = months.find(
          (m) => Number(m.id) === Number(payment.register_id),
        );
        return total + Number(month?.amount_per_member || 0);
      }
      return total;
    }, 0);
  };

  // Handle payment
  const handlePayment = async (paymentId, memberId) => {
    const payload = {
      selectedPayments: [{ id: paymentId }],
      familyId: memberId,
    };

    try {
      await axios.post(`${Config.apiUrl}payment/paySeparate`, payload);

      setMembers((prevMembers) =>
        prevMembers.map((member) => {
          if (member.id !== memberId) return member;

          return {
            ...member,
            payments: member.payments.map((payment) =>
              payment.id === paymentId
                ? { ...payment, status: "paid" } // ✅ update object correctly
                : payment,
            ),
          };
        }),
      );
    } catch (error) {
      toast.error("Payment failed!");
      console.error("Payment failed:", error);
    }

    setPaymentModal(null);
  };

  const handlePaymentCancel = async (paymentId, memberId) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel pay!",
      background: "ffffff",
    });

    if (!result.isConfirmed) {
      return;
    }

    const payload = {
      selectedPayments: [{ id: paymentId }],
      familyId: memberId,
    };

    try {
      await axios.post(`${Config.apiUrl}payment/CancelPaySeperate`, payload);

      setMembers((prevMembers) =>
        prevMembers.map((member) => {
          if (member.id !== memberId) return member;

          return {
            ...member,
            payments: member.payments.map((payment) =>
              payment.id === paymentId
                ? { ...payment, status: "unpaid" } // ✅ update object correctly
                : payment,
            ),
          };
        }),
      );
    } catch (error) {
      toast.error("Payment Cancellation failed!");
      console.error("Payment Cancellation failed:", error);
    }

  };

  const handlePayAll = async (memberId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, pay all!",
      background: "#000000",
    });

    if (!result.isConfirmed) {
      setPaymentModal(null);
      return;
    }

    const payload = {
      familyId: memberId,
      year: year,
    };

    try {
      await axios.post(`${Config.apiUrl}payment/payAllUnpaid`, payload);

      setMembers((prevMembers) =>
        prevMembers.map((member) => {
          if (member.id !== memberId) return member;

          return {
            ...member,
            payments: member.payments.map((payment) => ({
              ...payment,
              status: "paid", // ✅ this is what your UI expects
            })),
          };
        }),
      );

      toast.success("All payments completed successfully!");
    } catch (error) {
      toast.error(
        "Payment failed: " + (error.response?.data?.message || error.message),
      );
      console.error("Payment failed:", error);
    } finally {
      setPaymentModal(null);
    }
  };

  const filteredMembers = members.filter((member) =>
    member?.family_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const totalPaid = members.reduce((acc, member) => {
    return acc + member.payments.filter((p) => p.status === "paid").length;
  }, 0);

  const totalUnpaid = members.reduce((acc, member) => {
    return acc + member.payments.filter((p) => p.status === "unpaid").length;
  }, 0);

  const totalExpected = members.reduce((acc, member) => {
    return acc + member.payments.length;
  }, 0);

  const collectionRate =
    totalExpected > 0 ? ((totalPaid / totalExpected) * 100).toFixed(1) : 0;

  const totalRevenue = members.reduce((acc, member) => {
    return (
      acc +
      member.payments.reduce((sum, payment) => {
        if (payment.status === "paid") {
          const month = months.find(
            (m) => Number(m.id) === Number(payment.register_id),
          );
          return sum + Number(month?.amount_per_member || 0);
        }
        return sum;
      }, 0)
    );
  }, 0);

  const totalDue = members.reduce((acc, member) => {
    return (
      acc +
      member.payments.reduce((sum, payment) => {
        if (payment.status === "unpaid") {
          const month = months.find(
            (m) => Number(m.id) === Number(payment.register_id),
          );
          return sum + Number(month?.amount_per_member || 0);
        }
        return sum;
      }, 0)
    );
  }, 0);

  return (
    <div className="min-h-screen bg-black p-6">
      {/* Header Section */}
      <div className="flex mb-8 justify-between">
        <div>
          <h1 className="text-4xl font-bold  mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Payment Tracker
          </h1>
          <p className="text-gray-400">
            Track monthly payments and manage member contributions
          </p>
        </div>
        <div className="border border-purple-300 p-3 rounded-2xl bg-">
          <h1 className="text-4xl font-bold  mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            2026
          </h1>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Members</p>
              <p className="text-3xl font-bold text-white">{members.length}</p>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-lg">
              <UserPlus className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-green-400">
                Rs {totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-500/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{totalPaid} payments</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-red-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Due</p>
              <p className="text-3xl font-bold text-red-400">
                Rs {totalDue.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-500/20 p-3 rounded-lg">
              <X className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{totalUnpaid} unpaid</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Collection Rate</p>
              <p className="text-3xl font-bold text-white">{collectionRate}%</p>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 mb-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-700 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all text-gray-300 hover:text-white">
              <Filter className="w-4 h-4" />
              <span className="text-sm">Filter</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/20">
              <Download className="w-4 h-4" />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900/50 border-b border-gray-700">
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 w-16">
                  #
                </th>
                <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300 min-w-37.5">
                  Name
                </th>
                {months.map((month, index) => (
                  <th
                    key={index}
                    className="px-3 py-4 text-center text-sm font-semibold text-gray-300 min-w-15"
                  >
                    {month.month.toUpperCase().slice(0, 3)}
                  </th>
                ))}
                <th className="px-4 py-4 text-right text-sm font-semibold text-gray-300 min-w-30 sticky right-0 bg-gray-900/50">
                  Total Due
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMembers.map((member, index) => {
                const totalDue = calculateTotalDue(member.payments);
                return (
                  <tr
                    key={member.id}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-400">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-white w-32 max-w-32">
                      <div
                        className="truncate whitespace-nowrap overflow-hidden text-ellipsis"
                        title={member.family_name}
                      >
                        {member.family_name}
                      </div>
                    </td>

                    {months.map((month, monthIndex) => {
                      const payment = member.payments.find(
                        (p) => Number(p.register_id) === Number(month.id),
                      );

                      const status = payment?.status;
                      const paymentId = payment?.id;

                      return (
                        <td key={month.id} className="px-3 py-4 text-center">
                          {status === "paid" ? (
                            <button 
                            onClick={() => {
                              handlePaymentCancel(paymentId, member.id);
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 bg-green-500/20 rounded-lg border border-green-500/50 cursor-pointer">
                              <Check className="w-4 h-4 text-green-400" />
                            </button>
                          ) : status === "unpaid" ? (
                            <button
                              onClick={() =>
                                setPaymentModal({
                                  memberId: member.id,
                                  memberName: member.family_name,
                                  monthId: month.id,
                                  month: month,
                                  paymentId: paymentId,
                                  monthIndex: monthIndex,
                                })
                              }
                              className="inline-flex items-center justify-center w-8 h-8 bg-red-500/20 rounded-lg border border-red-500/50 hover:bg-red-500/30 transition-all cursor-pointer"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-700/30 rounded-lg border border-gray-600/50">
                              <Minus className="w-4 h-4 text-gray-500" />
                            </div>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-4 py-4 text-right sticky right-0 bg-linear-to-l from-gray-900 via-gray-900/95 to-transparent">
                      <div className="flex items-center justify-end gap-3">
                        {totalDue !== 0 && (
                          <button
                            onClick={() => {
                              handlePayAll(member.id);
                            }}
                            className="group relative p-1.5 rounded-lg border border-gray-600 hover:border-green-400 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                          >
                            <Check className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors duration-200" />
                            <span className="absolute -top-8 -right-2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap border border-gray-700">
                              Mark all as paid
                            </span>
                          </button>
                        )}

                        <div className="flex flex-col w-22">
                          <span
                            className={`text-base font-bold tabular-nums ${
                              totalDue > 0
                                ? "text-red-400 bg-red-400/10 px-2 py-0.5 rounded-lg"
                                : "text-green-400 bg-green-400/10 px-2 py-0.5 rounded-lg"
                            }`}
                          >
                            Rs {totalDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 bg-gray-900/30 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, filteredMembers.length)} of{" "}
              {filteredMembers.length} members
            </div>

            <div className="flex items-center gap-4">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 rows</option>
                <option value={10}>10 rows</option>
                <option value={20}>20 rows</option>
                <option value={50}>50 rows</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border border-gray-700 bg-gray-800/50 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700/50 text-gray-300"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 &&
                      pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded-lg text-sm ${
                          currentPage === pageNumber
                            ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20"
                            : "text-gray-400 hover:bg-gray-700/50 border border-gray-700 bg-gray-800/50"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <span key={i} className="px-2 text-gray-600">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border border-gray-700 bg-gray-800/50 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-700/50 text-gray-300"
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500/20 rounded-lg border border-green-500/50 flex items-center justify-center">
            <Check className="w-3 h-3 text-green-400" />
          </div>
          <span>Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500/20 rounded-lg border border-red-500/50 flex items-center justify-center">
            <X className="w-3 h-3 text-red-400" />
          </div>
          <span>Due (Click to pay)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-700/30 rounded-lg border border-gray-600/50 flex items-center justify-center">
            <Minus className="w-3 h-3 text-gray-500" />
          </div>
          <span>Not Present</span>
        </div>
      </div>

      {/* Payment Modal */}
      {paymentModal && (
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
                  {paymentModal.memberName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400">Month</p>
                  <p className="text-lg font-semibold text-white">
                    {paymentModal?.month?.month.charAt(0).toUpperCase() +
                      paymentModal?.month?.month.slice(1)}
                  </p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-sm text-gray-400">Amount</p>
                  <p className="text-lg font-semibold text-green-400">
                    Rs {paymentModal?.month?.amount_per_member}
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
      )}
    </div>
  );
};

export default PaymentTracker;
