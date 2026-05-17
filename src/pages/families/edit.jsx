import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usefetchData from "../../hooks/useFetchData";
import ReusableEditForm from "../../components/forms/ReusableEdit";
import {toast} from "react-toastify";


const EditFamilyForm = () => {
  const [family, setFamily] = useState(null); // ← Change this from {} to null
  const navigate = useNavigate();
  const { id } = useParams();
  const onSuccessRedirect = '/Admin/family';
  const { data, loading, error } = usefetchData({
    url: `families/edit/${id}`,
    onSuccess: (data) => {
      setFamily(data);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const handleBack = () => {
    
    navigate("/Admin/family");
    alert("You have successfully updated the family");
  };

  const handleUpdateSuccess = () => {
    toast.success("Family updated successfully");
  };

  useEffect(() => {
    if (data) {
      setFamily(data);
    }
  }, [data]);

  const handleError = (error) => {
    console.error(error);
  };
  const inputs = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Enter name",
      required: true,
      value: family?.name,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter city",
      required: true,
      value: family?.city,
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Enter phone",
      required: true,
      value: family?.phone,
    },
    {
      name: "total_members",
      label: "Total Members",
      type: "number",
      placeholder: "Enter total members",
      value: family?.total_members,
    },
    {
      name: "login_phone",
      label: "Login Phone",
      type: "text",
      placeholder: "Enter login phone",
      required: true,
      value: family?.login_phone,
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter New Password",
      value: family?.password,
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
      value: family?.status,
    },
    {
      name: "notes",
      label: "Notes",
      type: "textarea",
      placeholder: "Enter notes",
      value: family?.notes,
    },
    {
      name: "location",
      label: "Location",
      type: "text",
      placeholder: "Enter location",
      value: family?.location,
    },
  ];

  return (
    <div className="min-h-screen  dark:bg-gray-950">
   

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <ReusableEditForm
            inputs={inputs}
            title={"Edit Family"}
            fetchEndpoint={"families/edit"}
            updateEndpoint={"families"}
            id={id}
            method="PUT"
            onUpdateSuccess={handleUpdateSuccess}
            onUpdateError={handleError}
            onFetchError={handleError}
            size="default"
            layout="vertical"
            onCancel={handleBack}
            onSuccessRedirect={onSuccessRedirect}
            // onSubmitSuccess={() => {
            //   navigate(`/Admin/family`);
            // }}
            
            submitButtonText="Update User"
            cancelButtonText="Cancel"
            showResetButton={true}
            resetButtonText="Revert Changes"
            initialValues={family}
          />
        </div>
      </div>
    </div>
  );
};
export default EditFamilyForm;
