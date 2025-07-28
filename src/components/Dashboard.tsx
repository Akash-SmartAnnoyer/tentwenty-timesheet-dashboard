import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { TimesheetEntry } from '../types';
import Header from './Header';
import TimesheetTable from './TimesheetTable';
import TimesheetModal from './TimesheetModal';
import { api } from '../lib/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetEntry | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadTimesheets();
  }, []);

  const loadTimesheets = async () => {
    try {
      setLoading(true);
      const response = await api.getTimesheets();
      setTimesheets(response.data);
    } catch (error) {
      setError('Failed to load timesheets');
      console.error('Error loading timesheets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTimesheet = async (data: any) => {
    try {
      await api.createTimesheet(data);
      await loadTimesheets();
    } catch (error) {
      setError('Failed to create timesheet');
      console.error('Error creating timesheet:', error);
    }
  };

  const handleOpenModal = (mode: 'create' | 'edit', timesheet?: TimesheetEntry) => {
    setModalMode(mode);
    setSelectedTimesheet(timesheet || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTimesheet(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      {/* Main content area */}
      <div className="relative px-4 lg:px-0">
        {/* Outer container with responsive specifications */}
        <div 
          className="flex flex-col w-full max-w-7xl mx-auto"
          style={{ 
            gap: '16px',
            opacity: 1,
            marginTop: '95px'
          }}
        >
          
          {/* Table container with responsive specifications */}
          <div 
            className="bg-white rounded-lg w-full"
            style={{ 
              padding: '16px 24px 24px 24px',
              gap: '24px',
              borderRadius: '8px',
              boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A'
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 
                className="w-full"
                style={{
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: 'clamp(20px, 4vw, 24px)',
                  lineHeight: '1',
                  letterSpacing: '0%',
                  color: '#111928',
                  margin: 0,
                  padding: 0
                }}
              >
                Your Timesheets
              </h1>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <TimesheetTable 
                  timesheets={timesheets} 
                  onRefresh={loadTimesheets}
                  onEdit={(timesheet) => handleOpenModal('edit', timesheet)}
                />
              </div>
            )}
          </div>

          {/* Footer container */}
          <div 
            className="flex justify-center items-center bg-white rounded-lg w-full"
            style={{ 
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
      </div>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateTimesheet}
        initialData={selectedTimesheet ? { 
          day: '', 
          task: { 
            id: selectedTimesheet.id, 
            description: selectedTimesheet.description || '', 
            hours: selectedTimesheet.hours, 
            project: 'Project A' 
          } 
        } : undefined}
        mode={modalMode}
      />
    </div>
  );
} 