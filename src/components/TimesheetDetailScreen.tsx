import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { api } from '../lib/api';
import { TimesheetEntry } from '../types';
import Header from './Header';
import TimesheetModal from './TimesheetModal';

interface DailyTask {
  id: string;
  description: string;
  hours: number;
  project: string;
}

interface WeekData {
  [key: string]: DailyTask[];
}

export default function TimesheetDetailScreen() {
  const { weekId } = useParams<{ weekId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [timesheet, setTimesheet] = useState<TimesheetEntry | null>(null);
  const [loading, setLoading] = useState(true);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<string | null>(null);
  const [editingTaskData, setEditingTaskData] = useState<{ day: string; task: DailyTask } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (weekId) {
      loadTimesheet();
    }
  }, [weekId]);

  const loadTimesheet = async () => {
    try {
      setLoading(true);
      const response = await api.getTimesheets();
      const foundTimesheet = response.data.find((t: TimesheetEntry) => t.id === weekId);
      setTimesheet(foundTimesheet || null);
    } catch (error) {
      console.error('Error loading timesheet:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleEditTask = (day: string, task: DailyTask) => {
    setEditingTaskData({ day, task });
    setIsEditMode(true);
    setIsModalOpen(true);
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

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleOpenAddTaskModal = (day: string) => {
    setModalDay(day);
    setIsEditMode(false);
    setEditingTaskData(null);
    setIsModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsModalOpen(false);
    setModalDay(null);
    setIsEditMode(false);
    setEditingTaskData(null);
  };

  const handleSubmitAddTask = async (data: any) => {
    if (isEditMode && editingTaskData) {
      // Update existing task
      setWeekData(prev => ({
        ...prev,
        [editingTaskData.day]: prev[editingTaskData.day].map(task => 
          task.id === editingTaskData.task.id 
            ? { 
                ...task, 
                description: data.description || '',
                hours: data.hours || 0,
                project: data.project || 'Project Name',
              }
            : task
        )
      }));
    } else if (modalDay) {
      // Add new task
      const newTask = {
        id: Date.now().toString(),
        description: data.description || '',
        hours: data.hours || 0,
        project: data.project || 'Project Name',
      };
      setWeekData(prev => ({
        ...prev,
        [modalDay]: [...(prev[modalDay] || []), newTask]
      }));
    }
    handleCloseAddTaskModal();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!timesheet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Timesheet not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      {/* Main Content */}
      <div className="w-full px-4 lg:px-0 lg:w-4/5 xl:w-3/5 mx-auto py-8">
        {/* Single Content Section with Header Integrated */}
        <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-2 gap-4">
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                This week's timesheet
              </h1>
              <div className="text-left lg:text-right">
                <div className="relative">
                  <div className="text-sm text-gray-600 bg-white px-2 py-1 rounded border border-gray-200 inline-block relative">
                    {totalHours}/40 hrs
                    {/* Down arrow pointing from the bottom */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200" style={{ marginTop: '-1px' }}></div>
                  </div>
                </div>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-3">
                  <div 
                    className="h-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{Math.round(completionPercentage)}% completion</div>
              </div>
            </div>
            <p 
              className="text-left"
              style={{
                fontFamily: 'Inter',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '150%',
                letterSpacing: '0%',
                color: '#6B7280'
              }}
            >
              21 - 26 January, 2024
            </p>
          </div>

          {/* Two-column layout for days and tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-0">
            {Object.entries(weekData).map(([day, tasks]) => (
              <>
                {/* Date column */}
                <div className="col-span-1 lg:col-span-2 flex items-start pt-2 min-h-[48px]" key={day + '-date'}>
                  <span 
                    className="text-base lg:text-lg"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 600,
                      lineHeight: '150%',
                      letterSpacing: '0%',
                      color: '#374151'
                    }}
                  >
                    {day}
                  </span>
                </div>
                {/* Tasks column */}
                <div className="col-span-1 lg:col-span-10 flex flex-col gap-2" key={day + '-tasks'}>
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between py-1.5 px-3 mb-2 border border-gray-200 rounded-md bg-white">
                      <div className="flex-1 flex items-center flex-wrap gap-2" style={{ gap: '0px' }}>
                        <div className="flex-1 min-w-0">
                          {editingTask === task.id ? (
                            <input
                              type="text"
                              value={task.description}
                              onChange={(e) => handleSaveTask(day, task.id, 'description', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="text-gray-900 text-sm lg:text-base break-words"
                              style={{
                                fontFamily: 'Inter',
                                fontWeight: 500,
                                lineHeight: '150%',
                                letterSpacing: '0%',
                                color: '#111928'
                              }}
                            >
                              {task.description}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 pr-0">
                            {editingTask === task.id ? (
                              <input
                                type="number"
                                value={task.hours}
                                onChange={(e) => handleSaveTask(day, task.id, 'hours', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            ) : (
                              <span 
                                className="text-xs lg:text-sm"
                                style={{
                                  fontFamily: 'Inter',
                                  fontWeight: 400,
                                  fontStyle: 'Regular',
                                  lineHeight: '125%',
                                  letterSpacing: '0%',
                                  color: '#9CA3AF'
                                }}
                              >
                                {task.hours}hrs
                              </span>
                            )}
                          </div>
                          <div className="w-20 lg:w-24">
                            <span className="inline-flex px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-800">
                              {task.project}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="relative ml-2">
                        <button
                          onClick={() => setShowDropdown(showDropdown === task.id ? null : task.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                        {showDropdown === task.id && (
                          <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <button
                              onClick={() => handleEditTask(day, task)}
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
                  {/* Add New Task Button - Only one per day */}
                  <button
                    onClick={() => handleOpenAddTaskModal(day)}
                    className="w-full mt-2 mb-4 flex items-center justify-center transition-all duration-200"
                    style={{
                      height: '44px',
                      gap: '8px',
                      padding: '4px',
                      borderRadius: '8px',
                      border: '1px dashed #D1D5DB',
                      background: 'transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#E1EFFE';
                      e.currentTarget.style.border = '1px dashed #1A56DB';
                      const svg = e.currentTarget.querySelector('svg') as SVGElement;
                      const span = e.currentTarget.querySelector('span') as HTMLElement;
                      if (svg) svg.style.color = '#1A56DB';
                      if (span) span.style.color = '#1A56DB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.border = '1px dashed #D1D5DB';
                      const svg = e.currentTarget.querySelector('svg') as SVGElement;
                      const span = e.currentTarget.querySelector('span') as HTMLElement;
                      if (svg) svg.style.color = '#6B7280';
                      if (span) span.style.color = '#6B7280';
                    }}
                  >
                    <svg 
                      className="text-gray-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ width: '14px', height: '14px' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span 
                      className="text-gray-500 text-sm lg:text-base"
                      style={{
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        lineHeight: '150%',
                        letterSpacing: '0%',
                        verticalAlign: 'middle'
                      }}
                    >
                      Add new task
                    </span>
                  </button>
                </div>
              </>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>

        {/* Footer container - same as dashboard */}
        <div 
          className="flex justify-center items-center bg-white rounded-lg mt-8 w-full"
          style={{ 
            height: '85px',
            gap: '32px',
            opacity: 1,
            padding: '8px',
            borderRadius: '8px',
            boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A'
          }}
        >
          <footer className="text-center text-gray-500 text-sm">
            © 2024 tentwenty. All rights reserved.
          </footer>
        </div>
      </div>
      <TimesheetModal
        isOpen={isModalOpen}
        onClose={handleCloseAddTaskModal}
        onSubmit={handleSubmitAddTask}
        mode={isEditMode ? 'edit' : 'create'}
        initialData={editingTaskData ? {
          day: editingTaskData.day,
          task: editingTaskData.task
        } : undefined}
      />
    </div>
  );
}