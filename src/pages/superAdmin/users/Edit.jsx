// src/App.jsx (Enhanced with both Create and Edit examples)
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import ReusableEditForm from "../../../components/forms/ReusableEdit";
import Button from "../../../components/ui/Button";
import useFetchData from "../../../hooks/useFetchData";
import Config from "../../../Js/Config";
import {toast} from "react-toastify";
const EditUserForm = () => {
  const [currentView, setCurrentView] = useState("edit"); // 'create', 'edit', 'list'
  const selectedId = useParams().id;

  const navigate = useNavigate();
  const {
    data: fetchedData,
    loading: fetchingLoading,
    error: fetchingError,
  } = useFetchData({
    url: `users/${selectedId}`,
    onError: console.error,
  });

  const validationRules = {
    fullName: {
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
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      icon: User,
      required: true,
      defaultValue: fetchedData?.name,
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "john@example.com",
      icon: Mail,
      required: true,
      defaultValue: fetchedData?.email,
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
      name: "role",
      label: "Role",
      type: "select",
      placeholder: "Select a role",
      options: [
        { 'value': 'super_admin', 'label': 'Super Admin' },
        { 'value': 'community_admin', 'label': 'Community Admin' },
        { 'value': 'community_manager', 'label': 'Community Manager' }
      ],
    },
    {
      name: "is_active",
      label: "Active Account",
      type: "checkbox",
      defaultValue: fetchedData?.is_active,
    },
  ];

  const handleCreateSuccess = (data) => {
    toast.success("User created successfully:", data);
  };

  const handleUpdateSuccess = (data) => {
    toast.success("User updated successfully:", data);
  };

  const handleError = (error) => {
    toast.error("Operation failed:", error);
  };

  const handleCancel = () => {
    navigate("/SuperAdmin/users");
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
            fetchEndpoint={"users"}
            updateEndpoint={"users"}
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
            onSuccessRedirect="/SuperAdmin/users"
            size="default"
            theme="auto"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
