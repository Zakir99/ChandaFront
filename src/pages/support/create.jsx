// components/death-supports/DeathSupportCreate.jsx
import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  AlertCircle,
  User,
  Home,
  DollarSign,
  FileText,
} from "lucide-react";
import axios from "axios";
import Config from "../../Js/Config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DeathSupportCreate = () => {
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
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    const fetchFamilies = async () => {
      const response = await axios.get(`${Config.apiUrl}families`);
      setFamilies(response.data);
    };

    fetchFamilies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.family_id.trim())
      newErrors.family_id = "Family ID is required";
    if (!formData.deceased_name.trim())
      newErrors.deceased_name = "Deceased name is required";
    if (formData.death_type === "external" && !formData.relationship.trim()) {
      newErrors.relationship = "Relationship is required for external deaths";
    }
    if (
      !formData.amount_per_member ||
      parseFloat(formData.amount_per_member) <= 0
    ) {
      newErrors.amount_per_member = "Valid amount is required";
    }
    if (!formData.recorded_by.trim())
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

    // setSubmitting(true);
    console.log(formData);
    // const response = await axios.post(`${Config.apiUrl}support`, formData);
    // if (response.status === 201) {
    //   toast.success("Death support saved successfully!");
    //   navigate("/support");
    // } else {
    //   toast.error("Error saving death support");
    // }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate("/death-supports")}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 bg-linear-to-r from-green-600 to-green-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Create New Death Support Record
          </h1>
          <p className="text-green-100 mt-2">
            Fill in the details below to create a new death support record
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Family ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <Home size={16} className="mr-1" />
                      Family ID *
                    </span>
                  </label>
                  <select
                    name="family_id"
                    value={formData.family_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Family</option>
                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.family_name}
                      </option>
                    ))}
                  </select>
                  {errors.family_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.family_id}
                    </p>
                  )}
                </div>

                {/* Deceased Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      Deceased Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="deceased_name"
                    value={formData.deceased_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.deceased_name
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter deceased name"
                  />
                  {errors.deceased_name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.deceased_name}
                    </p>
                  )}
                </div>

                {/* Death Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Death Type *
                  </label>
                  <select
                    name="death_type"
                    value={formData.death_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="local">Local</option>
                    <option value="external">External</option>
                  </select>
                </div>

                {/* Relationship (required for external) */}
                {formData.death_type === "external" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                        errors.relationship
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Cousin, Friend, etc."
                    />
                    {errors.relationship && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.relationship}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Financial Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount per Member */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Payment Method
                  </label>

                  <div
                    className={`
      flex items-start p-3 border rounded-lg transition-all duration-200
      ${
        formData.pay_from_account == "on"
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-gray-400"
      }
    `}
                    onClick={() =>
                      handleChange({
                        target: {
                          name: "pay_from_account",
                          value: !formData.pay_from_account,
                        },
                      })
                    }
                  >
                    <div className="flex items-center h-6 mt-0.5">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="pay_from_account"
                          checked={formData.pay_from_account == 'on'}
                          onChange={handleChange}
                          className="
            w-5 h-5 cursor-pointer
            rounded border-2
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            transition-all duration-200
            [&:checked]:bg-blue-600 [&:checked]:border-blue-600
          "
                        />
                        {formData.pay_from_account == "on" && (
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

                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Pay from account
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Use your account balance instead of bank transfer
                      </p>

                      {formData.pay_from_account == 'on' && (
                        <div className="mt-2 p-2 bg-blue-100 rounded-md">
                          <p className="text-xs font-medium text-blue-800">
                            ✓ Funds will be deducted from your account balance
                            immediately
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {formData.pay_from_account !== "on" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <span className="flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        Amount per Member *
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        name="amount_per_member"
                        value={formData.amount_per_member}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.amount_per_member
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.amount_per_member && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.amount_per_member}
                      </p>
                    )}
                  </div>
                )}

                {/* Recorded By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recorded By *
                  </label>
                  <select
                    name="recorded_by"
                    value={formData.recorded_by}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 h-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Family</option>
                    {families.map((family) => (
                      <option key={family.id} value={family.id}>
                        {family.family_name}
                      </option>
                    ))}
                  </select>
                  {errors.recorded_by && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.recorded_by}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Additional Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    Notes (Optional)
                  </span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter any additional notes or comments..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Fields marked with * are required
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/support")}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-30"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
  );
};

export default DeathSupportCreate;
