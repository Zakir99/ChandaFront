import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  DollarSign,
  ArrowLeft,
  Save,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import toast from "react-hot-toast";
const MonthlyRegisters = () => {
  const [registers, setRegisters] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [families, setFamilies] = useState([]);
  const [editingRegister, setEditingRegister] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    month: "",
    year: "",
    date: "",
    amount_per_member: "",
    created_by: "",
  });
  const navigate = useNavigate();
  const fetchRegisters = async () => {
    const response = await axios.get(`${Config.apiUrl}registers`);
    setRegisters(response.data);
  };
  const fetchFamilies = async () => {
    const response = await axios.get(`${Config.apiUrl}families`);
    setFamilies(response.data);
  };
  const months = [
    { id: 1, name: "January", value: "january" },
    { id: 2, name: "February", value: "february" },
    { id: 3, name: "March", value: "march" },
    { id: 4, name: "April", value: "april" },
    { id: 5, name: "May", value: "may" },
    { id: 6, name: "June", value: "june" },
    { id: 7, name: "July", value: "july" },
    { id: 8, name: "August", value: "august" },
    { id: 9, name: "September", value: "september" },
    { id: 10, name: "October", value: "october" },
    { id: 11, name: "November", value: "november" },
    { id: 12, name: "December", value: "december" },
  ];

  useEffect(() => {
    fetchFamilies();
    fetchRegisters();
  }, []);

  const resetForm = () => {
    setFormData({
      month: "",
      year: "",
      date: "",
      amount_per_member: "",
      created_by: "",
    });
    setEditingRegister(null);
  };

  const goToCreate = () => {
    resetForm();
    setCurrentView("create");
  };

  const goToEdit = (register) => {
    setEditingRegister(register);
    setFormData({
      month: register.month,
      year: register.year,
      date: register.date,
      amount_per_member: register.amount_per_member,
    });
    setCurrentView("edit");
  };

  const goToList = () => {
    resetForm();
    setCurrentView("list");
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.month ||
      !formData.year ||
      !formData.date ||
      !formData.amount_per_member ||
      !formData.created_by
    ) {
      toast.error("Please fill all the required fields");
      return;
    }
    try {
      const response = await axios.post(`${Config.apiUrl}registers`, formData);
      if (response.status === 201) {
        toast.success("Register saved successfully!");
        fetchRegisters();
        goToList();
      } else {
        toast.error("Error saving register");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error saving register");
    }
    goToList();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this register?")) {
      setRegisters(registers.filter((r) => r.id !== id));
    }
  };

  const filteredRegisters = registers.filter(
    (reg) =>
      reg.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.year.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegisters.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRegisters.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount);
  };

  const gotoView = (id) => {
    navigate(`/register/${id}`);
  };
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // LIST VIEW
  if (currentView === "list") {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Monthly Registers
            </h1>
            <p className="text-sm text-gray-600">
              Manage monthly payment records
            </p>
          </div>

          {/* Search and Create Button */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by month or year..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={goToCreate}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>New Register</span>
              </button>
            </div>
          </div>

          {/* Table for Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
            {currentItems.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No registers found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Period
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Collected
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Members
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentItems.map((register) => (
                        <tr
                          key={register.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900 text-sm">
                              {register.month.charAt(0).toUpperCase() +
                                register.month.slice(1)}{" "}
                              {register.year}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {formatDate(register.date)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-semibold text-green-600">
                              {formatCurrency(register.amount_per_member)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-semibold text-gray-900">
                              {formatCurrency(register.completed_amount)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {register.past_month_paid_number} paid
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900">
                              {register.total_members}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => gotoView(register.id)}
                                className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => goToEdit(register)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(register.id)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {indexOfFirstItem + 1} to{" "}
                      {Math.min(indexOfLastItem, filteredRegisters.length)} of{" "}
                      {filteredRegisters.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => paginate(index + 1)}
                          className={`px-3 py-1.5 text-sm rounded transition-colors ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {currentItems.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No registers found</p>
              </div>
            ) : (
              <>
                {currentItems.map((register) => (
                  <div
                    key={register.id}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {register.month.charAt(0).toUpperCase() +
                            register.month.slice(1)}{" "}
                          {register.year}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(register.date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => gotoView(register.id)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => goToEdit(register)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(register.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-green-50 rounded p-2">
                        <p className="text-xs text-green-600 font-medium">
                          Per Member
                        </p>
                        <p className="font-semibold text-green-700 text-sm mt-0.5">
                          {formatCurrency(register.amount_per_member)}
                        </p>
                      </div>

                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-xs text-blue-600 font-medium">
                          Members
                        </p>
                        <p className="font-semibold text-blue-700 text-sm mt-0.5">
                          {register.total_members}
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded p-2">
                        <div className="flex justify-between">
                          <p className="text-xs text-purple-600 font-medium">
                            Collected
                          </p>

                          <span className="text-xs text-purple-600">
                            {register.past_month_paid_number}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-0.5">
                          <p className="font-semibold text-purple-700 text-sm">
                            {formatCurrency(register.completed_amount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mobile Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white rounded-lg shadow-sm p-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CREATE/EDIT VIEW
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={goToList}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to List</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {currentView === "edit" ? "Edit Register" : "Create New Register"}
          </h1>
          <p className="text-sm text-gray-600">
            {currentView === "edit"
              ? "Update the register information"
              : "Add a new monthly register"}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Month <span className="text-red-500">*</span>
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Month</option>
                {months.map((month) => (
                  <option key={month.id} value={month.value}>
                    {month.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Year <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="YYYY"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Amount per Member <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="number"
                  name="amount_per_member"
                  value={formData.amount_per_member}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Created by <span className="text-red-500">*</span>
              </label>
              <select
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Family</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.family_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={goToList}
              className="flex-1 px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{currentView === "edit" ? "Update" : "Create"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRegisters;
