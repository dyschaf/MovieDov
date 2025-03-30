import React, { useEffect, useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface DisplayHistoryProps {
  historySelect: any;
  setHistorySelect: React.Dispatch<React.SetStateAction<any>>;
}

const DisplayHistory: React.FC<DisplayHistoryProps> = ({ historySelect, setHistorySelect }) => {
  const [tvShowHistory, setTvShowHistory] = useState<any[]>([]);
  const [movieHistory, setMovieHistory] = useState<any[]>([]);

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
  };

  const deleteTVShow = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const updatedHistory = [...tvShowHistory];
    updatedHistory.splice(index, 1);
    setTvShowHistory(updatedHistory);
    localStorage.setItem("tvShowHistory", JSON.stringify(updatedHistory));
  };

  useEffect(() => {
    setTvShowHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
    setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTvShowHistory(JSON.parse(localStorage.getItem("tvShowHistory") || "[]"));
      setMovieHistory(JSON.parse(localStorage.getItem("movieHistory") || "[]"));
    }, 1000); // Updates every second
  
    return () => clearInterval(interval); // Clean up interval when component unmounts
  }, []);

  return (
    <div className="container">
      <div className="row">
        {/* Movie History Accordion (Left Side) */}
        <div className="col-md-6">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Movie History</Accordion.Header>
              <Accordion.Body>
                <ul className="list-group">
                  {movieHistory.map((item, index) => (
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
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>TV Show History</Accordion.Header>
              <Accordion.Body>
                <ul className="list-group">
                  {tvShowHistory.map((item, index) => (
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
