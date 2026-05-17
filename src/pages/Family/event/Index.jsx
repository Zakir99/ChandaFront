import GenericTable from "../../../components/GenericTable";
import StatusBadge from "../../../components/ui/Status";
import { formatCurrency, formatDate, capitalizeFirst } from "../../../Js/Small";


const Index = () => {
  const columns = [
    {
      name: "deceased_name",
      label: "Deceased Name",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {capitalizeFirst(row.deceased_name)}
          </div>
        </div>
      ),
    },
    {
      name: "amount",
      label: "Amount",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatCurrency(row.amount)}
          </div>
        </div>
      ),
    },
    {
      name: "created_at",
      label: "Date",
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {formatDate(row.created_at)}
          </div>
        </div>
      ),
    },
    {
      name: "paid_at",
      label: "Status",
      filterType: "select",
      filterAble: true,
      isStatus: true,
      render: (value, row) => (
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {row.paid_at ? (
              <div className="flex items-center gap-1">
                <span>
                  <StatusBadge status={'paid'} />
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <span>
                  <StatusBadge status={'due'} />
                </span>
              </div>
            )}
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
        apiEndpoint={"event"}
        title={"Events"}
        description={"List of Events"}
        queryParams={{}}
        actions={actions}
        showExtraButton={false}
      />
    </div>
  );
};

export default Index;
