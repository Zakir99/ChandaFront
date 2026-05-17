import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
} from "@floating-ui/react";

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Filter,
  X,
  XCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Loader2,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Config from "../Js/Config";
import axios from "axios";
import StatusBadge from "./ui/Status";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
const DataTable = ({
  // API Configuration
  apiEndpoint,
  queryParams = {},

  // Table Configuration
  columns = [],
  title = "Data Management",
  showExtraButton = true,
  showSearch = true,
  showFilters = true,
  name,
  handleExtra,

  // Actions
  actions = {
    view: true,
    edit: true,
    delete: true,
    custom: [],
  },

  // Callbacks
  onView,
  onEdit,
  onDelete,
  onCustomAction,
  onDataFetch,

  // Initial State
  initialPerPage = 10,
  initialSortField = "created_at",
  initialSortDirection = "desc",

  // Styling
  className = "",
  tableClassName = "",

  // Custom renderers
  renderCell = null,

  // Mobile view threshold (in pixels)
  mobileBreakpoint = 768,
}) => {
  // Theme State - using Redux for theme management
  const isDarkMode = useSelector((state) => state.auth?.theme);
  const url = Config.apiUrl;
  const headers = useMemo(() => Config.getConfig(), []);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const activeButtonRef = useRef(null);

  // Data State
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: initialPerPage,
    total: 0,
    lastPage: 1,
    from: 0,
    to: 0,
  });

  // Filter State
  const [filters, setFilters] = useState({});
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Sorting State
  const [sorting, setSorting] = useState({
    field: initialSortField,
    direction: initialSortDirection,
  });

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Row Actions Dropdown
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { refs, floatingStyles, update } = useFloating({
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });
  // Mobile view state
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < mobileBreakpoint,
  );
  const [expandedCards, setExpandedCards] = useState({});
  useEffect(() => {
    if (!activeDropdown) return;

    const updatePosition = () => {
      if (activeButtonRef.current) {
        const rect = activeButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right - 200,
        });
      }
    };

    // Update position on scroll and resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    // Initial position set
    updatePosition();

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [activeDropdown]);
  // Theme effect - apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#000000");
      }
    } else {
      document.documentElement.classList.remove("dark");
      const metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (metaThemeColor) {
        metaThemeColor.setAttribute("content", "#ffffff");
      }
    }
  }, [isDarkMode]);

  // Handle resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileBreakpoint]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => {
      if (prev.currentPage === 1) return prev;
      return { ...prev, currentPage: 1 };
    });
  }, [debouncedSearchTerm, filters, sorting.field, sorting.direction]);

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pagination.currentPage,
        per_page: pagination.perPage,
        search: debouncedSearchTerm,
        sort_field: sorting.field,
        sort_direction: sorting.direction,
        ...filters,
        ...queryParams,
      });

      const response = await axios.get(
        `${url}${apiEndpoint}?${params.toString()}`,
        headers,
      );

      const { data, pagination: meta } = response.data;

      setData(data);
      setPagination((prev) => ({
        ...prev,
        total: meta.total,
        lastPage: meta.last_page,
        from: meta.from,
        to: meta.to,
      }));

      if (onDataFetch) {
        onDataFetch(response.data);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [
    apiEndpoint,
    pagination.currentPage,
    pagination.perPage,
    sorting.field,
    sorting.direction,
    debouncedSearchTerm,
    filters,
    queryParams,
    onDataFetch,
    url,
    headers,
  ]);

  // Initial fetch and refetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  // Handle sorting
  const handleSort = (field) => {
    setSorting((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort icon
  const getSortIcon = (field) => {
    if (sorting.field !== field)
      return <ArrowUpDown size={14} className="text-gray-400" />;
    return sorting.direction === "asc" ? (
      <ArrowUp size={14} className="text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown size={14} className="text-blue-600 dark:text-blue-400" />
    );
  };

  // Handle page change
  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  // Handle per page change
  const handlePerPageChange = (e) => {
    setPagination((prev) => ({
      ...prev,
      perPage: Number(e.target.value),
      currentPage: 1,
    }));
  };

  // Toggle card expansion
  const toggleCardExpansion = (rowId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  // Get filterable columns
  const filterableColumns = useMemo(() => {
    return columns.filter((col) => col.filterable);
  }, [columns]);

  // Theme-specific styles
  const themeStyles = {
    // Background colors
    pageBg: isDarkMode ? "bg-gray-950" : "",
    headerBg: isDarkMode ? "bg-gray-950/50" : "bg-white",
    contentBg: isDarkMode ? "bg-gray-900" : "bg-white",
    cardBg: isDarkMode ? "bg-gray-900" : "bg-white",

    // Border colors
    border: isDarkMode ? "border-gray-800" : "border-gray-200",
    tableBorder: isDarkMode ? "border-gray-800" : "border-gray-200",

    // Text colors
    textPrimary: isDarkMode ? "text-white" : "text-gray-900",
    textSecondary: isDarkMode ? "text-gray-400" : "text-gray-600",
    textMuted: isDarkMode ? "text-gray-500" : "text-gray-400",

    // Input backgrounds
    inputBg: isDarkMode ? "bg-gray-900" : "bg-white",
    inputBorder: isDarkMode ? "border-gray-800" : "border-gray-300",

    // Table specific
    tableHeaderBg: isDarkMode ? "bg-gray-800" : "",
    tableRowHover: isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50",
    tableDivider: isDarkMode ? "divide-gray-800" : "divide-gray-200",

    // Dropdown
    dropdownBg: isDarkMode ? "bg-gray-900" : "bg-white",
    dropdownBorder: isDarkMode ? "border-gray-800" : "border-gray-200",
    dropdownHover: isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-50",

    // Buttons
    buttonSecondary: isDarkMode
      ? "border-gray-800 bg-gray-900 text-gray-300 hover:bg-gray-800 border"
      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };

  // Render mobile card view
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 p-4">
        {data.map((row, rowIndex) => {
          const isExpanded = expandedCards[row.uuid || rowIndex];
          const primaryColumns = columns.slice(0, 2); // Show first 2 columns in card header
          const secondaryColumns = columns.slice(2); // Remaining columns in expanded view

          return (
            <div
              key={row.uuid || rowIndex}
              className={`${themeStyles.cardBg} rounded-lg shadow-sm ${themeStyles.border} overflow-hidden`}
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleCardExpansion(row.uuid || rowIndex)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {primaryColumns.map((column, idx) => (
                      <div key={column.key || idx} className="mb-1">
                        <span className={`text-xs ${themeStyles.textMuted}`}>
                          {column.label}:
                        </span>
                        <div
                          className={`text-sm font-medium ${themeStyles.textPrimary} mt-0.5`}
                        >
                          {renderCell ? (
                            renderCell(column.key, row[column.key], row)
                          ) : column.render ? (
                            column.render(row[column.key], row)
                          ) : column.isStatus ? (
                            <StatusBadge status={row[column.key]} />
                          ) : (
                            row[column.key]
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-1">
                      {actions.view && onView && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(row);
                          }}
                          className={`p-2 rounded-lg ${themeStyles.dropdownHover}`}
                        >
                          <Eye size={18} className="text-emerald-600" />
                        </button>
                      )}
                      {actions.edit && onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(row);
                          }}
                          className={`p-2 rounded-lg ${themeStyles.dropdownHover}`}
                        >
                          <Edit size={18} className="text-indigo-500" />
                        </button>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} className={themeStyles.textMuted} />
                    ) : (
                      <ChevronDown
                        size={20}
                        className={themeStyles.textMuted}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div
                  className={`px-4 pb-4 pt-2 border-t ${themeStyles.border}`}
                >
                  {/* Secondary Columns */}
                  {secondaryColumns.map((column, idx) => (
                    <div
                      key={column.key || idx}
                      className="flex justify-between py-2"
                    >
                      <span className={`text-sm ${themeStyles.textMuted}`}>
                        {column.label}:
                      </span>
                      <span
                        className={`text-sm ${themeStyles.textPrimary} font-medium`}
                      >
                        {renderCell ? (
                          renderCell(column.key, row[column.key], row)
                        ) : column.render ? (
                          column.render(row[column.key], row)
                        ) : column.isStatus ? (
                          <StatusBadge status={row[column.key]} />
                        ) : (
                          row[column.key]
                        )}
                      </span>
                    </div>
                  ))}

                  {/* Actions */}
                  {(actions.delete || actions.custom?.length > 0) && (
                    <div className="flex gap-2 mt-4 pt-3 border-t ${themeStyles.border}">
                      {actions.custom?.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (onCustomAction) {
                              onCustomAction(action.name, row);
                            }
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg ${themeStyles.buttonSecondary} flex items-center justify-center gap-2 text-sm`}
                        >
                          {action.icon}
                          {action.label}
                        </button>
                      ))}
                      {actions.delete && onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="flex-1 px-3 py-2 rounded-lg border border-red-300 dark:border-red-800 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center justify-center gap-2 text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div
      className={`min-h-screen  transition-colors duration-200 ${className}`}
    >
      {/* Header */}
      <div
        className={`${themeStyles.headerBg} ${themeStyles.border} sticky top-0 z-10`}
      >
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className={`text-xl sm:text-2xl font-bold ${themeStyles.textPrimary}`}
            >
              {title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-4">
        {/* Search and Actions Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            {showSearch && (
              <div className="flex-1 relative">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${themeStyles.textMuted}`}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 ${themeStyles.inputBorder} rounded-lg ${themeStyles.inputBg} ${themeStyles.textPrimary} focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-md`}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {showFilters && filterableColumns.length > 0 && (
                <button
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg ${themeStyles.buttonSecondary} flex items-center justify-center gap-2 text-sm shadow-md`}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>
              )}

              {showExtraButton && (
                <button
                  onClick={handleExtra}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Add {name}</span>
                  <span className="sm:hidden">Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFiltersPanel && filterableColumns.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 ${themeStyles.cardBg} rounded-lg shadow-sm`}
            >
              {filterableColumns.map((column) => (
                <div key={column.key}>
                  <label
                    className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}
                  >
                    {column.label}
                  </label>
                  {column.filterType === "select" ? (
                    <select
                      value={filters[column.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                      className={`w-full px-3 py-2 shadow-sm rounded-lg ${themeStyles.inputBg} ${themeStyles.textPrimary} focus:ring-2 focus:ring-blue-500 text-sm `}
                    >
                      <option value="">All {column.label}</option>
                      {column.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={column.filterType || "text"}
                      value={filters[column.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(column.key, e.target.value)
                      }
                      placeholder={`Filter by ${column.label}`}
                      className={`w-full px-3 py-2 shadow-sm rounded-lg ${themeStyles.inputBg} ${themeStyles.textPrimary} focus:ring-2 focus:ring-blue-500 text-sm`}
                    />
                  )}
                </div>
              ))}

              {/* Clear Filters Button */}
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className={`px-4 py-2 text-sm ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} flex items-center gap-2`}
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area - Table or Cards */}
        <div
          className={`${themeStyles.cardBg} rounded-lg shadow overflow-hidden`}
        >
          {loading ? (
            <div className="p-8 sm:p-12 text-center">
              <Loader2
                size={40}
                className="animate-spin mx-auto text-blue-600"
              />
              <p className={`mt-4 ${themeStyles.textSecondary}`}>
                Loading data...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 sm:p-12 text-center">
              <XCircle size={40} className="mx-auto text-red-600" />
              <p className="mt-4 text-red-600">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          ) : data.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <p className={themeStyles.textMuted}>No data found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              {!isMobile && (
                <div className="overflow-x-auto">
                  <table className={`w-full ${tableClassName}`}>
                    <thead className={themeStyles.tableHeaderBg}>
                      <tr>
                        {columns.map((column, index) => (
                          <th
                            key={column.key || index}
                            className={`px-4 sm:px-6 py-3 text-left text-xs font-medium ${themeStyles.textSecondary} uppercase tracking-wider ${
                              column.sortable
                                ? `cursor-pointer hover:${themeStyles.textPrimary}`
                                : ""
                            }`}
                            onClick={() =>
                              column.sortable && handleSort(column.key)
                            }
                          >
                            <div className="flex items-center gap-1">
                              {column.label}
                              {column.sortable && getSortIcon(column.key)}
                            </div>
                          </th>
                        ))}
                        {(actions?.view ||
                          actions?.edit ||
                          actions?.delete ||
                          actions?.custom?.length > 0) && (
                          <th
                            className={`px-4 sm:px-6 py-3 text-right text-xs font-medium ${themeStyles.textSecondary} uppercase tracking-wider`}
                          >
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${themeStyles.tableDivider}`}>
                      {data.map((row, rowIndex) => (
                        <tr
                          key={row.uuid || rowIndex}
                          className={`${themeStyles.tableRowHover} border-0`}
                        >
                          {columns.map((column, index) => (
                            <td
                              key={column.key || index}
                              className="px-4 sm:px-6 py-4 whitespace-nowrap"
                            >
                              {renderCell ? (
                                renderCell(column.key, row[column.key], row)
                              ) : column.render ? (
                                column.render(row[column.key], row)
                              ) : column.isStatus ? (
                                <StatusBadge status={row[column.key]} />
                              ) : (
                                <span
                                  className={`text-sm ${themeStyles.textPrimary}`}
                                >
                                  {row[column.key]}
                                </span>
                              )}
                            </td>
                          ))}

                     
                          {/* Actions */}
                          {(actions.view ||
                            actions.edit ||
                            actions.delete ||
                            actions?.custom?.length > 0) && (
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative align-top">
                              <div className="relative inline-block">
                                <button
                                  ref={
                                    activeDropdown === (row.id ?? row.uuid)
                                      ? activeButtonRef
                                      : null
                                  }
                                  onClick={(e) => {
                                    // Store the button reference
                                    activeButtonRef.current = e.currentTarget;

                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    setDropdownPosition({
                                      top: rect.bottom + window.scrollY,
                                      left: rect.right - 200,
                                    });
                                    setActiveDropdown(
                                      activeDropdown === (row.id ?? row.uuid)
                                        ? null
                                        : (row.id ?? row.uuid),
                                    );
                                  }}
                                  className={`${themeStyles.textMuted} hover:${themeStyles.textPrimary} p-2 rounded-lg ${themeStyles.dropdownHover}`}
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {/* ONLY Portal dropdown - remove the absolute positioned one */}
                                {activeDropdown === (row.id ?? row.uuid) &&
                                  createPortal(
                                    <>
                                      <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setActiveDropdown(null)}
                                      />
                                      <div
                                        className="fixed z-50"
                                        style={{
                                          top: dropdownPosition.top,
                                          left: dropdownPosition.left,
                                        }}
                                      >
                                        <div
                                          className={`w-48 ${themeStyles.dropdownBg} rounded-lg shadow-lg ${themeStyles.dropdownBorder} overflow-y-auto max-h-64`}
                                        >
                                          <div className="py-1">
                                            {actions.view && onView && (
                                              <button
                                                onClick={() => {
                                                  onView(row);
                                                  setActiveDropdown(null);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm ${themeStyles.textSecondary} ${themeStyles.dropdownHover} flex items-center gap-2`}
                                              >
                                                <Eye
                                                  size={16}
                                                  className="text-emerald-600"
                                                />
                                                <span className="text-emerald-600">
                                                  View Details
                                                </span>
                                              </button>
                                            )}
                                            {actions.edit && onEdit && (
                                              <button
                                                onClick={() => {
                                                  onEdit(row);
                                                  setActiveDropdown(null);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm ${themeStyles.textSecondary} ${themeStyles.dropdownHover} flex items-center gap-2`}
                                              >
                                                <Edit
                                                  size={16}
                                                  className="text-indigo-500"
                                                />
                                                <span className="text-indigo-500">
                                                  Edit
                                                </span>
                                              </button>
                                            )}
                                            {actions?.custom?.map(
                                              (action, index) => (
                                                <button
                                                  key={index}
                                                  onClick={() => {
                                                    if (onCustomAction) {
                                                      onCustomAction(
                                                        action.name,
                                                        row,
                                                      );
                                                    }
                                                    setActiveDropdown(null);
                                                  }}
                                                  className={`w-full text-left px-4 py-2 text-sm ${themeStyles.dropdownHover} flex items-center gap-2 ${
                                                    action.className ||
                                                    themeStyles.textSecondary
                                                  }`}
                                                >
                                                  {action.icon}
                                                  {action.label}
                                                </button>
                                              ),
                                            )}
                                            {actions.delete && onDelete && (
                                              <>
                                                <div
                                                  className={`border-t ${themeStyles.border} my-1`}
                                                ></div>
                                                <button
                                                  onClick={() => {
                                                    onDelete(row);
                                                    setActiveDropdown(null);
                                                  }}
                                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2"
                                                >
                                                  <Trash2 size={16} />
                                                  Delete
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </>,
                                    document.body,
                                  )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile Card View */}
              {isMobile && renderMobileCards()}

              {/* Pagination */}
              <div
                className={`${themeStyles.cardBg} px-4 sm:px-6 py-4 ${themeStyles.border}`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <span
                      className={`text-sm ${themeStyles.textSecondary} order-2 sm:order-1`}
                    >
                      Showing {pagination.from || 0} to {pagination.to || 0} of{" "}
                      {pagination.total || 0}
                    </span>
                    <select
                      value={pagination.perPage}
                      onChange={handlePerPageChange}
                      className={`w-full sm:w-auto px-2 py-1 border ${themeStyles.inputBorder} rounded ${themeStyles.inputBg} ${themeStyles.textSecondary} text-sm order-1 sm:order-2`}
                    >
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                      <option value={100}>100 / page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => goToPage(1)}
                      disabled={pagination.currentPage === 1}
                      className={`p-2 rounded-lg ${themeStyles.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label="First page"
                    >
                      <ChevronsLeft size={16} />
                    </button>
                    <button
                      onClick={() => goToPage(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className={`p-2 rounded-lg ${themeStyles.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label="Previous page"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span
                      className={`px-2 sm:px-4 py-2 text-sm ${themeStyles.textSecondary}`}
                    >
                      {pagination.currentPage} / {pagination.lastPage}
                    </span>

                    <button
                      onClick={() => goToPage(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.lastPage}
                      className={`p-2 rounded-lg  ${themeStyles.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label="Next page"
                    >
                      <ChevronRight size={16} />
                    </button>
                    <button
                      onClick={() => goToPage(pagination.lastPage)}
                      disabled={pagination.currentPage === pagination.lastPage}
                      className={`p-2 rounded-lg  ${themeStyles.buttonSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label="Last page"
                    >
                      <ChevronsRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
