import { LucideUnfoldVertical } from "lucide-react"

const StatusBadge = ({ status }) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold"
  
  const statusClasses = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    suspended: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    deleted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    default: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    present: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    absent: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    leave: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    late: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    unmarked: "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    marked : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    not_marked : "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    external: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    local: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    due: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    // paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", // Duplicate removed
  }
  
  const statusText = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    suspended: 'Suspended',
    deleted: 'Deleted',
    present: 'Present',
    absent: 'Absent',
    leave: 'Leave',
    late: 'Late',
    unmarked: 'Unmarked',
    paid: 'Paid',
    unpaid: 'Unpaid',
    partial: 'Partial',
    completed: 'Completed',
    marked : 'Marked',
    not_marked : 'Unmarked',
    closed: 'Closed',
    approved: 'Approved',
    rejected: 'Rejected',
    external: 'External',
    local: 'Local',
    due: 'Due',
    paid: 'Paid',
  }

  return (
    <span className={`${baseClasses} ${statusClasses[status] || statusClasses.default}`}>
      {statusText[status] || status}
    </span>
  )
}

export default StatusBadge