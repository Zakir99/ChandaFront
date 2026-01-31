import React, { useState, useEffect, useMemo } from "react";
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
  Activity,
  Filter,
  ChevronUp,
  ChevronDown,
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
      const response = await axios.get(`${Config.apiUrl}members`);
      setMembers(response.data);
    };
    fetchMembers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete member?",
      text: "This action cannot be undone.",
      icon: "warning",
      color: "red",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "red",
      cancelButtonText: "Cancel",
      cancelButtonColor: "blue",
    });

    if (!result.isConfirmed) return;

    setMembers(members.filter((m) => m.id !== id));
    try {
      const response = await axios.delete(`${Config.apiUrl}members/${id}`);
      if (response.status === 200) {
        toast.success("Member deleted successfully");
      } else {
        toast.error("Error deleting member");
      }
    } catch (error) {
      console.log(error);
      alert("Error deleting member");
    }
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
          ? "bg-blue-50 border-blue-200 text-blue-700"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
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
  const processedMembers = useMemo(() => {
    let filtered = members.filter((member) => {
      const matchesSearch =
        member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase());

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

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      treasurer: "bg-blue-100 text-blue-700 border-blue-200",
      member: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[role] || colors.member;
  };

  const onAdd= () => {
    navigate("/member/create");
  }

  const totalPages = Math.ceil(processedMembers.length / itemsPerPage);

  const paginatedMembers = processedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700 border-green-200",
      suspended: "bg-yellow-100 text-yellow-700 border-yellow-200",
      deceased: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-bold text-gray-900">Members</h2>
              <span className="text-sm text-gray-600">
                {members.length} total
              </span>
            </div>

            {/* Add Family Button */}
            <button
              onClick={() => {
                onAdd();
              }}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search Members..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
             
            </button>

            <div className="flex space-x-2 scroll-auto">
              {["all", "active", "suspended", "deceased"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    statusFilter === status
                      ? status === "active"
                        ? "bg-green-100 text-green-700"
                        : status === "inactive"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Sort by
              </label>
              <div className="grid grid-cols-2 gap-2">
                <SortButton field="full_name" label="Name" />
                <SortButton field="role" label="Role" />
                <SortButton field="status" label="Status" />
                <SortButton field="join_date" label="Join Date" />
              </div>
            </div>
          )}
        </div>

        {/* Members List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Family
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {member.full_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">
                          {member.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {member.family_name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone size={16} className="text-slate-400" />
                        {member.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        <Shield size={14} />
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                          member.status
                        )}`}
                      >
                        <Activity size={14} />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar size={16} className="text-slate-400" />
                        {member.join_date || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate("view", member)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate("edit", member)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-100">
            {processedMembers.map((member) => (
              <div key={member.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {member.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {member.full_name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {member.family_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/member/${member.id}`)}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => navigate(`/member/${member.id}/edit`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    {member.phone || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    {member.join_date || "N/A"}
                  </div>
                  <div className="flex gap-2 flex-wrap mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                        member.role
                      )}`}
                    >
                      <Shield size={14} />
                      {member.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeColor(
                        member.status
                      )}`}
                    >
                      <Activity size={14} />
                      {member.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {processedMembers.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Users size={48} className="mx-auto mb-4 text-slate-300" />
              <p className="text-lg font-medium">No members found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Members;
