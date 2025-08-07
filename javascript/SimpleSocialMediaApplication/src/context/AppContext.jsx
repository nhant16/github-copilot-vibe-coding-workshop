import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('unknown'); // 'online', 'offline', 'unknown'

  const handleError = (error) => {
    console.error('App Error:', error);
    setError(error.message || 'An unexpected error occurred');
    
    // Check if it's a server connectivity issue
    if (error.message && error.message.includes('unavailable')) {
      setServerStatus('offline');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const setServerOnline = () => {
    setServerStatus('online');
    if (error && error.includes('unavailable')) {
      clearError();
    }
  };

  const setServerOffline = () => {
    setServerStatus('offline');
  };

  const value = {
    error,
    loading,
    serverStatus,
    setLoading,
    handleError,
    clearError,
    setServerOnline,
    setServerOffline,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
