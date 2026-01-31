import { Edit2, ChevronLeft, CheckCircle, XCircle, MapPin, Users, User, Calendar, FileText, DollarSign, ChevronRight, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Config from "../../Js/Config";
import { useEffect, useState } from "react";

const FamilyView = () => {
  const [family, setFamily] = useState({});
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [deathSupportPayments, setDeathSupportPayments] = useState([]);
  const [activeTable, setActiveTable] = useState("monthly");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${Config.apiUrl}families/${id}`);
        const data = await response.json();
        setFamily(data.family || {});
        setMonthlyPayments(data.monthly_payments || []);
        setDeathSupportPayments(data.death_support_payments || []);
      } catch (error) {
        console.error("Failed to fetch family data:", error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTable]);

  const onBack = () => navigate("/family");
  const onEdit = () => navigate(`/family/${id}/edit`);

  const getCurrentTableData = () => {
    return activeTable === "monthly" ? monthlyPayments : deathSupportPayments;
  };

  const currentData = getCurrentTableData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = currentData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value || "N/A"}</span>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const isActive = status === "paid" || status === "active";
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isActive ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
        }`}
      >
        {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const MonthlyPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Month</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Year</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Paid At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr key={payment.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground capitalize">{payment.month}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{payment.year}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No monthly payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-foreground capitalize">
                    {payment.month} {payment.year}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Monthly Payment</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid at</span>
                  <span className="text-foreground">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No monthly payments found</div>
        )}
      </div>
    </>
  );

  const DeathSupportPaymentsTable = () => (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Deceased Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Death Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Paid At</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length > 0 ? (
              paginatedData.map((payment) => (
                <tr key={payment.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{payment.deceased_name}</td>
                  <td className="px-4 py-3 text-sm text-foreground capitalize">{payment.death_type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-muted-foreground">
                  No death support payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden divide-y divide-border">
        {paginatedData.length > 0 ? (
          paginatedData.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{payment.deceased_name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 capitalize">{payment.death_type} death</p>
                </div>
                <StatusBadge status={payment.status} />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium text-foreground">
                    ${parseFloat(payment.amount_per_member).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid at</span>
                  <span className="text-foreground">
                    {payment.paid_at
                      ? new Date(payment.paid_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Not paid"}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">No death support payments found</div>
        )}
      </div>
    </>
  );

  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-4 py-3 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, currentData.length)} of {currentData.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === pageNum
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{family.family_name || "Loading..."}</h1>
            <p className="text-muted-foreground text-sm mt-1">Family Details</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
              family.status === "active"
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {family.status === "active" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {family.status?.charAt(0)?.toUpperCase() + family.status?.slice(1)}
          </span>
          <button
            onClick={onEdit}
            className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Family Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Family Information</h2>
          <div className="space-y-0">
            <InfoRow icon={MapPin} label="City" value={family.city} />
            <InfoRow icon={Users} label="Total Members" value={family?.total_members?.toString()} />
            <InfoRow icon={User} label="Head Member ID" value={family?.head_member_id?.toString()} />
            <InfoRow
              icon={Calendar}
              label="Created"
              value={
                family.created_at
                  ? new Date(family.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"
              }
            />
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notes</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {family.notes || "No notes available for this family."}
          </p>
        </div>
      </div>

      {/* Payments Section */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTable("monthly")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
              activeTable === "monthly"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Monthly Payments
            <span className="ml-1 px-2 py-0.5 bg-secondary rounded-full text-xs">
              {monthlyPayments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTable("death")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
              activeTable === "death"
                ? "text-primary border-b-2 border-primary bg-primary/5"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Heart className="w-4 h-4" />
            Death Support
            <span className="ml-1 px-2 py-0.5 bg-secondary rounded-full text-xs">
              {deathSupportPayments.length}
            </span>
          </button>
        </div>

        {/* Table Content */}
        {activeTable === "monthly" ? <MonthlyPaymentsTable /> : <DeathSupportPaymentsTable />}

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default FamilyView;
