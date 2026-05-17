import React, { useState, useEffect, use } from "react";
import {
  Building2,
  Users,
  Calendar,
  Heart,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Search,
  Filter,
  UserCog,
  Home,
  UserPlus,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Shield,
} from "lucide-react";
import useFetchData from "../../../hooks/useFetchData";
import { useParams } from "react-router-dom";

const CommunityView = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [community, setCommunity] = useState(null);
  const id = useParams().id;
  const [stats, setStats] = useState({
    totalFamilies: 0,
    totalMembers: 0,
    activeAdmins: 0,
    monthlyRegisters: 0,
    deathSupports: 0,
    pendingPayments: 0,
  });

  const onSuccess = (data) => {
    setCommunity(data);
    setStats({
      totalFamilies: data.families.total_members || 0,
      totalMembers: data.families.reduce(
        (s, f) => s + (f.total_members || 0),
        0,
      ),
      activeAdmins: data.administrators.length || 0,
      monthlyRegisters: data.monthlyRegisters.length || 0,
      deathSupports: data.deathSupports.length || 0,
      pendingPayments: data.deathSupports.filter((d) => !d.paid_at).length || 0,
    });
  };

  const onError = (err) => {
    console.error(err);
  };
  const { data, loading, error } = useFetchData({
    url: "communities/" + id,
    onSuccess,
    onError,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "administrators", label: "Administrators", icon: UserCog },
    { id: "families", label: "Families", icon: Home },
    { id: "monthly-registers", label: "Monthly Registers", icon: Calendar },
    { id: "death-supports", label: "Death Supports", icon: Heart },
  ];

  const statCards = [
    {
      label: "Total Families",
      value: stats.totalFamilies.length || 0,
      icon: Home,
      grad: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Members",
      value: stats.totalMembers,
      icon: Users,
      grad: "from-emerald-500 to-emerald-600",
    },
    {
      label: "Administrators",
      value: stats.activeAdmins,
      icon: Shield,
      grad: "from-violet-500 to-violet-600",
    },
    {
      label: "Monthly Registers",
      value: stats.monthlyRegisters,
      icon: Calendar,
      grad: "from-amber-500 to-amber-600",
    },
    {
      label: "Death Supports",
      value: stats.deathSupports,
      icon: Heart,
      grad: "from-rose-500 to-rose-600",
    },
    {
      label: "Pending Payments",
      value: stats.pendingPayments,
      icon: Clock,
      grad: "from-orange-500 to-orange-600",
    },
  ];

  if (loading)
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin" />
            </div>
            <p className="text-sm font-medium tracking-widest uppercase text-slate-500 dark:text-slate-400">
              Loading community
            </p>
          </div>
        </div>
      </div>
    );

  if (!data)
    return (
      <div>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-500">
              Community not found
            </h2>
          </div>
        </div>
      </div>
    );

  return (
    <div>
      <div className="cv-root min-h-screen dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        {/* ── Sticky top bar ────────────────────────────── */}
        <div className="top-0 z-50 shadow-md rounded-md dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg leading-tight text-slate-900 dark:text-slate-100">
                  {community.name}
                </h1>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {community.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {community.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                  community.is_active
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${community.is_active ? "bg-emerald-500 dark:bg-emerald-400 status-pulse" : "bg-slate-400"}`}
                />
                {community.is_active ? "Active" : "Inactive"}
              </span>

              <button className="btn-amber flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg shadow-amber-500/25">
                <Edit className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit Community</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 bg-white dark:bg-gray-950/50">
          {/* ── Stat cards ──────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 py-6">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl p-4 bg-linear-to-br ${card.grad} stat-shine card-lift shadow-lg cursor-default`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white/70 text-xs font-medium leading-tight mb-1">
                      {card.label}
                    </p>
                    <p className="font-display text-3xl font-bold text-white leading-none">
                      {card.value}
                    </p>
                  </div>
                  <card.icon className="h-5 w-5 text-white/60 mt-0.5 shrink-0" />
                </div>
              </div>
            ))}
          </div>

          {/* ── Tabs ────────────────────────────────────── */}
          <div className="flex items-center gap-1 shadow-md rounded-md dark:border-slate-800 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-linear-to-r from-amber-400 to-amber-600" />
                )}
              </button>
            ))}
          </div>

          {/* ════ OVERVIEW ════ */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pb-10">
              <div className="lg:col-span-2 rounded-2xl shadow-md rounded-md dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="font-display font-semibold text-base mb-5 text-slate-800 dark:text-slate-100">
                  Community Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-5">
                  {/* Image section - takes full width on mobile, first column on desktop */}
                  <div className="sm:col-span-1">
                    {community.image ? (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400 dark:text-slate-500">
                          Community Image
                        </p>
                        <img
                          src={community.image}
                          alt={community.name || "Community"}
                          className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400 dark:text-slate-500">
                          Community Image
                        </p>
                        <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                          <span className="text-slate-400 dark:text-slate-500 text-sm">
                            No image available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Your existing grid items */}
                    {[
                      {
                        label: "Community Name",
                        value: community.name,
                        // mono: true,
                      },
                      {
                        label: "Created",
                        value: new Date(
                          community.created_at,
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                      },
                      { label: "Address", value: community.address },
                      { label: "Phone", value: community.phone },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400 dark:text-slate-500">
                          {item.label}
                        </p>
                        <p
                          className={`text-sm text-slate-700 dark:text-slate-200 ${item.mono ? "font-mono" : ""}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl shadow-md rounded-md dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
                <h2 className="font-display font-semibold text-base mb-5 text-slate-800 dark:text-slate-100">
                  Recent Activity
                </h2>
                <div className="space-y-2">
                  {[
                    {
                      icon: UserPlus,
                      color: "text-blue-500 bg-blue-500/10",
                      title: "New family registered",
                      desc: "Johnson Family joined",
                      time: "2h ago",
                    },
                    {
                      icon: DollarSign,
                      color: "text-emerald-500 bg-emerald-500/10",
                      title: "Monthly register created",
                      desc: "March 2024 register added",
                      time: "1d ago",
                    },
                    {
                      icon: Heart,
                      color: "text-rose-500 bg-rose-500/10",
                      title: "Death support processed",
                      desc: "Support for Robert Johnson",
                      time: "3d ago",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-default"
                    >
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
                      >
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">
                          {item.title}
                        </p>
                        <p className="text-xs truncate text-slate-400 dark:text-slate-500">
                          {item.desc}
                        </p>
                      </div>
                      <span className="text-xs shrink-0 text-slate-400 dark:text-slate-600">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ ADMINISTRATORS ════ */}
          {activeTab === "administrators" && (
            <div className="rounded-2xl shadow-md rounded-md dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-10">
              <div className="px-6 py-4  dark:border-slate-800 flex justify-between items-center">
                <h2 className="font-display font-semibold text-slate-800 dark:text-slate-100">
                  Administrators
                </h2>
                <button className="btn-amber flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg shadow-amber-500/25">
                  <UserPlus className="h-3.5 w-3.5" />
                  Add Administrator
                </button>
              </div>
              {community.administrators.map((admin, i) => (
                <div
                  key={admin.id}
                  className={`px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    i < community.administrators.length - 1
                      ? "border-b border-slate-100 dark:border-slate-800"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-500/20 shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {admin.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-800 dark:text-slate-100">
                        {admin.name}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {admin.email}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {admin.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium border bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20">
                      {admin.role.replace("_", " ")}
                    </span>
                    <span className="hidden md:block text-xs text-slate-400 dark:text-slate-500">
                      Last: {new Date(admin.last_login).toLocaleDateString()}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 transition-colors">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ════ FAMILIES ════ */}
          {activeTab === "families" && (
            <div className="rounded-2xl shadow-md rounded-md dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-10">
              <div className="px-6 py-4  dark:border-slate-800 flex justify-between items-center gap-3 flex-wrap">
                <h2 className="font-display font-semibold text-slate-800 dark:text-slate-100">
                  Families
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden">
                    <Search className="h-3.5 w-3.5 absolute left-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search families…"
                      className="pl-9 pr-4 py-2 text-sm bg-transparent focus:outline-none w-44 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                  </div>
                  <button className="btn-amber flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg shadow-amber-500/25">
                    <Plus className="h-3.5 w-3.5" />
                    Add Family
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      {[
                        "Family",
                        "Location",
                        "Members",
                        "Status",
                        "Contact",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {community?.families?.map((family, i) => (
                      <tr
                        key={family.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                          i < community.families.length - 1
                            ? "border-b border-slate-100 dark:border-slate-800"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                              <Home className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-800 dark:text-slate-100">
                                {family.family_name}
                              </div>
                              <div className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                {family.uuid.slice(0, 8)}…
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {family.city}
                          </div>
                          <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            {family.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-slate-300">
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            {family.total_members}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {family.status === "active" ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" />
                              active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600">
                              <XCircle className="h-3 w-3" />
                              inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <Phone className="h-3.5 w-3.5" />
                            {family.phone}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium mr-3 transition-colors">
                            View
                          </button>
                          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-colors">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════ MONTHLY REGISTERS ════ */}
          {activeTab === "monthly-registers" && (
            <div className="mb-10">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-display font-semibold text-lg text-slate-800 dark:text-slate-100">
                  Monthly Registers
                </h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </button>
                  <button className="btn-amber flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg shadow-amber-500/25">
                    <Plus className="h-3.5 w-3.5" />
                    New Register
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {community.monthlyRegisters.map((register) => {
                  const pct = Math.round(
                    (register.past_month_paid_number / register.total_members) *
                      100,
                  );
                  return (
                    <div
                      key={register.id}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 card-lift"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-display font-semibold text-base text-slate-800 dark:text-slate-100">
                            {new Date(register.date).toLocaleDateString(
                              "en-US",
                              { month: "long", year: "numeric" },
                            )}
                          </h3>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Register · {register.month}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                          {register.total_members} members
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Amount / member
                          </p>
                          <p className="text-lg font-semibold mt-0.5 text-slate-800 dark:text-slate-100">
                            ${register.amount_per_member}
                          </p>
                        </div>
                        <div className="rounded-xl p-3 bg-slate-50 dark:bg-slate-800">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Collected
                          </p>
                          <p className="text-lg font-semibold mt-0.5 text-slate-800 dark:text-slate-100">
                            ${register.past_month_paid}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400 dark:text-slate-500">
                            Payment rate
                          </span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {register.past_month_paid_number}/
                            {register.total_members} · {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-amber-400 to-amber-600 transition-all duration-700"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs text-slate-400 dark:text-slate-600">
                          Created{" "}
                          {new Date(register.created_at).toLocaleDateString()}
                        </span>
                        <button className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium transition-colors">
                          View Details <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ DEATH SUPPORTS ════ */}
          {activeTab === "death-supports" && (
            <div className="rounded-2xl shadow-md rounded-md dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden mb-10">
              <div className="px-6 py-4  dark:border-slate-800 flex justify-between items-center">
                <h2 className="font-display font-semibold text-slate-800 dark:text-slate-100">
                  Death Supports
                </h2>
                <button className="btn-amber flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg shadow-amber-500/25">
                  <Plus className="h-3.5 w-3.5" />
                  New Death Support
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50">
                      {[
                        "Deceased",
                        "Family",
                        "Type",
                        "Amount",
                        "Status",
                        "Date",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {community.deathSupports.map((support, i) => (
                      <tr
                        key={support.id}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                          i < community.deathSupports.length - 1
                            ? "border-b border-slate-100 dark:border-slate-800"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
                              <Heart className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-slate-800 dark:text-slate-100">
                                {support.deceased_name}
                              </div>
                              <div className="text-xs text-slate-400 dark:text-slate-500">
                                {support.relationship}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {support.family_name}
                        </td>
                        <td className="px-6 py-4">
                          {support.death_type === "local" ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-500/20">
                              local
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20">
                              external
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                            ${support.amount_per_member}
                            <span className="text-xs font-normal ml-1 text-slate-400 dark:text-slate-500">
                              /member
                            </span>
                          </div>
                          {support.paid_amount && (
                            <div className="text-xs mt-0.5 text-slate-400 dark:text-slate-500">
                              Paid: ${support.paid_amount}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {support.paid_at ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20">
                              <CheckCircle className="h-3 w-3" />
                              Paid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20">
                              <Clock className="h-3 w-3" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                          {support.paid_at
                            ? new Date(support.paid_at).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 text-sm font-medium mr-3 transition-colors">
                            View
                          </button>
                          <button className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm font-medium transition-colors">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityView;
