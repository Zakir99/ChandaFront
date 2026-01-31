// components/death-supports/DeathSupportEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  AlertCircle,
  User,
  Home,
  DollarSign,
  FileText,
  RefreshCw
} from 'lucide-react';

const DeathSupportEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    family_id: '',
    deceased_name: '',
    death_type: 'local',
    relationship: '',
    amount_per_member: '',
    paid_at: '',
    recorded_by: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing record
    setTimeout(() => {
      const mockRecord = {
        family_id: '101',
        deceased_name: 'John Doe',
        death_type: 'local',
        relationship: '',
        amount_per_member: '100.50',
        paid_at: '2024-01-15T10:30',
        recorded_by: '1',
        notes: 'First payment for local death support'
      };
      setFormData(mockRecord);
      setLoading(false);
    }, 300);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.family_id.trim()) newErrors.family_id = 'Family ID is required';
    if (!formData.deceased_name.trim()) newErrors.deceased_name = 'Deceased name is required';
    if (formData.death_type === 'external' && !formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required for external deaths';
    }
    if (!formData.amount_per_member || parseFloat(formData.amount_per_member) <= 0) {
      newErrors.amount_per_member = 'Valid amount is required';
    }
    if (!formData.recorded_by.trim()) newErrors.recorded_by = 'Recorded by is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form updated:', formData);
      setSubmitting(false);
      navigate(`/death-supports/${id}`);
    }, 1000);
  };

  const handleReset = () => {
    // Reset form to original values
    // In real app, you would re-fetch the data
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/death-supports/${id}`)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to View
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8 bg-linear-to-r from-yellow-600 to-yellow-800">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Edit Death Support Record
          </h1>
          <p className="text-yellow-100 mt-2">
            Update the details for record #{id}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Family ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <Home size={16} className="mr-1" />
                      Family ID *
                    </span>
                  </label>
                  <input
                    type="number"
                    name="family_id"
                    value={formData.family_id}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.family_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.family_id && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.family_id}
                    </p>
                  )}
                </div>

                {/* Deceased Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <User size={16} className="mr-1" />
                      Deceased Name *
                    </span>
                  </label>
                  <input
                    type="text"
                    name="deceased_name"
                    value={formData.deceased_name}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.deceased_name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.deceased_name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.deceased_name}
                    </p>
                  )}
                </div>

                {/* Death Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Death Type *
                  </label>
                  <select
                    name="death_type"
                    value={formData.death_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="local">Local</option>
                    <option value="external">External</option>
                  </select>
                </div>

                {/* Relationship (required for external) */}
                {formData.death_type === 'external' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.relationship ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Cousin, Friend, etc."
                    />
                    {errors.relationship && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {errors.relationship}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Financial Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Financial Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount per Member */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <span className="flex items-center">
                      <DollarSign size={16} className="mr-1" />
                      Amount per Member *
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="amount_per_member"
                      value={formData.amount_per_member}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                        errors.amount_per_member ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.amount_per_member && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.amount_per_member}
                    </p>
                  )}
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="paid_at"
                    value={formData.paid_at}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

                {/* Recorded By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recorded By *
                  </label>
                  <input
                    type="number"
                    name="recorded_by"
                    value={formData.recorded_by}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      errors.recorded_by ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.recorded_by && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={14} className="mr-1" />
                      {errors.recorded_by}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Additional Information
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    Notes (Optional)
                  </span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Enter any additional notes or comments..."
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t">
              <div className="flex space-x-3 mb-4 sm:mb-0">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/death-supports/${id}`)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-30"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Update Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeathSupportEdit;