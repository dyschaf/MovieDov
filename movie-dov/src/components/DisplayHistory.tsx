import React, { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface DisplayHistoryProps {
  tvHistory?:any;
  setTvHistory: React.Dispatch<React.SetStateAction<any>>;
  movieHistory?:any;
  setMovieHistory: React.Dispatch<React.SetStateAction<any>>;
  historySelect: any;
  setHistorySelect: React.Dispatch<React.SetStateAction<any>>;
}

const DisplayHistory: React.FC<DisplayHistoryProps> = ({ historySelect, setHistorySelect,tvHistory, setTvHistory,movieHistory, setMovieHistory}) => {
  // const [tvShowHistory, setTvHistory] = useState<any[]>([]);
  // const [movieHistory, setMovieHistory] = useState<any[]>([]);

  const handleClick = (item: any) => {
    setHistorySelect(null);
    setHistorySelect(item);
  };

  const deleteMovie = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedHistory = [...movieHistory];
    updatedHistory.splice(index, 1);
    setMovieHistory(updatedHistory);
    localStorage.setItem("movieHistory", JSON.stringify(updatedHistory));
    // setMovieHistory(updatedHistory)
  };

  const deleteTVShow = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedHistory = [...tvHistory];
    updatedHistory.splice(index, 1);
    setTvHistory(updatedHistory);
    localStorage.setItem("tvShowHistory", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    setTvHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
    setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTvHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
      setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
    }, 1000); // Updates every second
  
    return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []);

  return (
    <div className="container">
      <div className="row">
        {/* Movie History Accordion (Left Side) */}
        <div className="col-md-6">
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Remove Movie History</Accordion.Header>
              <Accordion.Body>
                <ul className="list-group">
                  {movieHistory?.map((item:any, index: number) => (
                    <li className="list-group-item d-flex justify-content-between" key={index} onClick={() => handleClick(item)}>
                      {item.title}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(event) => deleteMovie(index, event)}
                      >
                        ✖
                      </Button>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>

        {/* TV Show History Accordion (Right Side) */}
        <div className="col-md-6">
          <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Remove TV Show History</Accordion.Header>
              <Accordion.Body>
                <ul className="list-group">
                  {tvHistory?.map((item:any, index:number) => (
                    <li className="list-group-item d-flex justify-content-between" key={index} onClick={() => handleClick(item)}>
                      {item.title} - S{item.season}, E{item.episode.episode_number}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(event) => deleteTVShow(index, event)}
                      >
                        ✖
                      </Button>
                    </li>
                  ))}
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default DisplayHistory;
