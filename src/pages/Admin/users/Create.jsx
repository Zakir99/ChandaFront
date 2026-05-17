// src/App.jsx
import { User, Mail, Lock, Phone } from "lucide-react";
import ReusableForm from "../../../components/forms/ReusableForm";
import { useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import useFetchData from "../../../hooks/useFetchData";

const UserForm = () => {
  const [communities, setCommunities] = useState([]);
  const isDarkMode = useSelector((state) => state.auth?.theme);
  const theme = isDarkMode ? "dark" : "light";
  const hasFile = false;
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
    password: {
      required: true,
      minLength: 8,
      custom: (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
      customMessage:
        "Password must contain at least one uppercase letter and one number",
    },
    
  };

  const { data, isloading, error } = useFetchData({
    url: "communities/all",
    onSuccess: (data) => {
      setCommunities(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  useEffect(() => {
    if (data) {
      setCommunities(data);
    }
  }, [data]);

  const fields = useMemo(() => {
    // Prepare dropdown options for communities
    const communityOptions = communities.map((community) => ({
      value: community.uuid,
      label: community.name,
    }));


    return [
      {
        name: "name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter full name",
        icon: User,
        validation: validationRules.name,
        colSpan: "full",
      },
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter email",
        icon: Mail,
        validation: validationRules.email,
        colSpan: "full",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter password",
        icon: Lock,
        validation: validationRules.password,
        colSpan: "full",
      },
      {
        name: "role",
        label: "Role",
        type: "select",
        placeholder: "Select a role",
        options: [
          { 'value': 'community_admin', 'label': 'Community Admin' },
          { 'value': 'community_manager', 'label': 'Community Manager' }
        ],
      },
      {
        name: "phone",
        label: "Phone Number",
        type: "text",
        placeholder: "Enter phone number",
        icon: Phone,
        colSpan: "full",
      },
      {
        'name': 'status',
        'label': 'Status',
        'type': 'select',
        'placeholder': 'Select a status',
        'options': [
          { 'value': 'active', 'label': 'Active' },
          { 'value': 'inactive', 'label': 'Inactive' }
        ],
      }
    ];
  }, [communities, isloading]);

  const handleSubmitSuccess = (data) => {
    console.log("Form submitted successfully:", data);
    // Handle success (e.g., show toast, redirect)
  };

  const handleSubmitError = (error) => {
    console.error("Form submission error:", error);
    // Handle error
  };

  const handleCancel = () => {
    console.log("Form cancelled");
    // Handle cancel (e.g., navigate back)
  };

  return (
    <div className="min-h-screen  dark:bg-gray-950 p-8">
      <div className="container mx-auto">
        <ReusableForm
          apiEndpoint={'users'}
          method="POST"
          onSubmitSuccess={handleSubmitSuccess}
          onSubmitError={handleSubmitError}
          title="Create New User"
          description="Fill in the information below to create a new user account."
          inputs={fields}
          validationRules={validationRules}
          layout="horizontal"
          submitButtonText="Create User"
          cancelButtonText="Cancel"
          onCancel={handleCancel}
          onSuccessRedirect="/Admin/users"
          size="lg"
          theme={theme}
          cardVariant="glass"
          hasFile={hasFile}
        />
      </div>
    </div>
  );
};

export default UserForm;
