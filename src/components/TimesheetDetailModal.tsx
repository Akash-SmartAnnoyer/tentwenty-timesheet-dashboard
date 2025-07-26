import { useState } from 'react';
import { TimesheetEntry } from '../types';

interface TimesheetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  timesheet: TimesheetEntry | null;
  mode: 'view' | 'update';
}

interface DailyTask {
  id: string;
  description: string;
  hours: number;
  project: string;
}

interface WeekData {
  [key: string]: DailyTask[];
}

export default function TimesheetDetailModal({ isOpen, onClose, timesheet, mode }: TimesheetDetailModalProps) {
  const [weekData, setWeekData] = useState<WeekData>({
    'Jan 21': [
      { id: '1', description: 'Homepage Development', hours: 4, project: 'Project Name' },
      { id: '2', description: 'Homepage Development', hours: 4, project: 'Project Name' }
    ],
    'Jan 22': [
      { id: '3', description: 'Homepage Development', hours: 4, project: 'Project Name' },
      { id: '4', description: 'Homepage Development', hours: 4, project: 'Project Name' }
    ],
    'Jan 23': [
      { id: '5', description: 'Homepage Development', hours: 4, project: 'Project Name' },
      { id: '6', description: 'Homepage Development', hours: 4, project: 'Project Name' }
    ],
    'Jan 24': [
      { id: '7', description: 'Homepage Development', hours: 4, project: 'Project Name' },
      { id: '8', description: 'Homepage Development', hours: 4, project: 'Project Name' }
    ],
    'Jan 25': [
      { id: '9', description: 'Homepage Development', hours: 4, project: 'Project Name' },
      { id: '10', description: 'Homepage Development', hours: 4, project: 'Project Name' }
    ]
  });

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const totalHours = Object.values(weekData).flat().reduce((sum, task) => sum + task.hours, 0);
  const completionPercentage = Math.min((totalHours / 40) * 100, 100);

  const handleAddTask = (day: string) => {
    const newTask: DailyTask = {
      id: Date.now().toString(),
      description: 'New Task',
      hours: 0,
      project: 'Project Name'
    };
    setWeekData(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), newTask]
    }));
  };

  const handleDeleteTask = (day: string, taskId: string) => {
    setWeekData(prev => ({
      ...prev,
      [day]: prev[day].filter(task => task.id !== taskId)
    }));
    setShowDropdown(null);
  };

  const handleEditTask = (taskId: string) => {
    setEditingTask(taskId);
    setShowDropdown(null);
  };

  const handleSaveTask = (day: string, taskId: string, field: keyof DailyTask, value: string | number) => {
    setWeekData(prev => ({
      ...prev,
      [day]: prev[day].map(task => 
        task.id === taskId ? { ...task, [field]: value } : task
      )
    }));
    setEditingTask(null);
  };

  if (!isOpen || !timesheet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                This week's timesheet
              </h2>
              <p className="text-gray-600 mt-1">21 - 26 January, 2024</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">{totalHours}/40 hrs</div>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{Math.round(completionPercentage)}% completion</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {Object.entries(weekData).map(([day, tasks]) => (
            <div key={day} className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">{day}</h3>
              
              {/* Existing Tasks */}
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex-1 flex items-center space-x-4">
                    <div className="flex-1">
                      {editingTask === task.id ? (
                        <input
                          type="text"
                          value={task.description}
                          onChange={(e) => handleSaveTask(day, task.id, 'description', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          autoFocus
                        />
                      ) : (
                        <span className="text-gray-900">{task.description}</span>
                      )}
                    </div>
                    <div className="w-16">
                      {editingTask === task.id ? (
                        <input
                          type="number"
                          value={task.hours}
                          onChange={(e) => handleSaveTask(day, task.id, 'hours', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                        />
                      ) : (
                        <span className="text-gray-600">{task.hours} hrs</span>
                      )}
                    </div>
                    <div className="w-24">
                      <span className="text-blue-600 text-sm">{task.project}</span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(showDropdown === task.id ? null : task.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                    
                    {showDropdown === task.id && (
                      <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleEditTask(task.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(day, task.id)}
                          className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add New Task Button */}
              <button
                onClick={() => handleAddTask(day)}
                className="w-full mt-2 p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                + Add new task
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {mode === 'view' ? 'Close' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
} 