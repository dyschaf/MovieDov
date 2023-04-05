import React from 'react';

interface SubMenuProps {
  onSearchTypeChange: (type: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ onSearchTypeChange }) => {
  const handleSearchTypeChange = (type: string) => {
    onSearchTypeChange(type);
    
  };
  

  return (
    <div className="sub-menu">
      <h3>Search By:</h3>
      {/* <ul> */}
        {/* <li> */}
        <button name='movie' onClick={() => handleSearchTypeChange('movie')}>Movie</button>
        {/* <input type={"button"} onClick={() => handleSearchTypeChange('movie')}>Movies</input> */}
        {/* </li> */}
        {/* <li> */}
        <button onClick={() => handleSearchTypeChange('tv')}>Tv Shows</button>
        {/* </li> */}

      {/* </ul> */}
    </div>
  );
}
export {};
export default SubMenu;