import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MapPin,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Users,
  Plus,
  Eye,
  X,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GenericTable from "../../components/GenericTable";
import useFetchData from "../../hooks/useFetchData";

const FamiliesTable = () => {
  const navigate = useNavigate();
  const onEdit = (family) => navigate(`/Admin/family/${family.uuid}/edit`);
  const onView = (family) => navigate(`/Admin/family/${family.uuid}`);
  const onAdd = () => navigate("/family/create");
  const onDelete = async (family) => {};

  const columns = [
    {
      key: "name",
      label: "Name",
      selector: (row) => row.name,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.name}
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      selector: (row) => row.phone,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-gray-900 dark:text-white">
            {row.phone}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      selector: (row) => row.status,
      filterable: true,
      isStatus: true,
      filterType: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const handleExtra = () => {
    navigate("/Admin/family/create");
  };
  return (
    <div className="space-y-6">
      <GenericTable
        columns={columns}
        apiEndpoint="families"
        title="Families List"
        onView={onView}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        name={"Family"}
        initialPerPage={10}
        initialSortField="created_at"
        initialSortDirection="desc"
        defaultTheme="dark"
        handleExtra={handleExtra}
        queryParams={
          {
            // Add any additional query params here
            // role: 'super_admin' // If you want to filter by default
          }
        }
      />
    </div>
  );
};

export default FamiliesTable;
