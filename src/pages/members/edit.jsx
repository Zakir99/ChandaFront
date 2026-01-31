import { ArrowLeft, Edit2, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";

const EditMember = () => {
  const [families, setFamilies] = useState([]);
  const [member, setMember] = useState({});
  const [formData, setFormData] = useState({
    family_id: member?.family_id || "",
    full_name: member?.full_name || "",
    phone: member?.phone || "",
    role: member?.role || "member",
    status: member?.status || "active",
    join_date: member?.join_date || "",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const formatDateForInput = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };
  useEffect(() => {
    const fetchMember = async () => {
      const response = await axios.get(`${Config.apiUrl}members/${id}`);
      setMember(response.data);
      setFormData({
        family_id: response.data.family_id,
        full_name: response.data.full_name,
        phone: response.data.phone,
        role: response.data.role,
        status: response.data.status,
        join_date: formatDateForInput(response.data.join_date),
      });
    };
    const fetchFamilies = async () => {
      const response = await axios.get(`${Config.apiUrl}families`);
      setFamilies(response.data);
    };
    fetchFamilies();

    fetchMember();
  }, [id]);

  const handleSubmit = (e) => {
    try {
      const response = axios.put(`${Config.apiUrl}members/${id}`, formData);
      if (response.status === 200) {
        navigate("/member");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 md:px-8 py-6">
            <button
              onClick={() => navigate("/member")}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Members
            </button>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Edit2 size={32} />
              Edit Member
            </h1>
            <p className="text-blue-100 mt-2">Update member information</p>
          </div>

          {/* Form */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Family *
                </label>
                <select
                  required
                  value={formData.family_id}
                  onChange={(e) =>
                    setFormData({ ...formData, family_id: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a family</option>
                  {families.map((family) => (
                    <option key={family.id} value={family.id}>
                      {family.family_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="member">Member</option>
                    <option value="treasurer">Treasurer</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="deceased">Deceased</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  value={formData.join_date}
                  onChange={(e) =>
                    setFormData({ ...formData, join_date: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col-reverse md:flex-row gap-3 pt-6 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => onNavigate("list")}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Update Member
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
