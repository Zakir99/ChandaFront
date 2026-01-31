import { ArrowLeft, Users, Shield, Activity, Calendar, Phone, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Config from '../../Js/Config';

const ViewMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState({});

  useEffect(() => {
    const fetchMember = async () => {
      const response = await axios.get(`${Config.apiUrl}members/${id}`);
      setMember(response.data);
    };
    fetchMember();
  }, [id]);

  

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-700 border-purple-200',
      treasurer: 'bg-blue-100 text-blue-700 border-blue-200',
      member: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[role] || colors.member;
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-700 border-green-200',
      suspended: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      deceased: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[status] || colors.active;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 md:px-8 py-6">
            <button
              onClick={() => navigate('/member')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Members
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                {member?.full_name?.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{member?.full_name}</h1>
                <p className="text-indigo-100 mt-1">{member?.family_name}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Info Card */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Users size={20} className="text-indigo-600" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Full Name</p>
                    <p className="text-slate-800 font-medium">{member?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Family</p>
                    <p className="text-slate-800 font-medium">{member?.family_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Phone</p>
                    <p className="text-slate-800 font-medium flex items-center gap-2">
                      <Phone size={16} className="text-slate-400" />
                      {member?.phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-indigo-600" />
                  Role & Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Role</p>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getRoleBadgeColor(member?.role)}`}>
                      <Shield size={16} />
                      {member?.role}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-2">Status</p>
                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusBadgeColor(member?.status)}`}>
                      <Activity size={16} />
                      {member?.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Join Date</p>
                    <p className="text-slate-800 font-medium flex items-center gap-2">
                      <Calendar size={16} className="text-slate-400" />
                      {member?.join_date || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-8">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Member ID</p>
                  <p className="text-slate-800 font-medium">#{member?.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Created At</p>
                  <p className="text-slate-800 font-medium">{member?.created_at || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-3">
              <button
                onClick={() => onNavigate('edit', member)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Edit2 size={20} />
                Edit Member
              </button>
              <button
                onClick={() => onNavigate('list')}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMember;