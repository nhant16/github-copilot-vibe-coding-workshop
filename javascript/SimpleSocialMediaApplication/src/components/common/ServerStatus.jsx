import { useApp } from '../../context/AppContext';

const ServerStatus = () => {
  const { serverStatus } = useApp();

  if (serverStatus === 'unknown') return null;

  return (
    <div className={`server-status-indicator ${serverStatus}`}>
      <span className={`status-dot ${serverStatus}`}></span>
      <span className="status-text">
        Backend: {serverStatus === 'online' ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export default ServerStatus;
