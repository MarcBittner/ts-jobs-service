import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSearchResults } from '../api';
import './SearchResults.css';

const SearchResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getSearchResults(Number(id));
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
    fetchData();
  }, [id]);

  const handleSort = (field: string) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    setResults([...results].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    }));
  };

  const filteredResults = results.filter(result =>
    result.position.toLowerCase().includes(keyword.toLowerCase()) ||
    result.company.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div>
      <h2>Search Results</h2>
      <input
        type="text"
        placeholder="Filter by keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {filteredResults.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('position')}>Position</th>
              <th onClick={() => handleSort('company')}>Company</th>
              <th onClick={() => handleSort('location')}>Location</th>
              <th onClick={() => handleSort('date')}>Date</th>
              <th onClick={() => handleSort('salary')}>Salary</th>
              <th>Job URL</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map(result => (
              <tr key={result.id}>
                <td>{result.position}</td>
                <td>{result.company}</td>
                <td>{result.location}</td>
                <td>{result.date}</td>
                <td>{result.salary}</td>
                <td><a href={result.jobUrl} target="_blank" rel="noopener noreferrer">Link</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results yet</p>
      )}
    </div>
  );
};

export default SearchResults;
