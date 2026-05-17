import DataTable from "../../../components/GenericTable";
import { Phone, UserCheck, UserX, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDelete from "../../../hooks/useDeleteData";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const UsersTable = () => {
  // Column definitions
  const columns = [
    {
      key: "name",
      label: "User",
      sortable: true,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10">
            {row.image ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={row.image}
                alt={row.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                {row.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {row.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      filterable: true,
      filterType: "select",
      options: [
        { value: "community_admin", label: "Community Admin" },
        { value: "community_manager", label: "Community Manager" },
      ],
      render: (value) => {
        const colors = {
          community_admin:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          community_manager:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        };
        return (
          <span
            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[value] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"}`}
          >
            {value?.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        );
      },
    },
    {
      key: "contact",
      label: "Contact",
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <div>
          {row.phone ? (
            <div className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
              <Phone size={14} className="text-gray-400" />
              {row.phone}
            </div>
          ) : (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              No phone
            </span>
          )}
        </div>
      ),
    },
    {
      key: "is_active",
      label: "Status",
      sortable: true,
      filterable: true,
      filterType: "select",
      options: [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
      ],
      render: (value) =>
        value ? (
          <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
            <UserCheck size={16} />
            Active
          </span>
        ) : (
          <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
            <UserX size={16} />
            Inactive
          </span>
        ),
    },
  ];
  const navigate = useNavigate();

  const handleEdit = (user) => {
    navigate(`/Admin/user/${user.id}/edit`);
  };
  const { remove } = useDelete({
    url: "users",
    onSuccess: () => {
      toast.success("User deleted");
    },
  });
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await remove(user.id);
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const goToCreate = () => {
    navigate("/Admin/user/create");
  };

  const actions = {
    view: true,
    edit: true,
    delete: true,
    custom: [
      {
        name: "change_role",
        label: "Change Role",
        icon: <Shield size={16} />,
        className: "text-gray-700 dark:text-gray-200",
      },
    ],
  };

  return (
    <DataTable
      apiEndpoint="users" 
      apiHeaders={{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }}
      name="Users"
      title="User Management"
      columns={columns}
      handleExtra={goToCreate}
      actions={actions}
      onEdit={handleEdit}
      onDelete={handleDelete}
      initialPerPage={10}
      initialSortField="created_at"
      initialSortDirection="desc"
      defaultTheme="dark"
      queryParams={
        {
          // Add any additional query params here
          // role: 'super_admin' // If you want to filter by default
        }
      }
    />
  );
};

export default UsersTable;
