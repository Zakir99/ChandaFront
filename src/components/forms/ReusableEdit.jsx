// src/components/forms/ReusableEditForm.jsx
import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Save, RefreshCw } from 'lucide-react';
import FormInput from './FormInput';
import Button from '../ui/Button';
import Card from '../ui/Card';
import useFormSubmit from '../../hooks/useFormSubmit';
import useFetchData from '../../hooks/useFetchData';
import { useNavigate } from 'react-router-dom';

const ReusableEditForm = ({
  // API configuration
  fetchEndpoint,
  updateEndpoint,
  id,
  method = 'PUT',
  onUpdateSuccess,
  onUpdateError,
  onFetchError,
  
  // Form configuration
  title,
  description,
  inputs = [],
  validationRules = {},
  
  // UI configuration
  layout = 'vertical',
  submitButtonText = 'Update',
  cancelButtonText = 'Cancel',
  showCancelButton = true,
  onCancel,
  showResetButton = true,
  resetButtonText = 'Reset',
  
  // Styling
  className = '',
  size = 'default',
  theme = 'auto',
  
  // Loading states
  loadingComponent,
  errorComponent,
  onSuccessRedirect,
  
  // Additional props
  ...props
}) => {
  const [formData, setFormData] = useState({});
  const [initialFormData, setInitialFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const navigate = useNavigate();
  // Fetch existing data
  const { 
    data: fetchedData, 
    loading: fetchingLoading, 
    error: fetchingError,
    refetch 
  } = useFetchData({
    url: id ? `${fetchEndpoint}/${id}` : fetchEndpoint,
    onError: onFetchError,
  });

  // Update submission hook
  const { submit, loading: updatingLoading, error: updateError, success } = useFormSubmit({
    url: id ? `${updateEndpoint}/${id}` : updateEndpoint,
    method,
    onSuccess: onUpdateSuccess,
    onError: onUpdateError,
  });

  // Initialize form with fetched data
  useEffect(() => {
    if (fetchedData) {
      const initialFormData = {};
      inputs.forEach(input => {
        initialFormData[input.name] = fetchedData[input.name] || input.defaultValue || '';
      });
      setFormData(initialFormData);
      setInitialFormData(initialFormData);
    }
  }, [fetchedData, inputs]);

  // Track form changes
  useEffect(() => {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
    setIsDirty(hasChanges);
  }, [formData, initialFormData]);

  const validateField = (name, value) => {
    const rules = validationRules[name] || {};
    const fieldErrors = [];

    if (rules.required && !value) {
      fieldErrors.push('This field is required');
    }

    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`Minimum length is ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`Maximum length is ${rules.maxLength} characters`);
    }

    // if (rules.pattern && !rules.pattern.test(value)) {
    //   fieldErrors.push(rules.message || 'Invalid format');
    // }

    if (rules.custom && !rules.custom(value, formData)) {
      fieldErrors.push(rules.customMessage || 'Invalid value');
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    inputs.forEach(input => {
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
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const fieldErrors = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  };

  const handleInputBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const allTouched = {};
    inputs.forEach(input => {
      allTouched[input.name] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      await submit(formData);
      navigate(onSuccessRedirect);
    }
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-2xl',
    lg: 'max-w-4xl',
  };

  // Loading state
  if (fetchingLoading) {
    if (loadingComponent) return loadingComponent;
    return (
      <Card className={`w-full ${sizeClasses[size]} ${className}`} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-spin mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading form data...</p>
        </div>
      </Card>
    );
  }

  // Error state
  if (fetchingError) {
    if (errorComponent) return errorComponent;
    return (
      <Card className={`w-full ${sizeClasses[size]} ${className}`} theme={theme}>
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 dark:text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            {fetchingError}
          </p>
          <Button variant="primary" onClick={refetch} theme={theme}>
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`w-full ${sizeClasses[size]} ${className}`}
      theme={theme}
    >
      {/* Header */}
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
              Updated successfully!
            </p>
          </div>
        </div>
      )}

      {/* Update Error Message */}
      {updateError && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {updateError}
            </p>
          </div>
        </div>
      )}

      {/* Dirty State Indicator */}
      {isDirty && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            You have unsaved changes
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={
          layout === 'horizontal' 
            ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
            : 'space-y-4'
        }>
          {inputs.map((input) => (
            <FormInput
              key={input.name}
              {...input}
              value={formData[input.name] || ''}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              error={touched[input.name] ? errors[input.name] : []}
              theme={theme}
              layout={layout}
              disabled={input.disabled || updatingLoading}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            {showResetButton && isDirty && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={updatingLoading}
                theme={theme}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {resetButtonText}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {showCancelButton && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleCancel}
                disabled={updatingLoading}
                theme={theme}
              >
                {cancelButtonText}
              </Button>
            )}
            
            <Button
              type="submit"
              variant="primary"
              loading={updatingLoading}
              disabled={updatingLoading || !isDirty}
              theme={theme}
            >
              <Save className="h-4 w-4 mr-2" />
              {submitButtonText}
            </Button>
          </div>
        </div>
      </form>

      {/* Last Updated Info */}
      {fetchedData?.updatedAt && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">
          Last updated: {new Date(fetchedData.updatedAt).toLocaleString()}
        </div>
      )}
    </Card>
  );
};

export default ReusableEditForm;