// src/components/forms/FormInput.jsx (Enhanced version)
import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  Lock,
  Search,
  Loader2,
} from "lucide-react";
import File from "../ui/File";
import Location from "../ui/Location";
import Audio from "../ui/Audio";

const FormInput = ({
  type = "text",
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error = [],
  required = false,
  disabled = false,
  readOnly = false,
  options = [],
  rows = 4,
  searchable,
  min,
  max,
  step,
  showIf,
  icon: Icon,
  helperText,
  theme = "auto",
  layout = "vertical",
  className = "",
  showCharCount = false,
  maxLength,
  isEdited = false,
  originalValue,
  description,
  maxFileSize,
  onError,
  allowedExtensions,
  metadata,
  accept,
  multiple,
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const inputId = `input-${name}`;
  const baseInputClasses = `
    block w-full px-4 py-2.5
    bg-white dark:bg-gray-800
    dark:border rounded-lg
    shadow-sm
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    read-only:bg-gray-50 read-only:dark:bg-gray-900 read-only:cursor-default
  `;

  delete props.accept;
  delete props.multiple;  

  const getInputClasses = () => {
    let classes = baseInputClasses;

    // Error state
    if (error.length > 0) {
      classes += `
        border-red-300 dark:border-red-700
        focus:border-red-500 dark:focus:border-red-500
        focus:ring-red-500/20 dark:focus:ring-red-500/20
        focus:ring-offset-red-50 dark:focus:ring-offset-red-900
      `;
    }
    // Edited state
    else if (isEdited && value !== originalValue) {
      classes += `
        border-yellow-300 dark:border-yellow-700
        focus:border-yellow-500 dark:focus:border-yellow-500
        focus:ring-yellow-500/20 dark:focus:ring-yellow-500/20
        focus:ring-offset-yellow-50 dark:focus:ring-offset-yellow-900
      `;
    }
    // Focused state
    else if (isFocused) {
      classes += `
        border-blue-500 dark:border-blue-400
        ring-2 ring-blue-500/20 dark:ring-blue-400/20
        ring-offset-2 ring-offset-white dark:ring-offset-gray-900
      `;
    }
    // Default state
    else {
      classes += `
        border-gray-300 dark:border-gray-600
        hover:border-gray-400 dark:hover:border-gray-500
      `;
    }

    if (Icon) {
      classes += " pl-10";
    }

    if (type === "password") {
      classes += " pr-10";
    }

    return classes;
  };


  const renderInput = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [searchTerm, setSearchTerm] = useState(value || "");
    const dropdownRef = useRef(null);
    const debounceTimer = useRef(null);
    const inputRef = useRef(null);
    const handleKeyDown = (e) => {
      if (!showDropdown) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev > -1 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (activeIndex >= 0 && searchResults[activeIndex]) {
            handleSelectItem(searchResults[activeIndex]);
          }
          break;
        case "Escape":
          setShowDropdown(false);
          setActiveIndex(-1);
          break;
        default:
          break;
      }
    };
    const commonProps = {
      id: inputId,
      name,
      value: type === "searchable" ? searchTerm : value,
      onChange: (e) => {
        if (type === "searchable") {
          handleSearchableChange(e);
        } else {
          onChange(
            name,
            type === "checkbox" ? e.target.checked : e.target.value,
          );
        }
      },
      onBlur: (e) => {
        // Don't close dropdown if clicking inside dropdown
        if (
          dropdownRef.current &&
          dropdownRef.current.contains(e.relatedTarget)
        ) {
          return;
        }
        setTimeout(() => {
          setShowDropdown(false);
          setIsFocused(false);
        }, 200);
      },
      onFocus: () => {
        setIsFocused(true);
        if (
          type === "searchable" &&
          searchTerm.length >= (searchable?.minChars || 2)
        ) {
          setShowDropdown(true);
        }
      },
      onKeyDown: type === "searchable" ? handleKeyDown : undefined,
      disabled: disabled || readOnly,
      required,
      ...props,
    };

    // Handle searchable input change with debounce
    const handleSearchableChange = (e) => {
      const newValue = e.target.value;
      setSearchTerm(newValue);

      // Clear previous timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Don't search if value is empty or too short
      if (newValue.length < (searchable?.minChars || 2)) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      // Show loading state
      setSearchLoading(true);
      setShowDropdown(true);

      // Debounce API call
      debounceTimer.current = setTimeout(async () => {
        try {
          const results = await searchable.api(newValue);
          const formattedResults = searchable.transformResponse
            ? searchable.transformResponse(results)
            : results.data || results;

          setSearchResults(formattedResults);
        } catch (error) {
          console.error("Search failed:", error);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      }, searchable?.debounceTime || 300);
    };

    // Handle item selectiona
    const handleSelectItem = (item) => {
      const displayValue = searchable.getItemDisplay
        ? searchable.getItemDisplay(item)
        : item[searchable.displayField || "name"] ||
          item.name ||
          item.label ||
          JSON.stringify(item);

      const actualValue = searchable.getItemValue
        ? searchable.getItemValue(item)
        : item[searchable.valueField || "id"] || item.id;
      setSearchTerm(displayValue);
      onChange(name, actualValue);
      setShowDropdown(false);
      setSearchResults([]);
      setActiveIndex(-1);

      if (searchable.onSelect) {
        searchable.onSelect(item);
      }
    };

    // Handle keyboard navigation

    // Click outside handler
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target) &&
          inputRef.current &&
          !inputRef.current.contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Cleanup debounce timer
    useEffect(() => {
      return () => {
        if (debounceTimer.current) {
          clearTimeout(debounceTimer.current);
        }
      };
    }, []);
    switch (type) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={rows}
            placeholder={placeholder}
            maxLength={maxLength}
            className={getInputClasses()}
          />
        );

      case "audio":
        return <Audio name={name} onChange={onChange} disabled={disabled} />;

      case "location":
        return (
          <Location
            {...commonProps}
            name={name}
            value={value}
            onChange={(val) => onChange(name, val)}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            showCurrentLocation
          />
        );

      case "file":
        return (
          <File
            {...commonProps}
            name={name}
            value={value}
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            maxFileSize={maxFileSize}
            allowedExtensions={allowedExtensions}
            onError={onError}
            className={getInputClasses()}
          />
        );
      case "select":
        return (
          <select {...commonProps} className={getInputClasses()}>
            <option value="">Select an option</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "searchable":
        return (
          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                {...commonProps}
                placeholder={placeholder || "Search..."}
                autoComplete="off"
                className={`${getInputClasses()} pr-10 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 dark:placeholder-gray-400`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {searchLoading ? (
                  <Loader2
                    size={18}
                    className="text-gray-400 dark:text-gray-500 animate-spin"
                  />
                ) : (
                  <Search
                    size={18}
                    className="text-gray-400 dark:text-gray-500"
                  />
                )}
              </div>
            </div>

            {/* Dropdown Results */}
            {showDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-2xl max-h-60 overflow-y-auto border dark:border-gray-700">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <Loader2
                      size={20}
                      className="animate-spin mx-auto mb-2 dark:text-gray-400"
                    />
                    <p className="text-sm">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul className="py-1">
                    {searchResults.map((item, idx) => {
                      const displayValue = searchable.getItemDisplay
                        ? searchable.getItemDisplay(item)
                        : item[searchable.displayField || "name"] ||
                          item.name ||
                          item.label ||
                          JSON.stringify(item);

                      return (
                        <li
                          key={idx}
                          onMouseDown={() => handleSelectItem(item)}
                          className={`px-4 py-2 cursor-pointer text-sm transition-colors duration-150 ${
                            idx === activeIndex
                              ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {displayValue}
                        </li>
                      );
                    })}
                  </ul>
                ) : searchTerm.length >= (searchable?.minChars || 2) ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">No results found</p>
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <p className="text-sm">
                      Type at least {searchable?.minChars || 2} characters to
                      search
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case "radio":
        return (
          <div
            className="space-y-3"
            role="group"
            aria-labelledby={`${name}-group-label`}
          >
            {options.map((option, index) => {
              const optionId = `${name}-${option.value}`;
              const isSelected = value === option.value;
              const isModified = isEdited && value !== originalValue;

              return (
                <label
                  key={option.value}
                  htmlFor={optionId}
                  className={`
              relative flex items-center p-3 rounded-lg border-2 cursor-pointer
              transition-all duration-200 ease-in-out 
              ${
                isSelected
                  ? isModified
                    ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
                    : "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              }
              ${disabled ? "opacity-50 cursor-not-allowed hover:border-transparent" : ""}
            `}
                >
                  <input
                    type="radio"
                    id={optionId}
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    onChange={commonProps.onChange}
                    onBlur={commonProps.onBlur}
                    disabled={disabled}
                    className="sr-only" // Hide visually but keep accessible
                  />

                  {/* Custom radio indicator */}
                  <div
                    className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              transition-all duration-200
              ${
                isSelected
                  ? isModified
                    ? "border-yellow-500 dark:border-yellow-400"
                    : "border-blue-500 dark:border-blue-400"
                  : "border-gray-300 dark:border-gray-600"
              }
              ${disabled ? "border-gray-200 dark:border-gray-700" : ""}
            `}
                  >
                    {isSelected && (
                      <div
                        className={`
                  w-2.5 h-2.5 rounded-full
                  ${
                    isModified
                      ? "bg-yellow-500 dark:bg-yellow-400"
                      : "bg-blue-500 dark:bg-blue-400"
                  }
                `}
                      />
                    )}
                  </div>

                  {/* Option label and optional description */}
                  <div className="ml-3 flex-1">
                    <span
                      className={`
                text-sm font-medium
                ${
                  isSelected
                    ? isModified
                      ? "text-yellow-900 dark:text-yellow-200"
                      : "text-blue-900 dark:text-blue-200"
                    : "text-gray-900 dark:text-gray-100"
                }
              `}
                    >
                      {option.label}
                    </span>
                    {option.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Modified indicator */}
                  {isModified && isSelected && (
                    <span className="ml-2 text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded-full">
                      Modified
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        );

      case "checkbox":
        const checkboxId = `${name}-checkbox`;
        const isModified = isEdited && value !== originalValue;

        return (
          <label
            htmlFor={checkboxId}
            className={`
        relative flex items-center p-4 rounded-xl shadow-sm cursor-pointer
        transition-all duration-200 ease-in-out group
        ${
          value
            ? isModified
              ? "border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20"
              : "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
        }
        ${disabled ? "opacity-50 cursor-not-allowed hover:border-transparent" : ""}
      `}
          >
            <input
              type="checkbox"
              id={checkboxId}
              name={name}
              checked={value}
              onChange={commonProps.onChange}
              onBlur={commonProps.onBlur}
              disabled={disabled}
              className="sr-only " // Hide visually but keep accessible
            />

            {/* Custom checkbox with animation */}
            <div
              className={`
        relative w-6 h-6 rounded-lg shadow-sm flex items-center justify-center
        transition-all duration-200
        ${
          value
            ? isModified
              ? "border-yellow-500 dark:border-yellow-400 bg-yellow-500 dark:bg-yellow-400"
              : "border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400"
            : "border-gray-300 dark:border-gray-600 bg-transparent"
        }
        ${disabled ? "border-gray-200 dark:border-gray-700" : ""}
        group-hover:scale-105
      `}
            >
              {value && (
                <svg
                  className="w-4 h-4 text-white animate-scale-check"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>

            {/* Label and description section */}
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`
            text-base font-medium
            ${
              value
                ? isModified
                  ? "text-yellow-900 dark:text-yellow-200"
                  : "text-blue-900 dark:text-blue-200"
                : "text-gray-900 dark:text-gray-100"
            }
          `}
                >
                  {label}
                </span>

                {isModified && value && (
                  <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded-full">
                    Modified
                  </span>
                )}
              </div>

              {/* Description text */}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {description}
                </p>
              )}

              {/* Additional metadata or status */}
              {metadata && (
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                  {metadata.map((item, index) => (
                    <span key={index} className="flex items-center gap-1">
                      {item.icon && <item.icon className="w-3 h-3" />}
                      {item.text}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick action indicator */}
            {!disabled && (
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Click to toggle
                </span>
              </div>
            )}
          </label>
        );

      case "image":
        const imageId = `${name}-image`;
        const [preview, setPreview] = useState(value || null);
        const [isDragging, setIsDragging] = useState(false);
        const [error, setError] = useState(null);
        const fileInputRef = useRef(null);

        const isModifiedImage = isEdited && value !== originalValue;
        const acceptedTypes = options?.acceptedTypes || [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
        ];
        const maxSize = options?.maxSize || 5 * 1024 * 1024; // 5MB default
        const size = options?.size || "md"; // 'sm', 'md', 'lg'
        const layout = options?.layout || "inline"; // 'inline' for row layout, 'block' for full width

        const handleFileSelect = (file) => {
          setError(null);

          if (!acceptedTypes.includes(file.type)) {
            setError(`Invalid type`);
            return;
          }

          if (file.size > maxSize) {
            setError(`Max ${maxSize / (1024 * 1024)}MB`);
            return;
          }

          // Preview using FileReader
          const reader = new FileReader();
          reader.onloadend = () => setPreview(reader.result);
          reader.readAsDataURL(file);

          // **Store the actual File object in form state, not reader.result**
          commonProps.onChange({
            target: {
              name,
              value: file, // <--- must be the File object
            },
          });
        };

        const handleDrop = (e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled) return;
          const file = e.dataTransfer.files[0];
          if (file) handleFileSelect(file);
        };

        const handleFileInput = (e) => {
          const file = e.target.files[0];
          if (file) handleFileSelect(file);
        };

        const handleRemove = () => {
          setPreview(null);
          setError(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          commonProps.onChange({
            target: {
              name,
              value: null,
            },
          });
        };

        // Size classes
        const sizeClasses = {
          sm: {
            container: "w-20 h-20",
            icon: "w-6 h-6",
            text: "text-[10px]",
            button: "p-1",
          },
          md: {
            container: "w-24 h-24",
            icon: "w-7 h-7",
            text: "text-xs",
            button: "p-1.5",
          },
          lg: {
            container: "w-32 h-32",
            icon: "w-8 h-8",
            text: "text-sm",
            button: "p-2",
          },
        };

        const sizeStyle = sizeClasses[size];

        // For inline layout (row-based)
        if (layout === "inline") {
          return (
            <div className="flex items-center gap-3">
              {/* Hidden file input */}
              <input
                type="file"
                id={imageId}
                ref={fileInputRef}
                accept={acceptedTypes.join(",")}
                onChange={handleFileInput}
                disabled={disabled}
                className="hidden"
              />

              {/* Image preview/upload box */}
              <div
                className={`
            relative ${sizeStyle.container} rounded-lg border-2 overflow-hidden
            transition-all duration-200 shrink-0
            ${
              isDragging
                ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
                : preview
                  ? isModifiedImage
                    ? "border-yellow-300 dark:border-yellow-600"
                    : "border-blue-300 dark:border-blue-600"
                  : "border-gray-300 dark:border-gray-600 border-dashed"
            }
            ${!preview && !disabled && "cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            ${error ? "border-red-300 dark:border-red-700" : ""}
          `}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() =>
                  !disabled && !preview && fileInputRef.current?.click()
                }
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-1 opacity-0 hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className={`${sizeStyle.button} bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-lg`}
                        title="Change"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove();
                        }}
                        className={`${sizeStyle.button} bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg`}
                        title="Remove"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Modified indicator dot */}
                    {isModifiedImage && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full ring-2 ring-white dark:ring-gray-800" />
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {error ? (
                      <div className="text-center" title={error}>
                        <svg
                          className={`${sizeStyle.icon} text-red-500 mx-auto`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className={`${sizeStyle.icon} text-gray-400 mx-auto`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Text information */}
              <div className="flex-1 min-w-0">
                {preview ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`${sizeStyle.text} font-medium text-gray-900 dark:text-gray-100 truncate`}
                      >
                        {options?.fileName || "image.jpg"}
                      </span>
                      {isModifiedImage && (
                        <span className="text-[10px] font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/40 px-1.5 py-0.5 rounded-full">
                          Modified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-gray-400">
                      <span>{options?.fileSize || "2.4 MB"}</span>
                      {options?.dimensions && (
                        <>
                          <span>•</span>
                          <span>
                            {options.dimensions.width}×
                            {options.dimensions.height}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p
                      className={`${sizeStyle.text} font-medium text-gray-700 dark:text-gray-300`}
                    >
                      {label}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {error ||
                        `Click or drag (${maxSize / (1024 * 1024)}MB max)`}
                    </p>
                  </div>
                )}
              </div>

              {/* Upload button when no image */}
              {!preview && !error && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  Browse
                </button>
              )}
            </div>
          );
        }

        // For block layout (original full width version)
        return (
          <div className="space-y-2">
            {/* Full width version code here - you can keep the original or simplify */}
            {/* ... */}
          </div>
        );

      default:
        return (
          <div className="relative">
            {Icon && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon
                  className={`h-5 w-5 ${
                    isEdited && value !== originalValue
                      ? "text-yellow-400 dark:text-yellow-500"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </div>
            )}

            <input
              {...commonProps}
              type={showPassword ? "text" : type}
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              maxLength={maxLength}
              className={getInputClasses()}
            />

            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
                )}
              </button>
            )}
          </div>
        );
    }
  };

  if (type === "checkbox") {
    return renderInput();
  }

  return (
    <div className={layout === "horizontal" ? "space-y-1" : "space-y-2"}>
      <div className="flex items-center justify-between">
        {label && type !== "checkbox" && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500 dark:text-red-400">*</span>
            )}
          </label>
        )}

        {showCharCount && maxLength && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>

      {renderInput()}

      {/* Helper text or edited indicator */}
      <div className="flex items-start space-x-2">
        {helperText && !error.length && !isEdited && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Info className="h-4 w-4 mr-1 shrink-0" />
            <span>{helperText}</span>
          </div>
        )}

        {isEdited && value !== originalValue && !error.length && (
          <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400">
            <Info className="h-4 w-4 mr-1 shrink-0" />
            <span>Modified from original value</span>
          </div>
        )}
      </div>

      {/* Error messages */}
      {error.length > 0 && (
        <div className="space-y-1">
          {error.map((err, index) => (
            <p
              key={index}
              className="flex items-center text-sm text-red-600 dark:text-red-400"
            >
              <AlertCircle className="h-4 w-4 mr-1 shrink-0" />
              {err}
            </p>
          ))}
        </div>
      )}

      {/* Read-only indicator */}
      {readOnly && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
          <Lock className="h-3 w-3 mr-1" />
          This field is read-only
        </div>
      )}
    </div>
  );
};

export default FormInput;
