// src/App.jsx (Enhanced with both Create and Edit examples)
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone } from "lucide-react";
import ReusableEditForm from "../../../components/forms/ReusableEdit";
import Button from "../../../components/ui/Button";
import useFetchData from "../../../hooks/useFetchData";
import Config from "../../../Js/Config";
import {toast} from "react-toastify";

const EditUserForm = () => {
  const [currentView, setCurrentView] = useState("edit");
  const selectedId = useParams().id;

  const url = Config.apiUrl;
  const navigate = useNavigate();
  const {
    data: fetchedData,
    loading: fetchingLoading,
    error: fetchingError,
  } = useFetchData({
    url: `/communities/${selectedId}`,
    onError: console.error,
  });

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone: {
      pattern: /^\+?[1-9]\d{1,14}$/,
      message: "Please enter a valid phone number",
    },
  };

  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Oruzgan",
      icon: User,
      required: true,
      defaultValue: fetchedData?.name,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "+1 (555) 000-0000",
      icon: Phone,
      helperText: "Include country code",
      defaultValue: fetchedData?.phone,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Oruzgan",
      icon: User,
      required: true,
      defaultValue: fetchedData?.city,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Karachi",
      icon: User,
      required: true,
    },
    {
      name: "is_active",
      label: "Active Account",
      type: "checkbox",
      defaultValue: fetchedData?.is_active,
    },
  ];

  const handleCreateSuccess = (data) => {
    toast.success("Community created successfully");
    setCurrentView("list");
  };

  const handleUpdateSuccess = (data) => {
    toast.success("Community updated successfully");
    setCurrentView("list");
  };

  const handleError = (error) => {
    toast.error("Operation failed");
  };

  const handleCancel = () => {
    navigate("/SuperAdmin/communities");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              User Management
            </h1>
            <div className="flex space-x-4">
              <Button
                variant={currentView === "create" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentView("create")}
              >
                Create User
              </Button>
              <Button
                variant={currentView === "edit" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentView("edit")}
              >
                Edit User
              </Button>
              <Button
                variant={currentView === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setCurrentView("list")}
              >
                User List
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <ReusableEditForm
            fetchEndpoint={url + "communities"}
            updateEndpoint={url + "communities"}
            id={selectedId}
            method="PUT"
            onUpdateSuccess={handleUpdateSuccess}
            onUpdateError={handleError}
            onFetchError={handleError}
            title="Edit User"
            description="Update the user information below."
            inputs={formInputs.map((input) => ({
              ...input,
              // Mark some fields as read-only for edit
              ...(input.name === "email" ? { readOnly: true } : {}),
              // Add original value for comparison
              originalValue: fetchedData?.[input.name],
            }))}
            validationRules={validationRules}
            layout="vertical"
            submitButtonText="Update User"
            cancelButtonText="Cancel"
            onCancel={handleCancel}
            showResetButton={true}
            resetButtonText="Revert Changes"
            onSuccessRedirect="/SuperAdmin/communities"
            size="default"
            theme="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
