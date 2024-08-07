import React, { useState, useEffect } from 'react';
import './Logs.css';

const Logs: React.FC = () => {
  const [logType, setLogType] = useState<'application' | 'build'>('application');
  const [logs, setLogs] = useState<string>('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch(`/logs/${logType}.log`);
        const text = await response.text();
        setLogs(text);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    }
    fetchLogs();
  }, [logType]);

  return (
    <div>
      <h2>Logs</h2>
      <div>
        <button onClick={() => setLogType('application')}>Application Log</button>
        <button onClick={() => setLogType('build')}>Build Log</button>
      </div>
      <pre>{logs}</pre>
    </div>
  );
};

export default Logs;
