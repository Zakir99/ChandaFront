import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Users,
  Phone,
  Calendar,
  Shield,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("full_name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}members`);
        setMembers(response.data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete member?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#ef4444",
      cancelButtonText: "Cancel",
      background: "#141415",
      color: "#fafafa",
    });

    if (!result.isConfirmed) return;

    setMembers(members.filter((m) => m.id !== id));
    try {
      const response = await axios.delete(`${Config.apiUrl}members/${id}`);
      if (response.status === 200) {
        toast.success("Member deleted successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error deleting member");
    }
  };

  const processedMembers = useMemo(() => {
    let filtered = members.filter((member) => {
      const matchesSearch =
        member.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || member.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (sortBy === "created_at" || sortBy === "join_date") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [members, searchTerm, statusFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedMembers.length / itemsPerPage);
  const paginatedMembers = processedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getRoleBadge = (role) => {
    const config = {
      admin: "bg-primary/10 text-primary border-primary/20",
      treasurer: "bg-warning/10 text-warning border-warning/20",
      member: "bg-muted text-muted-foreground border-border",
    };
    return config[role] || config.member;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: "bg-success/10 text-success border-success/20",
      suspended: "bg-warning/10 text-warning border-warning/20",
      deceased: "bg-error/10 text-error border-error/20",
    };
    return config[status] || config.active;
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => {
        if (sortBy === field) {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortBy(field);
          setSortOrder("asc");
        }
      }}
      className={`flex items-center justify-center px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
        sortBy === field
          ? "bg-primary/10 border-primary/20 text-primary"
          : "bg-secondary border-border text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
      {sortBy === field &&
        (sortOrder === "asc" ? (
          <ChevronUp className="w-4 h-4 ml-1" />
        ) : (
          <ChevronDown className="w-4 h-4 ml-1" />
        ))}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Members
          </h1>
          <p className="text-muted-foreground mt-1">
            {processedMembers.length} members registered
          </p>
        </div>
        <button
          onClick={() => navigate("/member/create")}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {["all", "active", "suspended", "deceased"].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === status
                    ? status === "active"
                      ? "bg-success/10 text-success border border-success/20"
                      : status === "suspended"
                        ? "bg-warning/10 text-warning border border-warning/20"
                        : status === "deceased"
                          ? "bg-error/10 text-error border border-error/20"
                          : "bg-primary/10 text-primary border border-primary/20"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center justify-center px-4 py-2 bg-secondary text-muted-foreground hover:text-foreground border border-border rounded-lg text-sm font-medium transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Sort
          </button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Sort by
            </p>
            <div className="flex flex-wrap gap-2">
              <SortButton field="full_name" label="Name" />
              <SortButton field="role" label="Role" />
              <SortButton field="status" label="Status" />
              <SortButton field="join_date" label="Join Date" />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Family
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Phone
              </th>
              {/* <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Role
              </th> */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedMembers.length > 0 ? (
              paginatedMembers.map((member, index) => (
                <tr
                  key={member.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    {index}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      
                      <span className="font-small text-foreground">
                        {member.full_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {member.family_name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {member.phone || "N/A"}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(member.role)}`}
                    >
                      <Shield className="w-3 h-3" />
                      {member.role}
                    </span>
                  </td> */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(member.status)}`}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {member.join_date
                        ? new Date(member.join_date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                            },
                          )
                        : "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/member/${member.id}`)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/member/${member.id}/edit`)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No members found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {paginatedMembers.length > 0 ? (
          paginatedMembers.map((member) => (
            <div
              key={member.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                      {member.full_name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {member.full_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {member.family_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => navigate(`/member/${member.id}`)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/member/${member.id}/edit`)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    {member.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {member.join_date || "N/A"}
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(member.role)}`}
                    >
                      <Shield className="w-3 h-3" />
                      {member.role}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(member.status)}`}
                    >
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
            <UserCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No members found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, processedMembers.length)} of{" "}
              {processedMembers.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2)
                    pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
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
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
