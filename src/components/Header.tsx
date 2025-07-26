import { useState } from 'react';
import { useAuth } from '../lib/auth';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header 
      className="bg-white w-full shadow-sm"
      style={{
        width: '100%',
        height: '68px',
        padding: '0',
        gap: '0',
        opacity: 1
      }}
    >
      <div 
        className="flex justify-between items-center w-full"
        style={{
          width: '100%',
          height: '68px',
          padding: '4px',
          gap: '32px',
          opacity: 1,
          background: '#FFFFFF'
        }}
      >
        <div 
          className="flex items-center"
          style={{
            gap: '16px',
            opacity: 1
          }}
        >
          <h1 
            style={{
              fontFamily: 'Inter',
              fontWeight: 600,
              fontSize: '24px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#111928',
              margin: 0,
              paddingLeft: '16px'
            }}
          >
            ticktock
          </h1>
          <span 
            style={{
              fontFamily: 'Inter',
              fontWeight: 500,
              fontSize: '14px',
              lineHeight: '150%',
              letterSpacing: '0%',
              color: '#111928',
              margin: 0,
              paddingLeft: '24px'
            }}
          >
            Timesheets
          </span>
        </div>
        
        <div 
          className="flex items-center justify-end relative"
          style={{
            width: '686.5px',
            height: '24px',
            padding: '0 12px 0 24px',
            gap: '16px',
            opacity: 1
          }}
        >
          <div 
            className="text-sm text-gray-700 flex items-center cursor-pointer hover:text-gray-900"
            onClick={toggleDropdown}
          >
            {user?.name || 'User'}
            <svg 
              className={`w-4 h-4 ml-1 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 