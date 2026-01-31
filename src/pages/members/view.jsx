import { ChevronLeft, Users, Shield, Calendar, Phone, Edit2, UserCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Config from "../../Js/Config";

const ViewMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [member, setMember] = useState({});

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}members/${id}`);
        setMember(response.data);
      } catch (error) {
        console.error("Failed to fetch member:", error);
      }
    };
    fetchMember();
  }, [id]);

  const getRoleBadge = (role) => {
    const config = {
      admin: "bg-primary/10 text-primary border-primary/20",
      treasurer: "bg-warning/10 text-warning border-warning/20",
      member: "bg-muted text-muted-foreground border-border",
    };
    return config[role] || config.member;
  };

  const getStatusBadge = (status) => {
    const config = {
      active: "bg-success/10 text-success border-success/20",
      suspended: "bg-warning/10 text-warning border-warning/20",
      deceased: "bg-error/10 text-error border-error/20",
    };
    return config[status] || config.active;
  };

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/member")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl">
              {member?.full_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{member?.full_name || "Loading..."}</h1>
              <p className="text-muted-foreground">{member?.family_name}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/member/${id}/edit`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit Member
        </button>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          </div>
          <div className="space-y-0">
            <InfoRow icon={Users} label="Full Name" value={member?.full_name} />
            <InfoRow icon={Users} label="Family" value={member?.family_name} />
            <InfoRow icon={Phone} label="Phone" value={member?.phone} />
          </div>
        </div>

        {/* Role & Status */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Role & Status</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Role</p>
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getRoleBadge(member?.role)}`}>
                <Shield className="w-4 h-4" />
                {member?.role}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getStatusBadge(member?.status)}`}>
                {member?.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Join Date</p>
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {member?.join_date || "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Details */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Additional Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Member ID</p>
            <p className="text-foreground font-medium">#{member?.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Created At</p>
            <p className="text-foreground font-medium">
              {member?.created_at
                ? new Date(member.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate(`/member/${id}/edit`)}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <Edit2 className="w-5 h-5" />
          Edit Member
        </button>
        <button
          onClick={() => navigate("/member")}
          className="flex-1 px-6 py-3 border border-border text-muted-foreground rounded-lg font-medium hover:bg-secondary hover:text-foreground transition-colors"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default ViewMember;
