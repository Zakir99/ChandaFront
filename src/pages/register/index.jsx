import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  Users,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

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

  const fetchRegisters = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}registers`);
      setRegisters(response.data);
    } catch (error) {
      console.error("Failed to fetch registers:", error);
    }
  };

  const fetchFamilies = async () => {
    try {
      const response = await axios.get(`${Config.apiUrl}families`);
      setFamilies(response.data);
    } catch (error) {
      console.error("Failed to fetch families:", error);
    }
  };

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
      created_by: register.created_by || "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.month ||
      !formData.year ||
      !formData.date ||
      !formData.amount_per_member ||
      !formData.created_by
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      if (currentView === "create") {
        await axios.post(`${Config.apiUrl}registers`, formData);
        toast.success("Register saved successfully!");
      } else if (currentView === "edit") {
        await axios.put(
          `${Config.apiUrl}registers/${editingRegister.id}`,
          formData,
        );
        toast.success("Register updated successfully!");
      }

      fetchRegisters();
      goToList();
    } catch (error) {
      console.error(error);
      toast.error("Error saving register");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#000000",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`${Config.apiUrl}registers/${id}`);
        if (response.status === 200) {
          toast.success("Register deleted successfully!");
          setRegisters(registers.filter((r) => r.id !== id));
        }
      } catch (error) {
        console.error(error);
        toast.error("Error deleting register");
      }
    }
  };
  const filteredRegisters = registers.filter(
    (reg) =>
      reg.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.year?.toString().includes(searchTerm),
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegisters.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredRegisters.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
    }).format(amount || 0);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              Monthly Registers
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage monthly payment records
            </p>
          </div>
          <button
            onClick={goToCreate}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Register
          </button>
        </div>

        {/* Search */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by month or year..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-card border border-border rounded-xl overflow-hidden">
          {currentItems.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No registers found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Collected
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentItems.map((register) => (
                  <tr
                    key={register.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">
                        {register.month?.charAt(0).toUpperCase() +
                          register.month?.slice(1)}{" "}
                        {register.year}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatDate(register.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-success font-semibold">
                        {formatCurrency(register.amount_per_member)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {formatCurrency(register.collected_amount)}
                      </div>
                      {/* <div className="text-xs text-muted-foreground">
                        {register.past_month_paid_number} paid
                      </div> */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">
                        {formatCurrency(register.remaining_amount)}
                      </div>
                      {/* <div className="text-xs text-muted-foreground">
                        {register.remaining_number} remaining
                      </div> */}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {register.total_members}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => navigate(`/register/${register.id}`)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => goToEdit(register)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(register.id)}
                          className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {currentItems.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No registers found</p>
            </div>
          ) : (
            currentItems.map((register) => (
              <div
                key={register.id}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {register.month?.charAt(0).toUpperCase() +
                          register.month?.slice(1)}{" "}
                        {register.year}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(register.date)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/register/${register.id}`)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => goToEdit(register)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(register.id)}
                        className="p-2 text-muted-foreground hover:text-error hover:bg-error/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-success/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-success font-medium">
                        Per Member
                      </p>
                      <p className="font-semibold text-success text-sm mt-0.5">
                        {formatCurrency(register.amount_per_member)}
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-primary font-medium">
                        Members
                      </p>
                      <p className="font-semibold text-primary text-sm mt-0.5">
                        {register.total_members}
                      </p>
                    </div>
                    <div className="bg-warning/10 rounded-lg p-2 text-center">
                      <p className="text-xs text-warning font-medium">
                        Collected
                      </p>
                      <p className="font-semibold text-warning text-sm mt-0.5">
                        {formatCurrency(register.completed_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredRegisters.length)} of{" "}
                {filteredRegisters.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border border-border rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                </button>
                <span className="text-sm text-foreground px-2">
                  {currentPage} / {totalPages}
                </span>
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
  }

  // CREATE/EDIT VIEW
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={goToList}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {currentView === "edit" ? "Edit Register" : "Create New Register"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentView === "edit"
              ? "Update register information"
              : "Add a new monthly register"}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Register Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Month <span className="text-error">*</span>
              </label>
              <select
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground appearance-none"
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Year <span className="text-error">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="2024"
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Amount per Member <span className="text-error">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  name="amount_per_member"
                  value={formData.amount_per_member}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Created By <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground appearance-none"
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
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={goToList}
            className="flex-1 px-4 py-3 border border-border text-muted-foreground font-medium rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {currentView === "edit" ? "Update Register" : "Save Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MonthlyRegisters;
