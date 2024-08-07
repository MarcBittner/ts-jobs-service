import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSearches, deleteSearch } from '../api';

const SearchList: React.FC = () => {
  const [searches, setSearches] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await getSearches();
        setSearches(response.data);
      } catch (error) {
        console.error("Error fetching searches:", error);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteSearch(id);
      setSearches(searches.filter(search => search.id !== id));
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

  return (
    <div>
      <h2>Configured Searches</h2>
      <ul>
        {searches.map(search => (
          <li key={search.id}>
            <Link to={`/searches/${search.id}/results`}>{search.keyword} - {search.location}</Link>
            <button onClick={() => handleDelete(search.id)}>Delete</button>
            <Link to={`/edit-search/${search.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
      <Link to="/new-search">Create New Search</Link>
    </div>
  );
};

export default SearchList;
