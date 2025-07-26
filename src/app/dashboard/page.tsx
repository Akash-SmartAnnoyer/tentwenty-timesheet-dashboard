'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { TimesheetEntry, CreateTimesheetEntry } from '@/types';
import TimesheetTable from '@/components/TimesheetTable';
import TimesheetModal from '@/components/TimesheetModal';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTimesheet, setSelectedTimesheet] = useState<TimesheetEntry | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadTimesheets();
    }
  }, [isAuthenticated]);

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

  const handleCreateTimesheet = async (data: CreateTimesheetEntry) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Timesheet Dashboard</h1>
            <button 
              className="btn-primary"
              onClick={() => handleOpenModal('create')}
            >
              Add New Entry
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <TimesheetTable 
              timesheets={timesheets} 
              onRefresh={loadTimesheets}
              onEdit={(timesheet) => handleOpenModal('edit', timesheet)}
            />
          )}
        </div>
      </main>

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