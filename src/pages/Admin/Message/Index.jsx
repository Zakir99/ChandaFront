import { useState, useEffect, useRef } from "react";
import {
  MoreVertical,
  ChevronLeft,
  X,
  Shield,
  MessageSquare,
  Plus,
} from "lucide-react";
import MessagePage from "../../../components/body/Message";
import Modal from "../../../components/model/create";
import ReusableForm from "../../../components/forms/ReusableForm";

const MessageNotificationPage = () => {
  const [expandedImage, setExpandedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("messages");
  const [showAdminMessageModal, setShowAdminMessageModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const loading = false;
  const bottomRef = useRef();
  const fetchingRef = useRef(false);

  useEffect(() => {
    if (!loading) {
      fetchingRef.current = false;
    }
  }, [loading]);

  const onError = (errors) => {
    console.error("Error sending admin message:", errors);
  };

  const createInputs = [
    {
      type: "text",
      name: "message",
      label: "Message",
      placeholder: "Type your admin message here...",
    },
    {
      name: "voice",
      label: "Voice",
      type: "audio",
      maxDuration: 120,
      placeholder: "Type your voice here...",
    },
    {
      name: "event_type",
      label: "Event Type",
      type: "select",
      options: [
        { label: "Fatiha", value: "fatiha" },
        { label: "Quran Khani", value: "quran_khani" },
        { label: "Wedding", value: "wedding" },
        { label: "Meeting", value: "meeting" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "location",
      label: "Location",
      type: "location",
      // showCurrentLocation: true,
      placeholder: "Type your location here...",
    },
    {
      name: "delivery_type",
      label: "Delivery Type",
      type: "select",
      options: [
        { label: "SMS", value: "sms" },
        { label: "Email", value: "email" },
        { label: "Push", value: "push" },
        { label: "Whatsapp", value: "whatsapp" },
        { label: "Chanda", value: "chanda" },
      ],
    },
    {
      name: "files",
      label: "Files",
      type: "file",
      multiple: true,
      maxSize: 1024 * 1024 * 5,
      accept: "image/*, video/*, audio/*, video/mp4, audio/mpeg",
      allowedExtensions: [
        ".jpg",
        ".png",
        ".gif",
        ".mp4",
        ".mp3",
        ".zip",
        ".rar",
        ".pdf",
        ".doc",
        ".docx",
        ".ogg",
      ],
      onError,
    },
  ];

  const handleSubmitSuccess = () => setShowAdminMessageModal(false);
  const handleCancel = () => setShowAdminMessageModal(false);
  const onSuccessRedirect = () => setShowAdminMessageModal(false);
  const onSubmitError = (error) =>
    console.error("Error sending admin message:", error);

  const initialValues = {};
  const validationRules = {};
  const layout = "vertical";
  const submitButtonText = "Send Message";
  const cancelButtonText = "Cancel";
  const hasFile = true;
  return (
    <div className="h-full flex flex-col dark:bg-gray-950 transition-colors duration-300">
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-20">
        {/* Glass bar */}
        <div className="bg-white/80 dark:bg-gray-950 backdrop-blur-xl ">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
            {/* Left: back + title */}
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-150">
                <ChevronLeft
                  size={18}
                  className="text-gray-700 dark:text-gray-300"
                />
              </button>
              <div>
                <h1 className="text-[15px] font-semibold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Messages
                </h1>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                  & Notifications
                </p>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowModal(true)}
                title="New message"
                className="
                  group flex items-center gap-1.5 px-3 py-2 rounded-xl
                  bg-blue-600 hover:bg-blue-700
                  dark:bg-blue-500 dark:hover:bg-blue-600
                  text-white text-[13px] font-medium
                  shadow-sm shadow-blue-600/25
                  transition-all duration-150 active:scale-95
                "
              >
                <Plus
                  size={15}
                  className="transition-transform duration-150 group-hover:rotate-90"
                />
                <span className="hidden sm:inline">New</span>
              </button>

              <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150">
                <MoreVertical
                  size={17}
                  className="text-gray-500 dark:text-gray-400"
                />
              </button>
            </div>
          </div>

          {/* ── Tab bar ── */}
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex gap-1 pb-0">
              {[
                {
                  id: "messages",
                  icon: MessageSquare,
                  label: "Messages",
                  accent: "blue",
                },
                {
                  id: "admins",
                  icon: Shield,
                  label: "Admin Messages",
                  accent: "purple",
                },
              ].map(({ id, icon: Icon, label, accent }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`
                      relative flex items-center gap-2 px-4 py-3 text-[13px] font-medium
                      transition-colors duration-150 cursor-pointer
                      ${
                        isActive
                          ? accent === "blue"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-purple-600 dark:text-purple-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                      }
                    `}
                  >
                    <Icon size={14} />
                    {label}
                    {/* Active indicator pill */}
                    {isActive && (
                      <span
                        className={`
                          absolute bottom-0 left-3 right-3 h-0.5 rounded-full
                          ${
                            accent === "blue"
                              ? "bg-blue-600 dark:bg-blue-400"
                              : "bg-purple-600 dark:bg-purple-400"
                          }
                        `}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="px-4 py-5 flex-1 flex flex-col min-h-0">

        <div className="overflow-hidden bg-white dark:bg-gray-900 flex-1 flex flex-col min-h-0">
          {activeTab === "messages" && (
            <MessagePage url="message/getMessages" showHeader={false} />
          )}
          {activeTab === "admins" && (
            <MessagePage url="message/getMessages" showHeader={false} />
          )}
        </div>

        <div ref={bottomRef} />
      </main>

      {/* ── New Message Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Send Admin Message"
        closeOnOverlayClick={false}
      >
        <ReusableForm
          apiEndpoint="message/sendMessageCustom"
          method="POST"
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={onSubmitError}
          inputs={createInputs}
          initialValues={initialValues}
          validationRules={validationRules}
          layout={layout}
          submitButtonText={submitButtonText}
          cancelButtonText={cancelButtonText}
          showCancelButton={false}
          onCancel={handleCancel}
          onSuccessRedirect={onSuccessRedirect}
          hasFile={hasFile}
        />
      </Modal>

      {/* ── Image lightbox ── */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-30 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setExpandedImage(null)}
        >
          <button
            onClick={() => setExpandedImage(null)}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <img
            src={expandedImage.url}
            alt={expandedImage.caption}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {expandedImage.caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 backdrop-blur-sm px-5 py-2 rounded-full whitespace-nowrap">
              {expandedImage.caption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageNotificationPage;
