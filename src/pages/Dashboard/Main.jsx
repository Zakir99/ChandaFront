import { useState, useEffect } from "react";
import {
  AlertCircle,
  ChevronRight,
  CheckCircle,
  XCircle,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Config from "../../Js/Config";
import StatCards from "../../components/StateCard";
import ProfessionalCollectionDashboard from "../../components/CollectionProgress";

export default function DashboardView() {
  const [monthly, setMonthly] = useState({});
  const [support, setSupport] = useState({});
  const [account, setAccount] = useState({});
  const [deathSupports, setDeathSupports] = useState({});
  const [activeFamilies, setActiveFamilies] = useState(0);
  const [unpaidFamilies, setUnpaidFamilies] = useState(0);
  const [topUnpaidFamilies, setTopUnpaidFamilies] = useState([]);
  const [recentDeathSupport, setRecentDeathSupport] = useState([]);
  const collectionPercentage =
    (monthly.collected / monthly.expected) * 100 || 0;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Config.apiUrl}dashboard`);
        const data = await response.json();
        setMonthly(data.monthly || {});
        setSupport(data.death_support || {});
        setActiveFamilies(data.active_families || 0);
        setUnpaidFamilies(data.unpaid_supports || 0);
        setTopUnpaidFamilies(data.top_unpaid_families || []);
        setRecentDeathSupport(data.recent_death_supports || []);
        setAccount(data.account || {});
        setDeathSupports(data.death_supports || {});
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const stateData = {
    activeFamilies,
    account,
    monthly,
    deathSupports,
  };

  const onViewUnpaid = () => navigate("/register");
  const onViewFamily = (family) => navigate(`/family/${family.family_id}`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Community Payment Management Overview
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <button
            onClick={onViewUnpaid}
            className="px-4 py-2 bg-error/10 text-error border border-error/20 rounded-lg text-sm font-medium hover:bg-error/20 transition-colors flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            View Unpaid
          </button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <StatCards data={stateData} />

      {/* Main Content Grid */}
      <div className="">
        {/* Collection Progress - Takes 2 columns */}
        <ProfessionalCollectionDashboard />
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
        {/* Top Unpaid Families */}
        <div className="group bg-[#0B0B0F] border border-[#23232A] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 hover:border-[#2A2A35] transition-all duration-300">
          <div className="p-6 border-b border-[#23232A] flex items-center justify-between bg-[#0B0B0F] backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-[#EDEDEE] tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-500/30"></span>
              Top Unpaid Families
            </h2>
            <button
              onClick={onViewUnpaid}
              className="text-sm text-emerald-400 font-medium hover:text-emerald-300 transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
            >
              Pay Now
            </button>
          </div>
          <div className="divide-y divide-[#23232A]">
            {topUnpaidFamilies?.length > 0 ? (
              topUnpaidFamilies.slice(0, 5).map((family, index) => (
                <div
                  key={family.family_id}
                  onClick={() => onViewFamily(family)}
                  className="p-4 hover:bg-[#1A1A24] cursor-pointer transition-all duration-200 flex items-center justify-between group/item py-5.5"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#6B6B7B] border-r border-[#23232A] pr-3">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-medium text-[#EDEDEE] truncate">
                        {family.family_name}
                      </h3>
                    </div>
                    <p className="text-sm text-[#8B8B98] mt-0.5 ml-8">
                      {family.unpaid_months}{" "}
                      {family.unpaid_months === 1 ? "month" : "months"} due
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-rose-500/10 text-rose-400 rounded-lg text-sm font-semibold border border-rose-500/20 shadow-lg shadow-rose-500/5">
                      {family.total_unpaid}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#5A5A6A] group-hover/item:text-[#8A8A9A] transition-all duration-200 group-hover/item:translate-x-0.5" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="text-4xl mb-3 opacity-20">💫</div>
                <p className="text-[#8B8B98]">No unpaid families found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Death Support */}
        <div className="group bg-linear-to-br from-[#0F0F12] to-[#14141A] border border-[#23232A] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 hover:border-[#2A2A35] transition-all duration-300">
          <div className="p-6 border-b border-[#23232A] flex items-center justify-between bg-[#0A0A0C]/50 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-[#EDEDEE] tracking-tight flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/30"></span>
              Recent Death Support
            </h2>
            <button
              onClick={() => navigate("/support")}
              className="text-sm text-amber-400 font-medium hover:text-amber-300 transition-all duration-200 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 hover:shadow-lg hover:shadow-amber-500/5"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-[#23232A]">
            {recentDeathSupport?.length > 0 ? (
              <div className="">
                {recentDeathSupport.slice(0, 5).map((payment, index) => (
                  <div
                    key={payment.id}
                    className="relative bg-[#16161F] border border-[#252530] hover:border-[#353540] transition-all duration-300 overflow-hidden group"
                  >

                    <div className="p-4 pl-5">
                      {/* Top row - Family name and status */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#6B6B7B] bg-[#1E1E28] px-2 py-1 rounded-lg">
                            #{String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-semibold text-[#EDEDEE]">
                            {payment.family_name}
                          </h3>
                        </div>

                        {/* Compact status badge */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                            payment?.paid_at
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {payment?.paid_at ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Paid</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Unpaid</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Middle row - Key metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Expected amount */}
                        <div>
                          <p className="text-xs text-[#6B6B7B] mb-1">
                            Expected
                          </p>
                          <p className="text-lg font-semibold text-[#EDEDEE]">
                            Rs {(payment.total_expected || 0).toLocaleString()}
                          </p>
                        </div>

                        {/* Collected amount */}
                        <div>
                          <p className="text-xs text-[#6B6B7B] mb-1">
                            Collected
                          </p>
                          <p className="text-lg font-semibold text-[#EDEDEE]">
                            Rs {(payment.total_collected || 0).toLocaleString()}
                          </p>
                        </div>

                        {/* Paid amount - only show if paid */}
                        {payment?.paid_at ? (
                          <div>
                            <p className="text-xs text-[#6B6B7B] mb-1">
                              Paid Amount
                            </p>
                            <p className="text-lg font-semibold text-emerald-400">
                              Rs {payment.paid_amount?.toLocaleString()}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-[#6B6B7B] mb-1">
                              Due Date
                            </p>
                            <p className="text-sm font-medium text-rose-400/80">
                              {payment.due_date
                                ? new Date(payment.due_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "Not set"}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bottom row - Progress and date */}
                      <div className="flex items-center justify-between">
                        {/* Progress bar with percentage */}
                        <div className="flex-1 max-w-[60%]">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-[#1E1E28] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    ((payment.total_collected || 0) /
                                      (payment.total_expected || 1)) *
                                      100,
                                    100,
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium text-[#8B8B98]">
                              {Math.min(
                                ((payment.total_collected || 0) /
                                  (payment.total_expected || 1)) *
                                  100,
                                100,
                              ).toFixed(0)}
                              %
                            </span>
                          </div>
                        </div>

                        {/* Payment date if paid */}
                        {payment?.paid_at && (
                          <div className="flex items-center gap-1.5 text-xs text-[#6B6B7B]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              {new Date(payment.paid_at).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 mb-4 rounded-2xl bg-[#1E1E28] flex items-center justify-center">
                  <span className="text-3xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-[#EDEDEE] mb-2">
                  No records found
                </h3>
                <p className="text-sm text-[#8B8B98] max-w-[200px]">
                  Recent death support records will appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
