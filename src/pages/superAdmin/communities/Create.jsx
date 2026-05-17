import ReuseableForm from "../../../components/forms/ReusableForm";
import { useNavigate } from "react-router-dom";
import Config from "../../../Js/Config";
import toast from "react-hot-toast";

const CreateCommunity = () => {
  const navigate = useNavigate();
  const handleSubmit = (data) => {
    
  };
  const url = Config.apiUrl;
  const completeUrl = "communities";

  const inputs = [
    {
      name: "name",
      label: "Name",  
      type: "text",
      placeholder: "Enter name",
      required: true,
    },
    {
      type: "image",
      name: "image",
      label: "Community Image",
    //   value: user.avatar,
      options: {
        acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSize: 10 * 1024 * 1024, // 10MB
        aspectRatio: "square",
        returnBase64: false,
        editable: true,
        helperText: "Upload a professional photo (JPG, PNG, or WebP, max 10MB)",
      },
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
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address",
      required: true,
    },
    {
      name: "is_active",
      label: "Is Active",
      type: "checkbox",
      placeholder: "Enter address",
      required: true,
    },
  ];

  const handleSubmitSuccess = (data) => {
    toast.success("Form submitted successfully:", data);
  };

  const handleSubmitError = (error) => {
    toast.error("Form submission error:", error);
  };

  const handleCancel = () => {
    navigate("/SuperAdmin/communities");
  };

  return (
    <div>
      <ReuseableForm
        inputs={inputs}
        apiEndpoint={completeUrl}
        handleSubmit={handleSubmit}
        onSubmitSuccess={handleSubmitSuccess}
        onSubmitError={handleSubmitError}
        title="Create Community"
        description={"Fill in the information below to create a new community."}
        action="create"
        size="lg"
        layout="horizontal"
        cardVariant="glass"
        theme="dark"
        onCancel={handleCancel}
        onSuccessRedirect={"/SuperAdmin/communities"}
        className="community-form"
      />
    </div>
  );
};

export default CreateCommunity;
