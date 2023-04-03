import React, { useState } from 'react';
import SubMenu from './SubMenu';

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState('movies');

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type);
  };

  const handleSearch = (query: string) => {
    // perform search based on the searchType and query
  };

  // }
  const requestOptions:any = {
    method: 'GET',
    redirect: 'follow'
  };
  
  fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${handleSearch}&page=1&include_adult=false`, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
  return (
    <div>
        
      <h1>Search</h1>
      <SubMenu onSearchTypeChange={handleSearchTypeChange} />
      <input type="text" onChange={(e) => handleSearch(e.target.value)} />
    </div>
  );
};

export default Search;
