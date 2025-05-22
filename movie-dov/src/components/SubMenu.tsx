import React from 'react';

interface SubMenuProps {
  onSearchTypeChange: (type: string) => void;
  searchType: string;
  setSearchType: (type: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ onSearchTypeChange, searchType, setSearchType }) => {
  const handleSearchTypeChange = (type: 'movie' | 'tv'| 'anime') => {
    setSearchType(type);
    onSearchTypeChange(type);
  };

  return (
    <>
      <button
        className={`type-button ${searchType === 'movie' ? 'active movie' : ''}`}
        onClick={() => handleSearchTypeChange('movie')}
      >
        Movie
      </button>

      <button
        className={`type-button ${searchType === 'tv' ? 'active tv' : ''}`}
        onClick={() => handleSearchTypeChange('tv')}
      >
        TV Show
      </button>
      {/* <button
        className={`type-button ${searchType === 'anime' ? 'active anime' : ''}`}
        onClick={() => handleSearchTypeChange('anime')}
      >
        Anime
      </button> */}
    </>
  );
};

export default SubMenu;
