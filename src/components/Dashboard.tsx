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
      <div className="relative">
        {/* Outer container with exact specifications */}
        <div 
          className="flex flex-col"
          style={{ 
            width: '1280px',
            height: '522px',
            gap: '16px',
            opacity: 1,
            position: 'absolute',
            top: '95px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          
          {/* Table container with exact specifications */}
          <div 
            className="bg-white rounded-lg"
            style={{ 
              width: '1280px', 
              height: '421px', 
              padding: '16px 24px 24px 24px',
              gap: '24px',
              borderRadius: '8px',
              boxShadow: '0px 1px 2px -1px #0000001A, 0px 1px 3px 0px #0000001A'
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <h1 
                style={{
                  width: '1232px',
                  height: '24px',
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: '24px',
                  lineHeight: '24px',
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
              <TimesheetTable 
                timesheets={timesheets} 
                onRefresh={loadTimesheets}
                onEdit={(timesheet) => handleOpenModal('edit', timesheet)}
              />
            )}
          </div>

          {/* Footer container */}
          <div 
            className="flex justify-center items-center bg-white rounded-lg"
            style={{ 
              width: '1280px',
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
      </div>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateTimesheet}
        timesheet={selectedTimesheet}
        mode={modalMode}
      />
    </div>
  );
} 