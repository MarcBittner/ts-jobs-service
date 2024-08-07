import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchList from './components/SearchList';
import SearchEdit from './components/SearchEdit';
import SearchResults from './components/SearchResults';
import Logs from './components/Logs';
import './App.css';

const appName = process.env.REACT_APP_NAME || 'MyApp';
const frontendVersion = process.env.REACT_APP_VERSION || '1.0';

const App: React.FC = () => {
  const [backendVersion, setBackendVersion] = useState<string>('');

  // Fetch backend version
  useEffect(() => {
    async function fetchBackendVersion() {
      try {
        const response = await fetch('/api/version');
        const data = await response.json();
        setBackendVersion(data.version || 'Unknown');
      } catch (error) {
        console.error('Error fetching backend version:', error);
      }
    }

    fetchBackendVersion();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>{appName}</h1>
          <div className="versions">
            <small>Frontend v{frontendVersion}</small>
            <small>Backend v{backendVersion}</small>
          </div>
          <nav>
            <ul>
              <li><Link to="/">Searches</Link></li>
              <li><Link to="/config">Config</Link></li>
              <li><Link to="/logs">Logs</Link></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<SearchList />} />
            <Route path="/new-search" element={<SearchEdit />} />
            <Route path="/edit-search/:id" element={<SearchEdit />} />
            <Route path="/searches/:id/results" element={<SearchResults />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/config" element={<div>Config section is not implemented yet.</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
