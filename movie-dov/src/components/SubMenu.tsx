import React, { useState } from 'react';
// import './SubMenu.css'; // Import the styles

interface SubMenuProps {
  onSearchTypeChange: (type: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ onSearchTypeChange }) => {
  const [activeType, setActiveType] = useState<'movie' | 'tv'>('movie');

  const handleSearchTypeChange = (type: 'movie' | 'tv') => {
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
