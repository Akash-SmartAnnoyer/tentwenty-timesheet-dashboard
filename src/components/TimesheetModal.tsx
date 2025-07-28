import { useState, useEffect } from 'react';
import { TimesheetEntry, CreateTimesheetEntry } from '../types';

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  mode?: 'create' | 'edit';
  initialData?: {
    day: string;
    task: {
      id: string;
      description: string;
      hours: number;
      project: string;
    };
  };
}

const PROJECTS = [
  { value: '', label: 'Project Name' },
  { value: 'project1', label: 'Project Alpha' },
  { value: 'project2', label: 'Project Beta' },
];
const WORK_TYPES = [
  { value: '', label: 'Type of Work' },
  { value: 'bug', label: 'Bug fixes' },
  { value: 'feature', label: 'Feature development' },
  { value: 'review', label: 'Code review' },
];

export default function TimesheetModal({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialData
}: TimesheetModalProps) {
  const [formData, setFormData] = useState({
    project: '',
    workType: '',
    description: '',
    hours: 0
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        // Pre-fill form with existing task data
        setFormData({
          project: initialData.task.project,
          workType: 'Development', // Default value since we don't store workType
          description: initialData.task.description,
          hours: initialData.task.hours
        });
      } else {
        // Reset form for create mode
        setFormData({
          project: '',
          workType: '',
          description: '',
          hours: 0
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, initialData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.project) newErrors.project = 'Project is required';
    if (!formData.workType) newErrors.workType = 'Type of work is required';
    if (!formData.description) newErrors.description = 'Task description is required';
    if (!formData.hours || formData.hours <= 0 || formData.hours > 24) newErrors.hours = 'Hours must be between 1 and 24';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({
        project: '',
        workType: '',
        description: '',
        hours: 0
      });
      setErrors({});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleHoursChange = (delta: number) => {
    setFormData((prev: any) => ({ ...prev, hours: Math.max(0, (prev.hours || 0) + delta) }));
    if (errors.hours) setErrors((prev) => ({ ...prev, hours: '' }));
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl" style={{ maxWidth: '646px' }}>
          <div className="flex justify-between items-center px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-gray-100">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
              {mode === 'edit' ? 'Update Entry' : 'Add New Entry'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>
          <form onSubmit={handleSubmit} className="px-4 sm:px-6 pt-4 pb-6">
            {/* Project Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Select Project <span style={{ color: '#111928' }}>*</span>
                <span className="ml-1 text-gray-400 cursor-pointer" title="Select the project for this entry.">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#A0AEC0" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#A0AEC0">i</text></svg>
                </span>
              </label>
              <select
                className={`w-full rounded-lg border border-gray-200 px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.project ? 'border-red-500' : ''}`}
                value={formData.project}
                onChange={e => handleChange('project', e.target.value)}
              >
                {PROJECTS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.project && <p className="text-red-500 text-xs mt-1">{errors.project}</p>}
            </div>
            {/* Type of Work Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                Type of Work <span style={{ color: '#111928' }}>*</span>
                <span className="ml-1 text-gray-400 cursor-pointer" title="Select the type of work.">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#A0AEC0" strokeWidth="2"/><text x="12" y="16" textAnchor="middle" fontSize="12" fill="#A0AEC0">i</text></svg>
                </span>
              </label>
              <select
                className={`w-full rounded-lg border border-gray-200 px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.workType ? 'border-red-500' : ''}`}
                value={formData.workType}
                onChange={e => handleChange('workType', e.target.value)}
              >
                {WORK_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              {errors.workType && <p className="text-red-500 text-xs mt-1">{errors.workType}</p>}
            </div>
            {/* Task Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task description <span style={{ color: '#111928' }}>*</span>
              </label>
              <textarea
                className={`w-full rounded-lg border border-gray-200 px-3 py-2 mt-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${errors.description ? 'border-red-500' : ''}`}
                rows={5}
                placeholder="Write text here ..."
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
              />
              <div style={{ color: '#9CA3AF', fontSize: '13px', marginTop: '4px' }}>A note for extra info</div>
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>
            {/* Hours Stepper */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hours <span style={{ color: '#111928' }}>*</span>
              </label>
              <div className="flex items-center" style={{ width: '113px', height: '37px' }}>
                <button
                  type="button"
                  onClick={() => handleHoursChange(-1)}
                  className="w-1/3 h-full rounded-l-lg border border-gray-200 flex items-center justify-center text-lg text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                  style={{ height: '37px', width: '37px', borderRight: 'none' }}
                >
                  -
                </button>
                <input
                  type="number"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={e => handleChange('hours', parseInt(e.target.value) || 0)}
                  className="h-full text-center border-t border-b border-l border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ width: '39px', height: '37px', borderRadius: 0, borderLeft: '1px solid #D1D5DB', borderRight: '1px solid #D1D5DB' }}
                />
                <button
                  type="button"
                  onClick={() => handleHoursChange(1)}
                  className="w-1/3 h-full rounded-r-lg border border-gray-200 flex items-center justify-center text-lg text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
                  style={{ height: '37px', width: '37px', borderLeft: 'none' }}
                >
                  +
                </button>
              </div>
              {errors.hours && <p className="text-red-500 text-xs mt-1">{errors.hours}</p>}
            </div>
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                type="submit"
                className="w-full sm:w-auto"
                style={{
                  height: '37px',
                  borderRadius: '8px',
                  gap: '8px',
                  padding: '2.5px 5px',
                  background: '#1C64F2',
                  color: '#fff',
                  fontFamily: 'Inter',
                  fontWeight: 500,
                  fontSize: '15px',
                  lineHeight: '150%',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
                disabled={isSubmitting}
              >
                {mode === 'edit' ? 'Update entry' : 'Add entry'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto"
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  gap: '8px',
                  padding: '2.5px 5px',
                  background: '#fff',
                  color: '#374151',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '150%'
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
} 