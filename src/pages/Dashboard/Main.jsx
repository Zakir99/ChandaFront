import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  AlertCircle,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  Book,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Config from "../../Js/Config";

export default function DashboardView() {
  const [monthly, setMonthly] = useState({});
  const [support, setSupport] = useState({});
  const [activeFamilies, setActiveFamilies] = useState(0);
  const [unpaidFamilies, setUnpaidFamilies] = useState(0);
  const [topUnpaidFamilies, setTopUnpaidFamilies] = useState([]);
  const [recentDeathSupport, setRecentDeathSupport] = useState([]);
  const collectionPercentage = (monthly.collected / monthly.expected) * 100 || 0;
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
        setRecentDeathSupport(data.recent_death_support || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };
    fetchData();
  }, []);

  const onViewUnpaid = () => navigate("/unpaid");
  const onViewFamily = (family) => navigate(`/family/${family.id}`);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Community Payment Management Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onViewUnpaid}
            className="px-4 py-2 bg-error/10 text-error border border-error/20 rounded-lg text-sm font-medium hover:bg-error/20 transition-colors flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4" />
            View Unpaid
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Families"
          value={activeFamilies?.toLocaleString() || "0"}
          trend="+12%"
          trendUp={true}
          iconBg="bg-primary/10"
          iconColor="text-primary"
        />
        <StatCard
          icon={<DollarSign className="w-5 h-5" />}
          label="Remaining Payments"
          value={monthly?.unpaid?.toLocaleString() || "0"}
          trend="-5%"
          trendUp={false}
          iconBg="bg-error/10"
          iconColor="text-error"
        />
        <StatCard
          icon={<Book className="w-5 h-5" />}
          label="Monthly Collection"
          value={monthly?.collected?.toLocaleString() || "0"}
          trend="+8%"
          trendUp={true}
          iconBg="bg-success/10"
          iconColor="text-success"
        />
        <StatCard
          icon={<Heart className="w-5 h-5" />}
          label="Unpaid Supports"
          value={unpaidFamilies?.toLocaleString() || "0"}
          trend="+2"
          trendUp={false}
          iconBg="bg-warning/10"
          iconColor="text-warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Progress - Takes 2 columns */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Monthly Collection Progress</h2>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-2xl font-bold text-foreground">
                {collectionPercentage?.toFixed(0) || 0}%
              </span>
              <span className="text-sm text-muted-foreground">
                {monthly?.collected?.toLocaleString() || 0} / {monthly?.expected?.toLocaleString() || 0}
              </span>
            </div>
            <div className="h-3 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-primary to-success rounded-full transition-all duration-700"
                style={{ width: `${Math.min(collectionPercentage || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Expected</p>
              <p className="text-lg font-bold text-primary">
                {((monthly?.expected || 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Collected</p>
              <p className="text-lg font-bold text-success">
                {((monthly?.collected || 0) / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">Remaining</p>
              <p className="text-lg font-bold text-error">
                {((monthly?.unpaid || 0) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>

        {/* Alert Card */}
        <div className="bg-linear-to-br from-error/20 to-error/5 border border-error/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1">Unpaid Families</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {unpaidFamilies?.count || topUnpaidFamilies?.length || 0} families require attention
              </p>
              <button
                onClick={onViewUnpaid}
                className="inline-flex items-center gap-2 px-4 py-2 bg-error text-error-foreground rounded-lg text-sm font-medium hover:bg-error/90 transition-colors"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Unpaid Families */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Top Unpaid Families</h2>
            <button
              onClick={onViewUnpaid}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {topUnpaidFamilies?.length > 0 ? (
              topUnpaidFamilies.slice(0, 5).map((family) => (
                <div
                  key={family.family_id}
                  onClick={() => onViewFamily(family)}
                  className="p-4 hover:bg-secondary/50 cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground truncate">{family.family_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {family.unpaid_months} {family.unpaid_months === 1 ? "month" : "months"} unpaid
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-error/10 text-error rounded-full text-sm font-semibold">
                      {family.total_unpaid}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No unpaid families found
              </div>
            )}
          </div>
        </div>

        {/* Recent Death Support */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Death Support</h2>
            <button
              onClick={() => navigate("/support")}
              className="text-sm text-primary font-medium hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>
          <div className="divide-y divide-border">
            {recentDeathSupport?.length > 0 ? (
              recentDeathSupport.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{payment.family_name}</h3>
                      {payment.paid_at && (
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.paid_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment?.paid_at
                          ? "bg-success/10 text-success"
                          : "bg-error/10 text-error"
                      }`}
                    >
                      {payment?.paid_at ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Paid
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          Unpaid
                        </>
                      )}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-success rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          ((payment.total_collected || 0) / (payment.total_expected || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-success">{payment.total_collected || 0}</span>
                    <span className="text-muted-foreground">/ {payment.total_expected || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No recent death support records
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, trendUp, iconBg, iconColor }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-border/80 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
          <span className={iconColor}>{icon}</span>
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              trendUp ? "text-success" : "text-error"
            }`}
          >
            {trendUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
