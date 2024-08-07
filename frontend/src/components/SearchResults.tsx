import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSearchResults } from '../api';

const SearchResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [results, setResults] = useState<any[]>([]);

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

  return (
    <div>
      <h2>Search Results</h2>
      <ul>
        {results.map(result => (
          <li key={result.id}>
            <a href={result.jobUrl} target="_blank" rel="noopener noreferrer">
              {result.position} at {result.company} - {result.location}
            </a>
            <p>{result.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
