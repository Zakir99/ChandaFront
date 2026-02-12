import { useEffect, useState } from "react";
import {
  ChevronLeft,
  User,
  Users,
  MapPin,
  XCircle,
  CheckCircle,
  FileText,
  Save,
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
      <label className="block text-sm font-medium text-foreground mb-2">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground transition-all ${
            error ? "border-error bg-error/5" : "border-border"
          }`}
        />
      </div>
      {error && (
        <p className="mt-2 text-xs text-error flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

const   FamilyForm = ({ onSave, family }) => {
  const isEdit = !!family;
  const initialState = {
    family_name: "",
    city: "",
    phone: "",
    status: "active",
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
        phone: family.phone ?? "",
        status: family.status ?? "active",
        notes: family.notes ?? "",
        total_members: family.total_members ?? "",
      });
    }
  }, [isEdit, family]);

  const onBack = () => navigate("/family");

  const validate = () => {
    const newErrors = {};
    if (!formData.family_name.trim()) newErrors.family_name = "Family name is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (formData.total_members && isNaN(formData.total_members)) {
      newErrors.total_members = "Must be a valid number";
    }
    if (formData.phone && isNaN(formData.phone)) {
      newErrors.phone = "Must be a valid number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const submitData = {
        ...formData,
        total_members: formData.total_members ? parseInt(formData.total_members) : null,
        phone: formData.phone ? parseInt(formData.phone) : null,
      };
      onSave(submitData);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEdit ? "Edit Family" : "Create New Family"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isEdit ? "Update family information" : "Add a new family to the system"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Basic Information</h2>
          </div>

          <InputField
            label="Family Name"
            placeholder="Enter family name"
            required
            icon={Users}
            value={formData.family_name}
            error={errors.family_name}
            onChange={(e) => handleChange("family_name", e.target.value)}
          />

          <InputField
            label="City"
            placeholder="Enter city"
            required
            icon={MapPin}
            value={formData.city}
            error={errors.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Total Members"
              type="number"
              placeholder="Enter number"
              icon={Users}
              value={formData.total_members}
              error={errors.total_members}
              onChange={(e) => handleChange("total_members", e.target.value)}
            />

            <InputField
              label="Phone Number"
              type="number"
              placeholder="Enter Phone Number"
              icon={User}
              value={formData.phone}
              error={errors.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Status</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange("status", "active")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.status === "active"
                  ? "border-success bg-success/10"
                  : "border-border hover:border-border/80 bg-secondary"
              }`}
            >
              <CheckCircle
                className={`w-6 h-6 ${
                  formData.status === "active" ? "text-success" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  formData.status === "active" ? "text-success" : "text-muted-foreground"
                }`}
              >
                Active
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleChange("status", "inactive")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.status === "inactive"
                  ? "border-error bg-error/10"
                  : "border-border hover:border-border/80 bg-secondary"
              }`}
            >
              <XCircle
                className={`w-6 h-6 ${
                  formData.status === "inactive" ? "text-error" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  formData.status === "inactive" ? "text-error" : "text-muted-foreground"
                }`}
              >
                Inactive
              </span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Notes</h2>
          </div>

          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes about this family..."
            rows={4}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-border text-muted-foreground font-medium rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isEdit ? "Update Family" : "Create Family"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FamilyForm;
