import { ChevronLeft, Plus, Phone, User, Users, Calendar, Shield, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import toast from "react-hot-toast";

const CreateMember = () => {
  const [families, setFamilies] = useState([]);
  const [formData, setFormData] = useState({
    family_id: "",
    full_name: "",
    phone: "",
    role: "member",
    status: "active",
    join_date: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}families`);
        setFamilies(response.data);
      } catch (error) {
        console.error("Failed to fetch families:", error);
      }
    };
    fetchFamilies();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.family_id) newErrors.family_id = "Please select a family";
    if (!formData.full_name.trim()) newErrors.full_name = "Full name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post(`${Config.apiUrl}members`, formData);
      if (response.status === 201) {
        toast.success("Member created successfully");
        navigate("/member");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create member");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/member")}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Plus className="w-6 h-6 text-primary" />
            Add New Member
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Fill in the details to create a new member</p>
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Family <span className="text-error">*</span>
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                required
                value={formData.family_id}
                onChange={(e) => {
                  setFormData({ ...formData, family_id: e.target.value });
                  if (errors.family_id) setErrors({ ...errors, family_id: "" });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground transition-all appearance-none ${
                  errors.family_id ? "border-error bg-error/5" : "border-border"
                }`}
              >
                <option value="">Select a family</option>
                {families.map((family) => (
                  <option key={family.id} value={family.id}>
                    {family.family_name}
                  </option>
                ))}
              </select>
            </div>
            {errors.family_id && <p className="mt-2 text-xs text-error">{errors.family_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name <span className="text-error">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => {
                  setFormData({ ...formData, full_name: e.target.value });
                  if (errors.full_name) setErrors({ ...errors, full_name: "" });
                }}
                className={`w-full pl-10 pr-4 py-3 bg-secondary border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground ${
                  errors.full_name ? "border-error bg-error/5" : "border-border"
                }`}
                placeholder="Enter full name"
              />
            </div>
            {errors.full_name && <p className="mt-2 text-xs text-error">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground placeholder:text-muted-foreground"
                placeholder="+1234567890"
              />
            </div>
          </div>
        </div>

        {/* Role & Status */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Role & Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground appearance-none"
              >
                <option value="member">Member</option>
                <option value="treasurer">Treasurer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground appearance-none"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deceased">Deceased</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Join Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="date"
                value={formData.join_date}
                onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm text-foreground"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/member")}
            className="flex-1 px-4 py-3 border border-border text-muted-foreground font-medium rounded-lg hover:bg-secondary hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Create Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMember;
