import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSearch, updateSearch, getSearches } from '../api';

const SearchEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(0);
  const navigate = useNavigate(); // Updated variable name

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getSearches();
          const search = response.data.find((search: any) => search.id === Number(id));
          if (search) {
            setKeyword(search.keyword);
            setLocation(search.location);
            setRefreshInterval(search.refreshInterval);
          }
        } catch (error) {
          console.error("Error fetching search:", error);
        }
      };
      fetchData();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (id) {
        await updateSearch(Number(id), { keyword, location, refreshInterval });
      } else {
        await createSearch({ keyword, location, refreshInterval });
      }
      navigate('/'); // Use navigate function directly
    } catch (error) {
      console.error("Error saving search:", error);
    }
  };

  return (
    <div>
      <h2>{id ? 'Edit Search' : 'Create New Search'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Keyword:</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Refresh Interval (minutes):</label>
          <input
            type="number"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default SearchEdit;
