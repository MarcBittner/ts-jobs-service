import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchList from './components/SearchList';
import SearchEdit from './components/SearchEdit';
import SearchResults from './components/SearchResults';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchList />} />
        <Route path="/new-search" element={<SearchEdit />} />
        <Route path="/edit-search/:id" element={<SearchEdit />} />
        <Route path="/searches/:id/results" element={<SearchResults />} />
      </Routes>
    </Router>
  );
};

export default App;
