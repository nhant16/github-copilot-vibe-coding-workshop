import { useApp } from '../../context/AppContext';

const ErrorDisplay = ({ error, onDismiss }) => {
  const { serverStatus } = useApp();

  if (!error) return null;

  const isServerError = error.includes('unavailable') || serverStatus === 'offline';

  return (
    <div className={`error-display ${isServerError ? 'server-error' : 'general-error'}`}>
      <div className="error-content">
        {isServerError && (
          <div className="server-status">
            <span className="status-indicator offline"></span>
            Backend server is offline
          </div>
        )}
        <p className="error-message">{error}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="dismiss-button">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
