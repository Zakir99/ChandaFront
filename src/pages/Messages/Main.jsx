import { useEffect, useState } from "react";
import {
  Send,
  MapPin,
  Mic,
  X,
  ChevronDown,
  Users,
  User,
  Globe,
  Search,
  Check,
  Volume2,
  Camera,
  Map,
  MessageCircle,
  Bell,
  Home,
  Calendar,
  Book,
  BookOpen,
  Heart,
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
import MapPicker from "../../components/mapPicker";
import useFormSubmit from "../../hooks/useFormSubmit";

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
  const isDarkMode = document.documentElement.classList.contains("dark");

  const { submit } = useFormSubmit({
    url: "message/sendMessageCustom",
    onSuccess: (result) => {
      toast.success("Message sent successfully!");
      // Reset form
      // setFormData({
      //   type: "Other",
      //   sent_type: "everyone",
      //   sent_to: [],
      //   message: "",
      //   location: "",
      //   voice_message: null,
      //   image: null,
      // });
      // setSelectedMembers([]);
      // navigate("/message");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const data = new FormData();
      data.append("type", formData.type);
      data.append("sent_type", formData.sent_type);
      data.append("sent_to", formData.sent_to);
      data.append("message", formData.message);
      data.append("location", formData.location);
      data.append("voice_message", formData.voice_message);
      data.append("image", formData.image);

      submit(data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  const toggleMember = (member) => {
    if (formData.sent_type === "single") {
      setSelectedMembers([member]);
      setFormData((prev) => ({ ...prev, sent_to: [member.id] }));
    } else {
      setSelectedMembers((prev) => {
        const newSelection = prev.find((m) => m.id === member.id)
          ? prev.filter((m) => m.id !== member.id)
          : [...prev, member];

        setFormData((prev) => ({
          ...prev,
          sent_to: newSelection.map((m) => m.id),
        }));

        return newSelection;
      });
    }
  };

  const messageTypes = [
    { id: "fatiha", label: "Fatiha", icon: Book, color: "emerald" },
    { id: "quran Khani", label: "Quran Khani", icon: BookOpen, color: "amber" },
    { id: "wedding", label: "Wedding", icon: Heart, color: "rose" },
    { id: "meeting", label: "Meeting", icon: Users, color: "blue" },
    { id: "Other", label: "Other", icon: MessageCircle, color: "purple" },
  ];

  // const sendToOptions = [
  //   {
  //     value: "everyone",
  //     label: "Everyone",
  //     icon: Globe,
  //     description: "Send to all members",
  //     color: "blue",
  //   },
  //   {
  //     value: "single",
  //     label: "Single Member",
  //     icon: User,
  //     description: "Send to one person",
  //     color: "green",
  //   },
  //   {
  //     value: "custom",
  //     label: "Custom Selection",
  //     icon: Users,
  //     description: "Choose multiple recipients",
  //     color: "purple",
  //   },
  // ];

  // Theme classes
  const theme = {
    bg: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    card: isDarkMode
      ? "bg-gray-800/90 backdrop-blur-xl border-gray-700"
      : "bg-white/90 backdrop-blur-xl border-gray-200",
    text: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    input: isDarkMode
      ? "bg-gray-700/60 border-gray-600 text-white placeholder-gray-400"
      : "bg-gray-100/60 border-gray-300 text-gray-900 placeholder-gray-500",
    button: isDarkMode
      ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
      : "bg-gray-200 hover:bg-gray-300 border-gray-300 text-gray-700",
    border: isDarkMode ? "border-gray-700" : "border-gray-200",
  };

  return (
    <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-4xl sm:text-5xl font-bold ${theme.text} mb-4 tracking-tight`}
              >
                Send Message
              </h1>
              <p className={`text-lg ${theme.textSecondary} max-w-2xl`}>
                Compose and send messages to members and families in your
                community
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div
          className={`${theme.card}  rounded-3xl shadow-2xl overflow-hidden transition-all duration-300`}
        >
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            {/* Message Type */}
            <div className="space-y-4">
              <label
                className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
              >
                Message Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {messageTypes.map(({ id, label, icon: Icon, color }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, type: id }))
                    }
                    className={`
                      group relative flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 cursor-pointer
                      ${
                        formData.type === id
                          ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/30 scale-105 ring-2 ring-${color}-400/50`
                          : `${theme.button} hover:scale-102`
                      }
                    `}
                  >
                    <Icon
                      size={24}
                      className={
                        formData.type === id
                          ? "text-white"
                          : `text-${color}-500`
                      }
                    />
                    <span className="text-sm font-medium">{label}</span>
                    {formData.type === id && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Check
                          size={12}
                          className={`text-${color}-500`}
                          strokeWidth={3}
                        />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Send To Selection */}
            {/* <div className="space-y-4">
              <label
                className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
              >
                Send To
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sendToOptions.map(
                  ({ value, label, icon: Icon, description, color }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, sent_type: value }));
                        setSelectedMembers([]);
                      }}
                      className={`
                      group relative cursor-pointer flex items-start gap-4 p-5 rounded-xl text-left transition-all duration-300
                      ${
                        formData.sent_type === value
                          ? `bg-${color}-500 text-white shadow-lg shadow-${color}-500/30 ring-2 ring-${color}-400/50`
                          : `${theme.button} hover:shadow-lg`
                      }
                    `}
                    >
                      <div
                        className={`
                      p-2 rounded-lg transition-all duration-300
                      ${
                        formData.sent_type === value
                          ? "bg-white/20"
                          : `bg-${color}-500/10 group-hover:bg-${color}-500/20`
                      }
                    `}
                      >
                        <Icon
                          size={24}
                          className={
                            formData.sent_type === value
                              ? "text-white"
                              : `text-${color}-500`
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">{label}</div>
                        <div
                          className={`text-sm ${formData.sent_type === value ? "text-white/80" : theme.textSecondary}`}
                        >
                          {description}
                        </div>
                      </div>
                      {formData.sent_type === value && (
                        <div className="absolute top-2 right-2">
                          <Check
                            size={16}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </div>
                      )}
                    </button>
                  ),
                )}
              </div>
            </div> */}

            {/* Member Selection */}
            {(formData.sent_type === "single" ||
              formData.sent_type === "custom") && (
              <div className="space-y-4 animate-fadeIn">
                <label
                  className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
                >
                  {formData.sent_type === "single"
                    ? "Select Member"
                    : "Select Members/Families"}
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowMemberSelector(!showMemberSelector)}
                    className={`
                      w-full p-4 ${theme.input} border rounded-xl text-left
                      flex items-center justify-between transition-all duration-200
                      ${showMemberSelector ? "ring-2 ring-blue-500 border-transparent" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Users size={20} className={theme.textSecondary} />
                      <span className="font-medium">
                        {selectedMembers.length === 0
                          ? `Choose ${formData.sent_type === "single" ? "a member" : "members"}...`
                          : formData.sent_type === "single"
                            ? selectedMembers[0]?.family_name
                            : `${selectedMembers.length} member${selectedMembers.length > 1 ? "s" : ""} selected`}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${showMemberSelector ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showMemberSelector && (
                    <div
                      className={`
                      absolute z-50 w-full mt-2 ${theme.card} border rounded-xl shadow-2xl overflow-hidden
                      animate-slideDown
                    `}
                    >
                      {/* Search */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="relative">
                          <Search
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or phone..."
                            className={`w-full pl-10 pr-4 py-2.5 ${theme.input} border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                          />
                        </div>
                      </div>

                      {/* Members Grid */}
                      <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                        {filteredMembers.length === 0 ? (
                          <div className="text-center py-12">
                            <Users
                              size={48}
                              className="mx-auto text-gray-400 mb-3"
                            />
                            <p className={theme.textSecondary}>
                              No members found
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {filteredMembers.map((member) => {
                              const isSelected = selectedMembers.some(
                                (m) => m.id === member.id,
                              );
                              return (
                                <div
                                  key={member.id}
                                  onClick={() => toggleMember(member)}
                                  className={`
                                    p-3 rounded-lg cursor-pointer transition-all duration-200
                                    ${
                                      isSelected
                                        ? "bg-blue-500 text-white"
                                        : `${theme.button} hover:bg-gray-200 dark:hover:bg-gray-600`
                                    }
                                  `}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`
                                      w-10 h-10 rounded-full flex items-center justify-center
                                      ${
                                        isSelected
                                          ? "bg-white/20"
                                          : "bg-gray-300 dark:bg-gray-600"
                                      }
                                    `}
                                    >
                                      <Home
                                        size={18}
                                        className={
                                          isSelected
                                            ? "text-white"
                                            : theme.textSecondary
                                        }
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium truncate">
                                        {member.family_name}
                                      </p>
                                      <p
                                        className={`text-xs ${isSelected ? "text-white/80" : theme.textSecondary} truncate`}
                                      >
                                        {member.phone || "No phone"}
                                      </p>
                                    </div>
                                    {isSelected && (
                                      <Check
                                        size={16}
                                        className="text-white shrink-0"
                                        strokeWidth={3}
                                      />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected Members Tags */}
                {selectedMembers.length > 0 &&
                  formData.sent_type === "custom" && (
                    <div className="flex flex-wrap gap-2 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
                      {selectedMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          <span className="text-sm font-medium">
                            {member.family_name}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleMember(member)}
                            className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-4">
              <label
                className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
              >
                Message Content
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="5"
                className={`w-full p-4 ${theme.input} rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Type your message here..."
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <label
                className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
              >
                Location (Optional)
              </label>

              <div className="relative">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <MapPin
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 ${theme.input} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Add a location..."
                    />
                    {formData.location && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, location: "" }))
                        }
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    className={`
                      px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-2
                      ${
                        isMapOpen
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                          : `${theme.button} hover:shadow-lg`
                      }
                    `}
                  >
                    <Map size={20} />
                    <span className="hidden sm:inline">Map</span>
                  </button>
                </div>

                {/* Map Modal */}
                {isMapOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div
                      className={`${theme.card} rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden`}
                    >
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className={`font-semibold ${theme.text}`}>
                          Select Location
                        </h3>
                        <button
                          onClick={() => setIsMapOpen(false)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X size={20} className={theme.textSecondary} />
                        </button>
                      </div>
                      <div className="p-4">
                        <MapPicker
                          setLocation={(value) => {
                            setFormData((prev) => ({
                              ...prev,
                              location: value,
                            }));
                          }}
                        />
                      </div>
                      <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setIsMapOpen(false)}
                          className={`px-4 py-2 ${theme.button} rounded-lg transition-colors`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => setIsMapOpen(false)}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Media Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Voice Message */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
                >
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
                    className={`
                      flex items-center justify-center gap-3 p-6 ${theme.input} border-2 border-dashed rounded-xl
                      cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all duration-200 group
                    `}
                  >
                    <Mic
                      size={24}
                      className="text-gray-400 group-hover:text-blue-500 transition-colors"
                    />
                    <div>
                      <p
                        className={`font-medium ${theme.text} group-hover:text-blue-500 transition-colors`}
                      >
                        {formData.voice_message
                          ? "Change audio file"
                          : "Upload audio file"}
                      </p>
                      <p className={`text-xs ${theme.textSecondary} mt-1`}>
                        MP3, WAV up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image */}
              <div className="space-y-3">
                <label
                  className={`block text-sm font-semibold ${theme.textSecondary} uppercase tracking-wider`}
                >
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
                    className={`
                      flex items-center justify-center gap-3 p-6 ${theme.input} border-2 border-dashed rounded-xl
                      cursor-pointer hover:border-green-500 hover:bg-green-500/5 transition-all duration-200 group
                    `}
                  >
                    <Camera
                      size={24}
                      className="text-gray-400 group-hover:text-green-500 transition-colors"
                    />
                    <div>
                      <p
                        className={`font-medium ${theme.text} group-hover:text-green-500 transition-colors`}
                      >
                        {formData.image ? "Change image" : "Upload image"}
                      </p>
                      <p className={`text-xs ${theme.textSecondary} mt-1`}>
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* File Previews */}
            {(formData.voice_message || formData.image) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-gray-700/30 rounded-xl">
                {formData.voice_message && (
                  <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Volume2 size={20} className="text-blue-500" />
                      <span
                        className={`text-sm font-medium ${theme.text} truncate max-w-37.5`}
                      >
                        {formData.voice_message.name || "Audio file"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          voice_message: null,
                        }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                {formData.image && (
                  <div className="flex items-center justify-between p-3 bg-gray-200 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Camera size={20} className="text-green-500" />
                      <span
                        className={`text-sm font-medium ${theme.text} truncate max-w-37.5`}
                      >
                        {formData.image.name || "Image file"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, image: null }))
                      }
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full group relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg py-5 px-6 rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Send
                    size={22}
                    className="group-hover:rotate-12 transition-transform"
                  />
                  Send Message
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
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

        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .hover\:scale-102:hover {
          transform: scale(1.02);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.8);
        }

        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.9);
        }
      `}</style>
    </div>
  );
};

export default SendMessagePage;
