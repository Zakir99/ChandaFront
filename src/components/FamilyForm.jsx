import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  User,
  Users,
  MapPin,
  XCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InputField = ({
  label,
  type = "text",
  placeholder,
  required = false,
  icon: Icon,
  value,
  error,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        )}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${
            Icon ? "pl-10" : "pl-4"
          } pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
            error ? "border-red-300 bg-red-50" : "border-gray-200"
          }`}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center">
          <XCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

const FamilyForm = ({ onSave, family }) => {
  const isEdit = !!family;
  const initialState = {
    family_name: "",
    city: "",
    head_member_id: "",
    status: "",
    notes: "",
    total_members: "",
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  useEffect(() => {
    if (isEdit && family) {
      setFormData({
        family_name: family.family_name ?? "",
        city: family.city ?? "",
        head_member_id: family.head_member_id ?? "",
        status: family.status ?? "",
        notes: family.notes ?? "",
        total_members: family.total_members ?? "",
      });
    }
  }, [isEdit, family]);

  const onBack = () => {
    navigate("/family");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.family_name.trim())
      newErrors.family_name = "Family name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (formData.total_members && isNaN(formData.total_members)) {
      newErrors.total_members = "Must be a valid number";
    }
    if (formData.head_member_id && isNaN(formData.head_member_id)) {
      newErrors.head_member_id = "Must be a valid number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        total_members: formData.total_members
          ? parseInt(formData.total_members)
          : null,
        head_member_id: formData.head_member_id
          ? parseInt(formData.head_member_id)
          : null,
      };
      onSave(submitData);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? "Edit Family" : "Create New Family"}
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Basic Information Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-600" />
            Basic Information
          </h3>

          <InputField
            label="Family Name"
            field="family_name"
            placeholder="Enter family name"
            required
            icon={Users}
            value={formData.family_name}
            error={errors.family_name}
            onChange={(e) => handleChange("family_name", e.target.value)}
          />

          <InputField
            label="City"
            field="city"
            placeholder="Enter city"
            required
            icon={MapPin}
            value={formData.city}
            error={errors.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <InputField
            label="Total Members"
            field="total_members"
            type="number"
            placeholder="Enter number of members"
            icon={Users}
            value={formData.total_members}
            error={errors.total_members}
            onChange={(e) => handleChange("total_members", e.target.value)}
          />

          <InputField
            label="Head Member ID"
            field="head_member_id"
            type="number"
            placeholder="Enter head member ID (optional)"
            icon={User}
            value={formData.head_member_id}
            error={errors.head_member_id}
            onChange={(e) => handleChange("head_member_id", e.target.value)}
          />
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
            Status
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange("status", "active")}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.status === "active"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <CheckCircle
                className={`w-5 h-5 mx-auto mb-1 ${
                  formData.status === "active"
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  formData.status === "active"
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                Active
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleChange("status", "inactive")}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.status === "inactive"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <XCircle
                className={`w-5 h-5 mx-auto mb-1 ${
                  formData.status === "inactive"
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  formData.status === "inactive"
                    ? "text-red-700"
                    : "text-gray-600"
                }`}
              >
                Inactive
              </span>
            </button>
          </div>
        </div>

        {/* Notes Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
            <FileText className="w-4 h-4 mr-2 text-blue-600" />
            Notes
          </h3>

          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes about this family..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
          >
            {isEdit ? "Update Family" : "Create Family"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyForm;
