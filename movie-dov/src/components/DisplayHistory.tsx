import React, { useEffect, useState } from 'react';
interface DisplayHistoryProps {
  historySelect: any;  // Define the correct type for historySelect
  setHistorySelect: React.Dispatch<React.SetStateAction<any>>;  // Define the correct type for setHistorySelect
}
// const DisplayHistory = () => {
const DisplayHistory : React.FC<DisplayHistoryProps> = ({ historySelect, setHistorySelect }) => {
  // console.log(2)
  // ✅ Correct: Hooks are inside the function component
  const [tvShowHistory, setTvShowHistory] = useState<any[]>([]);
  const [movieHistory, setMovieHistory] = useState<any[]>([]);

  const handleClick = (item: any) => {
    setHistorySelect(null)
    // console.log(item)
    setHistorySelect(item); // Set selected history item to the state

  };
  useEffect(() => {
    setTvShowHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
    setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTvShowHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
      setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
    }, 100); // Set interval to check every 1000ms (1 second)
  
    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array, runs once on mount


  return (
    <div>
      <h2>TV Show History</h2>
      <ul>
        {tvShowHistory.map((item, index) => (
          <li key={index}  
          onClick={() => handleClick(item)}
          >
            {item.title} - Season {item.season}, Episode {item.episode.episode_number}  <br />
            {/* <small>{new Date(item.timestamp).toLocaleString()}</small> */}
          </li>
        ))}
      </ul>

      <h2>Movie History</h2>
      <ul>
        {movieHistory.map((item, index) => (
          <li key={index}  
          onClick={() => handleClick(item)}
          >
            {item.title} <br />
            {/* <small>{new Date(item.timestamp).toLocaleString()}</small> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayHistory;
