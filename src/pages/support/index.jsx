import GenericTable from "../../components/GenericTable";
import StatusBadge from "../../components/ui/Status";

import { useNavigate } from "react-router-dom";
const DeathSupportIndex = () => {
  const navigate = useNavigate();
  const columns = [
    {
      key: "name",
      label: "Family Name",
      selector: (row) => row.name,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.name}
          </div>
        </div>
      ),
    },
    {
      key: "deceased_name",
      label: "Deceased Name",
      selector: (row) => row.deceased_name,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-gray-900 dark:text-white">
            {row.deceased_name}
          </div>
        </div>
      ),
    },
    {
      key: "completed_amount",
      label: "Completed Amount",
      selector: (row) => row.completed_amount,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-emerald-500 dark:text-green-600 font-bold">
            {row.completed_amount || 0}
          </div>
        </div>
      ),
    },
    {
      key: "paid_families",
      label: "Paid Families",
      selector: (row) => row.paid_families,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-emerald-500 dark:text-green-600 font-bold">
            {row.paid_families}
          </div>
        </div>
      ),
    },
    {
      key: "death_type",
      label: "Type",
      selector: (row) => row.death_type,
      filterable: true,
      isStatus: true,
      filterType: "select",
      options: [
        { value: "external", label: "External" },
        { value: "internal", label: "Internal" },
      ],
    },
    {
      key: "paid_at",
      label: "Paid At",
      selector: (row) => row.paid_at,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-emerald-500 dark:text-green-600 font-bold">
            {row.paid_at
              ? new Date(row.paid_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Not Paid"}
          </div>
        </div>
      ),
    }
  ];

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  const onView = (data) => {
    navigate(`/Admin/support/${data.uuid}`);
  };
  const onEdit = (data) => {
    navigate(`/Admin/support/${data.uuid}/edit`);
  };
  const onDelete = (data) => {
    navigate(`/Admin/support/${data.uuid}/delete`);
  };

  const handleExtra = () => {
    navigate("/Admin/support/create");
  };
  return (
    <div className="space-y-6">
      <GenericTable
        columns={columns}
        actions={actions}
        apiEndpoint={"supports"}
        title="Support Management"
        name="Support"
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        handleExtra={handleExtra}
        queryParams={{}}
      />
    </div>
  );
};

export default DeathSupportIndex;
