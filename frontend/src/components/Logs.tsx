import React, { useState, useEffect } from 'react';
import './Logs.css';

const Logs: React.FC = () => {
  const [logType, setLogType] = useState<'application' | 'build'>('application');
  const [logs, setLogs] = useState<string>('');

  useEffect(() => {
    async function fetchLogs() {
      console.log(`Fetching ${logType} log`);
      try {
        const response = await fetch(`/logs/${logType}.log?cacheBust=${Date.now()}`);
        console.log(`Request URL: ${response.url}`);
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, response.headers);
        const contentType = response.headers.get('content-type');
        console.log(`Content-Type: ${contentType}`);
        if (response.ok && contentType && contentType.includes('text/plain')) {
          const text = await response.text();
          console.log(`Log content: ${text}`);
          setLogs(text);
        } else {
          console.log(`Failed to fetch log: ${response.statusText}`);
          setLogs('Log file not found.');
        }
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs('Error fetching logs.');
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
