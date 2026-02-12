import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  User,
  Home,
  DollarSign,
  FileText,
  Moon,
  Sun,
} from "lucide-react";
import axios from "axios";
import Config from "../../Js/Config";
import { useNavigate, useParams } from "react-router-dom";
// import "./create.css";
import { toast } from "react-toastify";

const DeathSupportEdit = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const { id } = useParams();
  const [formData, setFormData] = useState({
    family_id: "",
    deceased_name: "",
    death_type: "local",
    relationship: "",
    amount_per_member: "",
    pay_from_account: "off",
    recorded_by: "",
    notes: "",
  });
  const loadSupport = (support) => {
    setFormData({
      family_id: support.family_id ?? "",
      deceased_name: support.deceased_name ?? "",
      death_type: support.death_type ?? "local",
      relationship: support.relationship ?? "",
      amount_per_member: support.amount_per_member ?? "",
      pay_from_account: support.pay_from_account ? "on" : "off",
      recorded_by: support.recorded_by ?? "",
      notes: support.notes ?? "",
    });
  };

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}families`);
        setFamilies(response.data);
      } catch (error) {
        console.error("Error fetching families:", error);
      }
    };
    const fetchSupport = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}support/${id}`);
        loadSupport(response.data.support);
      } catch (error) {
        console.error("Error fetching support:", error);
      }
    };
    fetchSupport();
    fetchFamilies();
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "on" : "off") : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.family_id)
      newErrors.family_id = "Family ID is required";
    if (!formData.deceased_name.trim())
      newErrors.deceased_name = "Deceased name is required";
    if (formData.death_type === "external" && !formData.relationship.trim()) {
      newErrors.relationship = "Relationship is required for external deaths";
    }
    if (
      formData.pay_from_account !== "on" &&
      (!formData.amount_per_member ||
        parseFloat(formData.amount_per_member) <= 0)
    ) {
      newErrors.amount_per_member = "Valid amount is required";
    }
    if (!formData.recorded_by)
      newErrors.recorded_by = "Recorded by is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        pay_from_account: formData.pay_from_account === true ? "on" : "off",
      };

      await axios.put(`${Config.apiUrl}support/${id}`, payload);

      toast.success("Death support updated successfully!");
      navigate("/support");
    } catch (error) {
      console.error("Error updating support:", error);
      toast.error("Failed to update death support");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Theme Toggle */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate("/support")}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors group"
          >
            <ArrowLeft
              size={20}
              className="mr-2 group-hover:-translate-x-1 transition-transform"
            />
            <span className="font-medium">Back to List</span>
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-gray-600" />
            )}
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-colors duration-200">
          {/* Header Section */}
          <div className="relative px-6 sm:px-8 py-10 bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-700 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-800">
            <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
            <div className="relative">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Update Death Support Record
              </h1>
              <p className="text-emerald-100 dark:text-emerald-200 text-sm sm:text-base max-w-2xl">
                Fill in the details below to update the death support record for
                community assistance
              </p>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <User
                      size={20}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Basic Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Family ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center">
                        <Home
                          size={16}
                          className="mr-2 text-emerald-600 dark:text-emerald-400"
                        />
                        Family <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <select
                      name="family_id"
                      value={formData.family_id}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                        ${errors.family_id ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
                        hover:border-gray-400 dark:hover:border-gray-500`}
                    >
                      <option value="">Select Family</option>
                      {families.map((family) => (
                        <option key={family.id} value={family.id}>
                          {family.family_name}
                        </option>
                      ))}
                    </select>
                    {errors.family_id && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.family_id}
                      </p>
                    )}
                  </div>

                  {/* Deceased Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <span className="flex items-center">
                        <User
                          size={16}
                          className="mr-2 text-emerald-600 dark:text-emerald-400"
                        />
                        Deceased Name{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      name="deceased_name"
                      value={formData.deceased_name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                        ${errors.deceased_name ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
                        hover:border-gray-400 dark:hover:border-gray-500`}
                      placeholder="Enter deceased name"
                    />
                    {errors.deceased_name && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.deceased_name}
                      </p>
                    )}
                  </div>

                  {/* Death Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Death Type <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="death_type"
                      value={formData.death_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                        hover:border-gray-400 dark:hover:border-gray-500"
                    >
                      <option value="local">Local</option>
                      <option value="external">External</option>
                    </select>
                  </div>

                  {/* Relationship (conditional) */}
                  {formData.death_type === "external" && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Relationship{" "}
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                          focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                          ${errors.relationship ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
                          hover:border-gray-400 dark:hover:border-gray-500`}
                        placeholder="e.g., Cousin, Friend, etc."
                      />
                      {errors.relationship && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.relationship}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DollarSign
                      size={20}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Financial Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Payment Method */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Payment Method
                    </label>

                    <div
                      className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all duration-200
                        ${
                          formData.pay_from_account === "on"
                            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                            : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-700/50"
                        }`}
                      onClick={() =>
                        handleChange({
                          target: {
                            name: "pay_from_account",
                            value:
                              formData.pay_from_account === "on" ? "off" : "on",
                          },
                        })
                      }
                    >
                      <div className="flex items-center h-6 mt-0.5">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="pay_from_account"
                            checked={formData.pay_from_account === "on"}
                            onChange={handleChange}
                            className="w-5 h-5 cursor-pointer rounded-md border-2 border-gray-300 dark:border-gray-600
                              focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800
                              transition-all duration-200
                              checked:bg-blue-600 dark:checked:bg-blue-500 checked:border-blue-600 dark:checked:border-blue-500"
                          />
                          {formData.pay_from_account === "on" && (
                            <svg
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Pay from account balance
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Use your account balance instead of bank transfer
                        </p>

                        {formData.pay_from_account === "on" && (
                          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg animate-fade-in">
                            <p className="text-xs font-medium text-blue-800 dark:text-blue-300 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1.5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Funds will be deducted from your account balance
                              immediately
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Amount per Member (conditional) */}
                  {formData.pay_from_account !== "on" && (
                    <div className="animate-fade-in">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <span className="flex items-center">
                          <DollarSign
                            size={16}
                            className="mr-2 text-blue-600 dark:text-blue-400"
                          />
                          Amount per Member{" "}
                          <span className="text-red-500 ml-1">*</span>
                        </span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          $
                        </span>
                        <input
                          type="number"
                          name="amount_per_member"
                          value={formData.amount_per_member}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`w-full pl-9 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                            ${errors.amount_per_member ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
                            hover:border-gray-400 dark:hover:border-gray-500`}
                          placeholder="0.00"
                        />
                      </div>
                      {errors.amount_per_member && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.amount_per_member}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Recorded By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recorded By <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      name="recorded_by"
                      value={formData.recorded_by}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 text-sm border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                        ${errors.recorded_by ? "border-red-300 dark:border-red-500" : "border-gray-300 dark:border-gray-600"}
                        hover:border-gray-400 dark:hover:border-gray-500`}
                    >
                      <option value="">Select Person</option>
                      {families.map((family) => (
                        <option key={family.id} value={family.id}>
                          {family.family_name}
                        </option>
                      ))}
                    </select>
                    {errors.recorded_by && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center animate-fade-in">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.recorded_by}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-5">
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FileText
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Additional Information
                  </h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <FileText
                        size={16}
                        className="mr-2 text-purple-600 dark:text-purple-400"
                      />
                      Notes (Optional)
                    </span>
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-all
                      hover:border-gray-400 dark:hover:border-gray-500 resize-none"
                    placeholder="Enter any additional notes or comments..."
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0 flex items-center">
                  <span className="text-red-500 mr-1">*</span>
                  Required fields
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate("/support")}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 
                      text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 dark:hover:from-emerald-600 dark:hover:to-teal-600
                      transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center 
                      font-medium shadow-lg shadow-emerald-500/30 dark:shadow-emerald-900/30 min-w-35"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Record
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DeathSupportEdit;
