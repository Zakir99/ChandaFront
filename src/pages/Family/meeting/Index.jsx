import GenericTable from "../../../components/GenericTable";
import { ShieldCheck, ShieldX, Shield, UserCheck, UserX } from "lucide-react";
import { formatCurrency, formatDate, capitalizeFirst } from "../../../Js/Small";
const Index = () => {

  const columns = [
    {
      name: "month",
      label: "Month",
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {capitalizeFirst(row.month)}
            </div>
        </div>
      ),
    },
    {
      name: "year",
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
      name: "paid_at",
      label: "Status",
      sortable: true,
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className=" ">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {row.paid_at ? (
                <div className="flex items-center gap-1">
                  <ShieldCheck
                    size={14}
                    className="text-green-600 dark:text-green-400"
                  />
                  Paid
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <ShieldX
                    size={14}
                    className="text-red-600 dark:text-red-400"
                  />
                  Unpaid
                </div>
              )}
            </div>
        </div>
      ),
    },
    {
      name: "amount",
      label: "Amount",
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(row.amount)}
            </div>
        </div>
      ),
    },
    {
      name: "date",
      label: "Date",
      filterable: true,
      filterType: "text",
      render: (value, row) => (
        <div className="flex items-center">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {formatDate(row.date)}
            </div>
        </div>
      ),
    },
  ];

  const actions = {
    view: true,
  };

  return (
    <div className=" dark:bg-gray-950 transition-colors duration-200">
      <GenericTable
        columns={columns}
        apiEndpoint={"meeting"}
        title={"Meetings"}
        description={"List of meetings"}
        queryParams={{}}
        actions={actions}
        showExtraButton={false}
      />
    </div>
  );
};

export default Index;
