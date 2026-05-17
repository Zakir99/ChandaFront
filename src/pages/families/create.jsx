import { useNavigate } from "react-router-dom";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
import ReusableForm from "../../components/forms/ReusableForm";

const createFamilyForm = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/Admin/family");
  };
  const formInputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      required: true,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter city",
      required: true,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Enter phone",
      required: true,
    },
    {
      name: "total_members",
      label: "Total Members",
      type: "number",
      placeholder: "Enter total members",
    },
    {
      name: "login_phone",
      label: "Login Phone",
      type: "text",
      placeholder: "Enter login phone",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter password",
      required: true,
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
      required: true,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter notes",
    },
  ];

  const validationRules = {
    name: {
      required: true,
    },

    city: {
      required: true,
    },

    phone: {
      required: true,
    },

    login_phone: {
      required: true,
      pattern: /^\+[0-9]{10,12}$/,
      customMessage: "Invalid phone number",
    },

    password: {
      required: true,
      minLength: 6,
      maxLength: 20,
    },

    total_members: {
      required: true,
    },

    notes: {
      required: false,
    },

    status: {
      required: true,
    },
  };
  const onSuccessRedirect = () => {
    navigate("/Admin/family");
  };
  const onSubmitSuccess = (data) => {
    toast.success("Family created successfully");
  };
  return (
    <ReusableForm
      onCancel={handleBack}
      inputs={formInputs}
      title={"Create Family"}
      apiEndpoint={"families"}
      size="lg"
      layout="horizontal"
      validationRules={validationRules}
      onSuccessRedirect={onSuccessRedirect}
      onSubmitSuccess={onSubmitSuccess}
    />
  );
};

export default createFamilyForm;
