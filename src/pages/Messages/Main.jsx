import React, { useState, useEffect } from "react";
import {
  Send,
  MapPin,
  Mic,
  Image,
  X,
  ChevronDown,
  Users,
  User,
  Globe,
  Search,
  Check,
} from "lucide-react";
import axios from "axios";
import Config from "../../Js/Config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapPicker from "../../components/mapPicker";

const SendMessagePage = () => {
  const [formData, setFormData] = useState({
    type: "Other",
    sent_type: "everyone",
    sent_to: [],
    message: "",
    location: "",
    voice_message: null,
    image: null,
  });
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [showMemberSelector, setShowMemberSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${Config.apiUrl}families`);
        setMembers(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [type]: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("image", formData.image);
      data.append("voice_message", formData.voice_message);
      data.append("location", formData.location);
      formData?.sent_to?.forEach((id) => {
        data.append("sent_to[]", id);
      });
      data.append("message", formData.message);
      data.append("type", formData.type);

      // Log FormData contents (for debugging)
      // for (let pair of data.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      const response = await axios.post(
        `${Config.apiUrl}message/sendMessageCustom`,
        data,
      );
      if (response.status === 200) {
        toast.success("Message sent successfully!");
        // navigate("/message");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMember = (member) => {
    if (formData.sent_to === "single") {
      setSelectedMembers([member]);
    } else {
      setSelectedMembers((prev) =>
        prev.find((m) => m.id === member.id)
          ? prev.filter((m) => m.id !== member.id)
          : [...prev, member],
      );
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.family_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const messageTypes = ["Fatiha", "Quran Khani", "Wedding","Meeting", "Other"];
  const sendToOptions = [
    {
      value: "everyone",
      label: "Everyone",
      icon: Globe,
      description: "Send to all members",
    },
    {
      value: "single",
      label: "Single Member",
      icon: User,
      description: "Send to one person",
    },
    {
      value: "custom",
      label: "Custom Selection",
      icon: Users,
      description: "Choose multiple recipients",
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Send Message
          </h1>
          <p className="text-slate-400 text-lg">
            Compose and send messages to members and families
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-8"
            encType="multipart/form-data"
          >
            {/* Message Type */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Message Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {messageTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type }))}
                    className={`
                      px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300
                      ${
                        formData.type === type
                          ? "bg-linear-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/40 scale-[1.02] ring-2 ring-blue-400/50"
                          : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50"
                      }
                    `}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Send To */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Send To
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sendToOptions.map(
                  ({ value, label, icon: Icon, description }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, sent_type: value }));
                        setSelectedMembers([]);
                      }}
                      className={`
                      group relative flex flex-col items-start gap-2 px-5 py-4 rounded-xl text-left transition-all duration-300
                      ${
                        formData.sent_to === value
                          ? "bg-linear-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/40 ring-2 ring-purple-400/50"
                          : "bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600"
                      }
                    `}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          size={20}
                          className={
                            formData.sent_to === value
                              ? "text-white"
                              : "text-slate-400 group-hover:text-slate-300"
                          }
                        />
                        <span className="font-semibold">{label}</span>
                      </div>
                      <span
                        className={`text-xs ${formData.sent_to === value ? "text-purple-100" : "text-slate-500 group-hover:text-slate-400"}`}
                      >
                        {description}
                      </span>
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Member Selection for Single or Custom */}
            {(formData.sent_type === "single" ||
              formData.sent_type === "custom") && (
              <div className="space-y-3 animate-fadeIn">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                  {formData.sent_type === "single"
                    ? "Select Member"
                    : "Select Members/Families"}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMemberSelector(!showMemberSelector)}
                    className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-left text-slate-300 flex items-center justify-between hover:bg-slate-800 hover:border-slate-600 transition-all duration-200"
                  >
                    <span className="font-medium">
                      {selectedMembers.length === 0
                        ? `Select ${formData.sent_type === "single" ? "a member" : "members or families"}...`
                        : formData.sent_type === "single"
                          ? selectedMembers[0].name
                          : `${selectedMembers.length} member${selectedMembers.length > 1 ? "s" : ""} selected`}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${showMemberSelector ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showMemberSelector && (
                    <div className="absolute z-20 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-slideDown">
                      {/* Search Bar */}
                      <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                        <div className="relative">
                          <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500"
                          />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search members..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Members List */}
                      <div className="max-h-72 overflow-y-auto custom-scrollbar grid grid-cols-3">
                        {filteredMembers.length === 0 ? (
                          <div className="px-4 py-8 text-center text-slate-500">
                            No members found
                          </div>
                        ) : (
                          filteredMembers.map((member) => {
                            const isSelected = selectedMembers.find(
                              (m) => m.id === member.id,
                            );
                            return (
                              <div
                                key={member.id}
                                onClick={() => {
                                  toggleMember(member);
                                  formData.sent_to.push(member.id);
                                }}
                                className={`flex items-center justify-between px-4 py-3.5 cursor-pointer transition-all duration-200 border border-gray-100 last:border-b-0  ${
                                  isSelected
                                    ? "bg-blue-600/20 hover:bg-blue-600/30"
                                    : "hover:bg-slate-700/50"
                                }`}
                              >
                                <div className="flex-1">
                                  <p className="text-white font-semibold max-w-32">
                                    {member.family_name}
                                  </p>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    {member.phone}
                                  </p>
                                </div>
                                {isSelected && (
                                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                                    <Check
                                      size={14}
                                      className="text-white"
                                      strokeWidth={3}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Members Tags */}
                {selectedMembers.length > 0 &&
                  formData.sent_to === "custom" && (
                    <div className="flex flex-wrap gap-2 mt-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg backdrop-blur-sm"
                        >
                          <span className="text-sm text-blue-300 font-medium">
                            {member.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleMember(member)}
                            className="text-blue-300 hover:text-white transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Message Content
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="Type your message here..."
                required
              />
            </div>

           
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider items-center gap-2">
                Location (Optional)
              </label>

              <div className="relative">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-slate-800/60 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                      placeholder="Add a location..."
                    />
                    {formData.location && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, location: "" }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    className={`px-4 py-4 bg-slate-700 hover:bg-slate-600 border ${isMapOpen ? "border-blue-500 ring-2 ring-blue-500/50" : "border-slate-600"} rounded-xl transition-all duration-200 flex items-center justify-center group`}
                    title="Open map picker"
                  >
                    <svg
                      className={`w-5 h-5 ${isMapOpen ? "text-blue-400" : "text-slate-300 group-hover:text-white"} transition-colors`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Map Dropdown/Modal */}
                {isMapOpen && (
                  <>
                    {/* Backdrop for mobile */}
                    <div
                      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                      onClick={() => setIsMapOpen(false)}
                    />

                    {/* Map Container */}
                    <div className="absolute left-0 right-0 mt-2 z-50 md:z-10 map-dropdown">
                      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-800/90">
                          <span className="text-sm font-medium text-slate-300">
                            Pick a location
                          </span>
                          <button
                            onClick={() => setIsMapOpen(false)}
                            className="text-slate-400 hover:text-slate-300 transition-colors"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Map Picker */}
                        <div className="p-4">
                          <MapPicker
                            setLocation={(value) => {
                              setFormData((prev) => ({
                                ...prev,
                                location: value,
                              }));
                              // Optional: Auto-close map after selection
                              // setIsMapOpen(false);
                            }}
                          />
                        </div>

                        {/* Footer with actions */}
                        <div className="flex justify-end gap-2 p-3 border-t border-slate-700 bg-slate-800/90">
                          <button
                            onClick={() => setIsMapOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setIsMapOpen(false)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white rounded-lg transition-colors"
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Voice Message */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider items-center gap-2">
                  Voice Message
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleFileUpload(e, "voice_message")}
                    className="hidden"
                    id="voice-upload"
                  />
                  <label
                    htmlFor="voice-upload"
                    className="flex items-center justify-center gap-3 px-5 py-4 bg-slate-800/60 border-2 border-slate-700 border-dashed rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all duration-200 group"
                  >
                    <Mic
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-medium">
                      {formData.voice_message ? "Change audio" : "Upload audio"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-300 uppercase tracking-wider items-center gap-2">
                  Image
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "image")}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex items-center justify-center gap-3 px-5 py-4 bg-slate-800/60 border-2 border-slate-700 border-dashed rounded-xl text-slate-300 hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all duration-200 group"
                  >
                    <Image
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="font-medium">
                      {formData.image ? "Change image" : "Upload image"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Preview Uploads */}
            {(formData.voice_message || formData.image) && (
              <div className="flex gap-3 p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                {formData.voice_message && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                    <Mic size={18} className="text-blue-400" />
                    <span className="text-sm text-slate-300 font-medium">
                      Audio file attached
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          voice_message: null,
                        }))
                      }
                      className="text-slate-400 hover:text-red-400 transition-colors ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {formData.image && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
                    <Image size={18} className="text-green-400" />
                    <span className="text-sm text-slate-300 font-medium">
                      Image file attached
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: null }))
                      }
                      className="text-slate-400 hover:text-red-400 transition-colors ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-linear-to-r from-blue-600 via-purple-600 to-blue-600 bg-size-200 hover:bg-pos-100 text-white font-bold text-lg rounded-xl transition-all duration-500 shadow-2xl shadow-blue-600/30 hover:shadow-purple-600/40 transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Send size={22} />
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .bg-size-200 {
          background-size: 200%;
        }

        .bg-pos-100 {
          background-position: 100%;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.8);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.9);
        }
      `}</style>
    </div>
  );
};

export default SendMessagePage;
