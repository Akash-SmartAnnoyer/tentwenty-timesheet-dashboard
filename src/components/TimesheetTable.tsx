import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TimesheetEntry } from '../types';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { api } from '../lib/api';

interface TimesheetTableProps {
  timesheets: TimesheetEntry[];
  onRefresh: () => void;
  onEdit?: (timesheet: TimesheetEntry) => void;
}

export default function TimesheetTable({ timesheets, onRefresh, onEdit }: TimesheetTableProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'incomplete':
        return 'bg-yellow-100 text-yellow-800';
      case 'missing':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionButton = (status: string, timesheet: TimesheetEntry) => {
    switch (status) {
      case 'completed':
        return (
          <button 
            onClick={() => navigate(`/timesheet/${timesheet.id}`)}
            className="text-blue-600 hover:text-blue-900"
          >
            View
          </button>
        );
      case 'incomplete':
        return (
          <button 
            onClick={() => navigate(`/timesheet/${timesheet.id}`)}
            className="text-blue-600 hover:text-blue-900"
          >
            Update
          </button>
        );
      case 'missing':
        return (
          <button 
            onClick={() => onEdit && onEdit(timesheet)}
            className="text-blue-600 hover:text-blue-900"
          >
            Create
          </button>
        );
      default:
        return null;
    }
  };

  const handleEdit = (timesheet: TimesheetEntry) => {
    if (onEdit) {
      onEdit(timesheet);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTimesheet(id);
      onRefresh();
    } catch (error) {
      console.error('Error deleting timesheet:', error);
    }
  };

  if (timesheets.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-gray-500 text-lg">No timesheet entries found.</p>
        <p className="text-gray-400 text-sm mt-2">Create your first timesheet entry to get started.</p>
      </div>
    );
  }

  return (
    <div 
      className="overflow-hidden rounded-lg w-full"
      style={{
        opacity: 1,
        borderRadius: '8px',
        background: '#FFFFFF',
        boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A'
      }}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">WEEK #</span>
                <span className="sm:hidden">WK</span>
              </th>
              <th className="px-2 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="hidden sm:inline">DATE</span>
                <span className="sm:hidden">DATE</span>
              </th>
              <th className="px-2 sm:px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-2 sm:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timesheets.map((timesheet) => (
              <tr key={timesheet.id} className="hover:bg-gray-50">
                <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-500">
                  {timesheet.weekNumber}
                </td>
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                  <span className="hidden sm:inline">
                    {(() => {
                      const date = new Date(timesheet.date);
                      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
                      return `${format(weekStart, 'd')} - ${format(weekEnd, 'd MMMM, yyyy')}`;
                    })()}
                  </span>
                  <span className="sm:hidden">
                    {(() => {
                      const date = new Date(timesheet.date);
                      const weekStart = startOfWeek(date, { weekStartsOn: 1 });
                      const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
                      return `${format(weekStart, 'd')} - ${format(weekEnd, 'd MMM')}`;
                    })()}
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap text-center">
                  <span className={`inline-flex px-2 sm:px-3 py-1 text-xs rounded-full ${getStatusColor(timesheet.status)}`}>
                    <span className="hidden sm:inline">{timesheet.status.toUpperCase()}</span>
                    <span className="sm:hidden">{timesheet.status.charAt(0).toUpperCase()}</span>
                  </span>
                </td>
                <td className="px-2 sm:px-6 py-3 whitespace-nowrap text-sm text-right">
                  {getActionButton(timesheet.status, timesheet)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 