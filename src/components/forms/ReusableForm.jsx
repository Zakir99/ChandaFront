// src/components/forms/ReusableForm.jsx
import React, { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";
import FormInput from "./FormInput";
import Button from "../ui/Button";
import Card from "../ui/Card";
import useFormSubmit from "../../hooks/useFormSubmit";
import { useNavigate } from "react-router-dom";
const ReusableForm = ({
  // API configuration
  apiEndpoint,
  method = "POST",
  onSubmitSuccess,
  onSubmitError,

  // Form configuration
  title,
  description,
  inputs = [],
  initialValues = {},
  validationRules = {},

  // UI configuration
  layout = "vertical", // 'vertical' or 'horizontal'
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  showCancelButton = true,
  onCancel,

  // Styling
  className = "",
  size = "default", // 'sm', 'default', 'lg'
  theme = "auto", // 'light', 'dark', 'auto'
  onSuccessRedirect,
  hasFile = false,
  // Additional props
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const { submit, loading, error, success } = useFormSubmit({
    url: apiEndpoint,
    onSuccess: onSubmitSuccess,
    onError: onSubmitError,
  });


  useEffect(() => {
    const initialFormData = {};

    inputs.forEach((input) => {
      initialFormData[input.name] =
        initialValues[input.name] ?? input.defaultValue ?? "";
    });

    setFormData(initialFormData);
  }, []);

  const validateField = (name, value, formData) => {
    const rules = validationRules[name] || {};
    const field = inputs.find((i) => i.name === name);
    const fieldErrors = [];

    if (rules.required && !value) {
      fieldErrors.push("This field is required");
    }

    // if ((rules.required || field?.required) && !value) {
    //   fieldErrors.push("This field is required");
    // }

    // if (
    //   name === "amount_per_family" &&
    //   formData.death_type === "local" &&
    //   !value
    // ) {
    //   fieldErrors.push("Amount per member is required for local deaths");
    // }
    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(rules.message || "Invalid format");
    }

    if (rules.custom && !rules.custom(value, formData)) {
      fieldErrors.push(rules.customMessage || "Invalid value");
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    inputs.forEach((input) => {
      const fieldErrors = validateField(input.name, formData[input.name]);
      if (fieldErrors.length > 0) {
        newErrors[input.name] = fieldErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Real-time validation
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldErrors,
      }));
    }
  };

  const handleInputBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldErrors,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    inputs.forEach((input) => (allTouched[input.name] = true));
    setTouched(allTouched);

    if (!validateForm()) return;

    let data;

    if (hasFile) {
      data = new FormData();

      inputs.forEach((input) => {
        const value = formData[input.name];
        if (!value) return;

        // Handle voice recording (Blob)
        if (value instanceof Blob && value.type?.startsWith("audio/")) {
          // Send voice as separate field with metadata
          data.append("voice", value, `voice-${Date.now()}.webm`);
          data.append("voiceField", input.name);
          if (value.duration) {
            data.append("voiceDuration", value.duration);
          }
        }
        // Handle regular files
        else if (value instanceof File) {
          data.append("files", value);
        }
        // Handle multiple files
        else if (value instanceof FileList || Array.isArray(value)) {
          Array.from(value).forEach((file) => data.append("files", file));
        }
        // Handle regular fields
        else if (typeof value === "object" && value !== null) {
          data.append(input.name, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          data.append(input.name, value);
        }
      });
    } else {
      data = formData;
    }

    try {
      await submit(data);
      navigate(onSuccessRedirect);
    } catch (err) {
      console.error("Submit error:", err);
      // Optionally set form error state
      setFormError(err.message || "Failed to submit form");
    }
  };
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-7xl",
  };


  return (
    <Card className={`w-full ${sizeClasses[size]} ${className}`} theme={theme}>
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Form submitted successfully!
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div
          className={
            layout === "horizontal"
              ? "grid grid-cols-1 md:grid-cols-2 gap-6"
              : "space-y-4"
          }
        >
          {inputs
            .filter((input) => {
              if (!input.showIf) return true;
              return input.showIf(formData);
            })
            .map((input) => (
              <FormInput
                key={input.name}
                {...input}
                value={formData[input.name] ?? ""}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                error={touched[input.name] ? errors[input.name] : []}
                theme={theme}
                layout={layout}
                accept={input.accept ? String(input.accept) : undefined} 
                searchable={input.searchable}
                multiple={input.multiple || false}
                showIf={input.showIf}
              />
            ))}
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4  border-gray-200 dark:border-gray-700">
          {showCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              // theme={theme}
            >
              {cancelButtonText}
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            // theme={theme}
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ReusableForm;
