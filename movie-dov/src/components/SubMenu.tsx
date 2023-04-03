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
      <ul>
        <li onClick={() => handleSearchTypeChange('movie')}>Movies</li>
        <li onClick={() => handleSearchTypeChange('tv')}>TV Shows</li>
      </ul>
    </div>
  );
}
export {};
export default SubMenu;