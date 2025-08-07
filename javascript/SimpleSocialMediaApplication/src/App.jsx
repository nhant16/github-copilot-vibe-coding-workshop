import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import ServerStatus from './components/common/ServerStatus';
import ErrorDisplay from './components/common/ErrorDisplay';
import CreatePostForm from './components/posts/CreatePostForm';
import PostsList from './components/posts/PostsList';
import { useApp } from './context/AppContext';
import './App.css';

const AppContent = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { error, clearError } = useApp();

  const handlePostCreated = () => {
    // Trigger a refresh of the posts list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Simple Social Media Application</h1>
        <ServerStatus />
      </header>

      <main className="app-main">
        <ErrorDisplay error={error} onDismiss={clearError} />
        
        <div className="app-content">
          <section className="create-post-section">
            <CreatePostForm onPostCreated={handlePostCreated} />
          </section>

          <section className="posts-section">
            <PostsList refreshTrigger={refreshTrigger} />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with React and Vite • Backend API: http://localhost:8000</p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
