import GenericTable from "../../../components/GenericTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDelete from "../../../hooks/useDeleteData";
import Swal from "sweetalert2";

const CommunityTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const columns = [
    {
      key: "name",
      label: "Name",
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
      key: "city",
      label: "City",
      selector: (row) => row.city,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm text-gray-900 dark:text-white">
            {row.city}
          </div>
        </div>
      ),
    },
  ];

  const { remove, loading } = useDelete({
    url: "communities",
    onSuccess: () => {
      toast.success("Community deleted");
    },
  });

  const handleView = async (community) => {
    navigate(`/SuperAdmin/communities/${community.uuid}`);
  };
  const handleEdit = (community) => {};
  const handleDelete = async (community) => {
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
    await remove(community.uuid);
  };

  const handleExtra = async (community) => {
    navigate("/superAdmin/communities/create");
  };

  const actions = {
    view: true,
    edit: true,
    delete: true,
  };

  return (
    <div className="community-table">
      <GenericTable
        columns={columns}
        apiEndpoint="communities"
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        handleExtra={handleExtra}
        name={"Community"}
        initialPerPage={10}
        initialSortField="created_at"
        initialSortDirection="desc"
        defaultTheme="dark"
        actions={actions}
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

export default CommunityTable;
