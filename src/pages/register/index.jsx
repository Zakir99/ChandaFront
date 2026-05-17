import { useState, useEffect } from "react";
import { Plus, Search, Calendar, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../Js/Config";
import { toast } from "react-toastify";
import GenericTable from "../../components/GenericTable";
const MonthlyRegisters = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [editingRegister, setEditingRegister] = useState(null);
    const resetForm = () => {
    setFormData({
      month: "",
      year: "",
      date: "",
      amount_per_family: "",
      created_by: "",
    });
    setEditingRegister(null);
  };

  const goToCreate = () => {
    // resetForm();
    navigate("/Admin/register/create");
  };

  const goToSendMessage = async () => {
    try {
      const response = await axios.post(
        `${Config.apiUrl}message/sendRegisterMessage`,
      );

      if (response.status === 200) {
        toast.success("Message sent successfully!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      key: "year",
      label: "Year",
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.year}
          </div>
        </div>
      ),
    },
    {
      key: "total_members",
      label: "Total Members",
      selector: (row) => row.total_members,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-gray-900 dark:text-white">
            {row.total_members}
          </div>
        </div>
      ),
    }, 
    {
      key: "collected_amount",
      label: "Collected Amount",
      selector: (row) => row.collected_amount,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-emerald-500 dark:text-green-600 font-bold">
            {row.collected_amount}
          </div>
        </div>
      ),
    },
    {
      key: "expected_amount",
      label: "Expected Amount",
      selector: (row) => row.expected_amount,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-indigo-500 dark:text-blue-600 font-bold">
            {row.expected_amount}
          </div>
        </div>
      ),
    }, 
    {
      key: "remaining_amount",
      label: "Remaining Amount",
      selector: (row) => row.remaining_amount,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-red-600 dark:text-red-500 font-bold items-center">
            {row.remaining_amount}
          </div>
        </div>
      ),
    }
  ]

  const onView = (register) => {
    navigate(`/Admin/register/yearly/${register.year}`);
  };

  // const onEdit = (register) => {
  //   navigate(`/register/${register}/edit`);
  // };

  const actions = {
    view: true,
    // edit: true, 
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Yearly Registers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and track your yearly contribution registers
          </p>
        </div>
        <div className="space-x-4">
          <button
            onClick={goToCreate}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Register
          </button>
          <button
            onClick={goToSendMessage}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Send Message
          </button>
        </div>
      </div>

      <GenericTable
        title="Monthly Registers"
        apiEndpoint={"registers"}
        columns={columns}
        onView={onView}
        actions={actions}
        showExtraButton={false}
        queryParams={{}}
      />

      {/* Pagination */}
    </div>
  );
};

export default MonthlyRegisters;
