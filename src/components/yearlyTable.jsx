import { useState } from "react";
import {
  Calendar,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const YearlyRegisterRedesigned = ({
  yearlyData = [],
  currentItems = [],
  currentPage = 1,
  setCurrentPage = () => {},
  activeTotalPages = 0,
  activeTotalItems = 0,
  activeFirstItem = 0,
  activeLastItem = 0,
  navigate = () => {},
  goToEdit = () => {},
  handleDelete = () => {},
  formatCurrency = () => {},
  formatDate = () => {},
}) => {
  // Calculate completion percentage
  const getCompletionPercentage = (register) => {
    const completed = register?.registers?.length || 0;
    const total = register.total_months || 12;
    return Math.round((completed / total) * 100);
  };

  // Get status color based on completion
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return "text-emerald-400 bg-emerald-500/10";
    if (percentage >= 50) return "text-amber-400 bg-amber-500/10";
    return "text-rose-400 bg-rose-500/10";
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <div className="bg-secondary/50 backdrop-blur-sm border border-secondary/50 rounded-2xl overflow-hidden shadow-xl">
          {currentItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
                <Calendar className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400 text-lg font-medium">
                No yearly registers found
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Create your first yearly register to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/50">
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <Calendar className="w-4 h-4" />
                        Year
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        {/* < /> */}
                        Expected
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4" />
                        Collected
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <DollarSign className="w-4 h-4" />
                        Remaining
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <Clock className="w-4 h-4" />
                        Progress
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center">
                      <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((register, index) => {
                    const percentage = getCompletionPercentage(register);
                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-all duration-200"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {/* <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                              <span className="text-blue-400 font-bold text-sm">
                                {String(register.year).slice(-2)}
                              </span>
                            </div> */}
                            <div>
                              <span className="font-semibold text-slate-100 text-base">
                                {register.year}
                              </span>
                              {/* <p className="text-xs text-slate-500 mt-0.5">
                                {formatDate(register.created_at)}
                              </p> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-left">
                            <div className="font-semibold text-blue-400 text-base">
                                {formatCurrency(register.total_expected + register.total_collected)}
                            </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="font-semibold text-emerald-400 text-base">
                                {formatCurrency(register.total_collected)}
                              </div>
                              {/* <div className="text-xs text-slate-500 mt-0.5">
                                {register.total_members} members × {formatCurrency(register.amount_per_member)}
                              </div> */}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-semibold text-rose-400 text-base">
                            {formatCurrency(register.total_remaining)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-3">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(percentage)}`}
                              >
                                {register?.registers?.length || 0}/12 months
                              </span>
                              <span className="text-slate-400 text-sm font-medium">
                                {percentage}%
                              </span>
                            </div>
                            <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                              <div
                                className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() =>
                                navigate(`/register/yearly/${register.year}`)
                              }
                              className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200 group"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform cursor-pointer" />
                            </button>
                            {/* <button
                              onClick={() => navigate(`/yearly-register/${register.id}/months`)}
                              className="p-2.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all duration-200 group"
                              title="View Months"
                            >
                              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button> */}
                            {/* <button
                              onClick={() => goToEdit(register)}
                              className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all duration-200 group"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(register.id)}
                              className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all duration-200 group"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards - Matching Desktop Design */}
      <div className="lg:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <Calendar className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-400 text-lg font-medium">
              No yearly registers found
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Create your first yearly register to get started
            </p>
          </div>
        ) : (
          currentItems.map((register, index) => {
            const percentage = getCompletionPercentage(register);
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-800/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                        <span className="text-blue-400 font-bold">
                          {String(register.year).slice(-2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100 text-lg">
                          Year {register.year}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatDate(register.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(percentage)}`}
                      >
                        {register?.registers?.length || 0}/
                        {register.total_months} months
                      </span>
                      <span className="text-slate-400 text-sm font-medium">
                        {percentage}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="p-5 space-y-3">
                  {/* Collected Amount */}
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/20">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-400/80 font-medium uppercase tracking-wide">
                          Collected
                        </p>
                        <p className="font-semibold text-emerald-400 text-lg mt-0.5">
                          {formatCurrency(register.total_collected)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Remaining Amount */}
                  <div className="flex items-center justify-between p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-rose-500/20">
                        <DollarSign className="w-5 h-5 text-rose-400" />
                      </div>
                      <div>
                        <p className="text-xs text-rose-400/80 font-medium uppercase tracking-wide">
                          Remaining
                        </p>
                        <p className="font-semibold text-rose-400 text-lg mt-0.5">
                          {formatCurrency(register.total_remaining)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Members Info */}
                  <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20">
                        <Users className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-400/80 font-medium uppercase tracking-wide">
                          Members
                        </p>
                        <p className="font-semibold text-blue-400 text-base mt-0.5">
                          {register.total_members} ×{" "}
                          {formatCurrency(register.amount_per_member)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-5 pt-0">
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      onClick={() =>
                        navigate(`/yearly-register/${register.id}`)
                      }
                      className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl transition-all duration-200 border border-slate-800/50 hover:border-blue-500/30 group"
                    >
                      <Eye className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">View</span>
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/yearly-register/${register.id}/months`)
                      }
                      className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-xl transition-all duration-200 border border-slate-800/50 hover:border-purple-500/30 group"
                    >
                      <Calendar className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Months</span>
                    </button>
                    <button
                      onClick={() => goToEdit(register)}
                      className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-xl transition-all duration-200 border border-slate-800/50 hover:border-amber-500/30 group"
                    >
                      <Edit2 className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(register.id)}
                      className="flex flex-col items-center justify-center p-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-200 border border-slate-800/50 hover:border-rose-500/30 group"
                    >
                      <Trash2 className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activeTotalPages > 1 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {activeFirstItem} to {activeLastItem} of {activeTotalItems}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <span className="text-sm text-foreground px-2">
                {currentPage} / {activeTotalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, activeTotalPages))
                }
                disabled={currentPage === activeTotalPages}
                className="p-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default YearlyRegisterRedesigned;
