// SourceScroll.tsx
import React, { useRef } from 'react';

interface SourceScrollerProps {
  links: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  searchType: string; // "movie" | "tv"
}

const SourceScroller: React.FC<SourceScrollerProps> = ({
  links,
  selectedIndex,
  onSelect,
//   setSelectedIndex,
  searchType,
}) => {
  const listRefMobile = useRef<HTMLDivElement>(null);
  const listRefDesktop = useRef<HTMLUListElement>(null);
  const isMobile = window.innerWidth <= 768;

  const scrollBy = (amount: number, axis: 'horizontal' | 'vertical') => {
    const ref = isMobile ? listRefMobile.current : listRefDesktop.current;
    if (!ref) return;

    if (axis === 'horizontal') {
      ref.scrollBy({ left: amount, behavior: 'smooth' });
    } else {
      ref.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  const activeColor = searchType === "tv" ? "#00aaff" : "#e600ff"; // תואם לכפתור TV או Movie

  return (
    <div className="source-scroll-wrapper">
      {!isMobile ? (
        // Desktop view
        <>
        <div className="source-list-movie-div">
        <div className="source-list-movie-div-div">
          <button className="scroll-arrow up" onClick={() => scrollBy(-60, 'vertical')}>▲</button>
          <ul className="source-list-movie-ul" ref={listRefDesktop}>
            {links.map((_, index) => (
              <li key={index} className="source-list-movie">
                <button
                  onClick={() => onSelect(index)}
                  className={selectedIndex === index ? 'active' : ''}
                  style={{ backgroundColor: selectedIndex === index ? activeColor : undefined }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
          <button className="scroll-arrow down" onClick={() => scrollBy(60, 'vertical')}>▼</button>
          </div>
          </div>
        </>
      ) : (
        // Mobile view
        <>
        <div className="source-list-movie-div">
        <div className="source-list-movie-div-div">
          <button className="scroll-arrow left" onClick={() => scrollBy(-100, 'horizontal')}>&lt;</button>
          <div className="source-scroll-mobile" ref={listRefMobile}>
            {links.map((_, index) => (
              <button
                key={index}
                onClick={() => onSelect(index)}
                className={`source-button ${selectedIndex === index ? 'active' : ''}`}
                style={{ backgroundColor: selectedIndex === index ? activeColor : undefined }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button className="scroll-arrow right" onClick={() => scrollBy(100, 'horizontal')}>&gt;</button>
          </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SourceScroller;
