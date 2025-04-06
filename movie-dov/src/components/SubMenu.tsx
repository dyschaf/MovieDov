import React, { useState } from 'react';
// import './SubMenu.css'; // Import the styles

interface SubMenuProps {
  onSearchTypeChange: (type: string) => void;
  searchType: string; // ✅ Add this line
  setSearchType: (type: string) => void;
  
};

const SubMenu: React.FC<SubMenuProps> = ({onSearchTypeChange, searchType, setSearchType}) => {
  const [activeType, setActiveType] = useState<'movie' | 'tv'>('movie');

  const handleSearchTypeChange = (type: 'movie' | 'tv') => {
    setSearchType(type);
    setActiveType(type);
    onSearchTypeChange(type);
  };

  return (
    <>
            <button
          className={`type-button ${activeType === 'movie' ? 'active movie' : ''}`}
          onClick={() => handleSearchTypeChange('movie')}
        >
          Movie
        </button>

        <button
          className={`type-button ${activeType === 'tv' ? 'active tv' : ''}`}
          onClick={() => handleSearchTypeChange('tv')}
        >
          TV Show
        </button>


      
    </>
  );
};

export default SubMenu;
