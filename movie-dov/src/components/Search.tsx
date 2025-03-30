// Search.tsx
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import SubMenu from './SubMenu';
import {Genres} from './Genres';
import TvShow from "./TvShow";
import Accordion from 'react-bootstrap/Accordion'
import DisplayHistory from "./DisplayHistory"
// import Accordion from 'react-bootstrap/Accordion';

interface DisplayHistoryProps {
  historySelect: any;  // Define the correct type for historySelect
  setHistorySelect: React.Dispatch<React.SetStateAction<any>>;  // Define the correct type for setHistorySelect
}
interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  director: string;
  genres: string;
}

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState('movie');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [historySelect, setHistorySelect] = useState<any | null>(null);

  useEffect(() => {
    // Perform any setup here if necessary (for example, loading data from localStorage).
  }, []); 
  const handleSearchTypeChange = (type: string) => {
  setSearchType(type);
  setSelectedMovieId(null);
  setMovies([]);
  handleSearch(query)

    // window.history.replaceState(null, '', window.location.href.split('#')[0])
  };
  useEffect(() => {
    handleSearch(query);
  }, [searchType]);
  const handleSearch = (query: string) => {
    setQuery(query);
    const requestOptions: any = {
      method: 'GET',
      redirect: 'follow'
    };
    
    
    // fetch(`https://api.themoviedb.org/3/search/keyword?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${query}&page=1&include_adult=false`, requestOptions)
    fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${query}&page=1&include_adult=false`, requestOptions)
      .then(response => response.json())
      .then(result => {
        
        const movies: Movie[] = result.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title || movie.name,
          poster: 'https://image.tmdb.org/t/p/w220_and_h330_face/'+movie.poster_path,
          year: Number(movie.release_date?.slice(0, 4)),
          director: '',
          genres: movie.genre_ids.flatMap((genreId: number) => {
            const matchingGenre = Genres.find((genre) => genre.id === genreId);
            return matchingGenre ? [matchingGenre.name] : []
          }).join(', ')
        }));
        setMovies(movies);
      })
      .catch(error => console.log('error', error));
  };

  const handleMovieCardClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    window.location.href = "/#upper"
  };
  useEffect(() => {
    if (selectedMovieId && searchType === 'movie') {
      // Get existing movie history from localStorage
      const storedMovieHistory = JSON.parse(localStorage.getItem("movieHistory") || "[]");
  
      // Find the movie entry in the history
      const existingMovieIndex = storedMovieHistory.findIndex((item: any) => item.id === selectedMovieId);
  
      // Create a new movie entry with updated timestamp
      const newEntry = {
        id: selectedMovieId,
        title: movies.find((movie) => movie.id === selectedMovieId)?.title,
        timestamp: new Date().toISOString(),
        type: "movie"
      };
  
      let updatedMovieHistory;
  
      if (existingMovieIndex > -1) {
        // If movie already exists, update timestamp and move to top
        const existingMovie = storedMovieHistory[existingMovieIndex];
        existingMovie.timestamp = newEntry.timestamp;
  
        // Remove the existing movie entry and add the updated one to the top
        storedMovieHistory.splice(existingMovieIndex, 1);
        updatedMovieHistory = [existingMovie, ...storedMovieHistory];
      } else {
        // If movie doesn't exist, just add it to the top
        updatedMovieHistory = [newEntry, ...storedMovieHistory];
      }
  
      // Save the updated movie history back to localStorage
      localStorage.setItem("movieHistory", JSON.stringify(updatedMovieHistory));
    }
  }, [selectedMovieId, searchType, movies]);
  // console.log("TvShow.tsx received historySelect:", historySelect);
  const handleHistorySelect = (item: any) => {
    setHistorySelect({ ...item }); // ✅ Creates a new object to trigger re-renders
  };
  useEffect(() => {
    if (historySelect) {
      if (historySelect.type) {
        setSearchType("movie")
        setSelectedMovieId(historySelect.id);  // Set the selectedMovieId to the id of the movie
        setHistorySelect(null);  // Clear the historySelect after handling
        // console.log(historySelect)
         
        // This is a TV Show with an episode
        // Handle TV Show logic here, for example, setting selectedEpisode or selectedSeason
      } else {
        // This is a Movie (no episode field)
        // console.log(historySelect)
        setSearchType("tv")
        setSelectedMovieId(historySelect.id)
      
      }
    }
  }, [historySelect]); 
  // const [forceRender, setForceRender] = useState(false);

// useEffect(() => {
//   setForceRender((prev) => !prev); // Force component update
// }, [historySelect]);
  
  return (
    
    <div id='upper'>

      {/* {searchType === "movie" ? (
        <div> */}
  {/* // Component logic */}
          <DisplayHistory historySelect={historySelect}  setHistorySelect={setHistorySelect}/>
        {/* </div>
      )
      : (
        <></>
      )} */}
      {selectedMovieId && searchType === "movie" ? (
        <>
        {/* <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>First source</Accordion.Header>
          <Accordion.Body>
            <iframe src={`https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}/`} width="100%" height="100%" allowFullScreen></iframe>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      
      <Accordion>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Second source</Accordion.Header>
          <Accordion.Body>
            <iframe src={`https://vidsrc.me/embed/${selectedMovieId}/`} width="100%" height="100%" allowFullScreen></iframe>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Third source</Accordion.Header>
          <Accordion.Body>
            <iframe id="iframe" src={`https://www.2embed.cc/embed/${selectedMovieId}`} width="100%" height="100%" allowFullScreen={true}></iframe>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
          <Accordion defaultActiveKey="5">
          <Accordion.Item eventKey="1">
        <Accordion.Header>Source 1</Accordion.Header>
        <Accordion.Body>
            <iframe src={`https://vidsrc.me/embed/${selectedMovieId}/`}  width="100%" height="100%" allowFullScreen></iframe>

        </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="2">
        <Accordion.Header>Source 2</Accordion.Header>
        <Accordion.Body>
        <iframe id="iframe" src={`https://www.2embed.cc/embed/${selectedMovieId}`} width="100%" height="100%"allowFullScreen={true} ></iframe>
   
              </Accordion.Body>
      </Accordion.Item>  
      <Accordion.Item eventKey="3">
        <Accordion.Header>Source 3</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      <Accordion.Item eventKey="4">
        <Accordion.Header>Source 4</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://vidsrc.to/embed/movie/${selectedMovieId}`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      
      <Accordion.Item eventKey="5">
        <Accordion.Header>Source 5</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://vidsrc.in/embed/movie/${selectedMovieId}`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      <Accordion.Item eventKey="6">
        <Accordion.Header>Source 6</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://multiembed.mov/directstream.php?video_id=${selectedMovieId}&tmdb=1`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      <Accordion.Item eventKey="7">
        <Accordion.Header>Source 7</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://vidsrc.uk/embed/movie/${selectedMovieId}`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      <Accordion.Item eventKey="8">
        <Accordion.Header>Source 8</Accordion.Header>
        <Accordion.Body>
        <iframe src={`https://vidsrc.pro/embed/movie/${selectedMovieId}`}  width="100%" height="100%" allowFullScreen></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      </Accordion>
          {/* <iframe src={`https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}/`}  width="100%" height="100%" allowFullScreen></iframe>
          <iframe src={`https://vidsrc.me/embed/${selectedMovieId}/`}  width="100%" height="100%" allowFullScreen></iframe>
          <iframe id="iframe" src={`https://www.2embed.cc/embed/${selectedMovieId}`} width="100%" height="100%"allowFullScreen={true} ></iframe> */}
          {/* <iframe id="iframe" src="https://www.2embed.to/embed/tmdb/movie?id=849869" width="100%" height="100%" frameBorder="0"></iframe> */}
        </>
        ) : (
          <></>
        )}
        {selectedMovieId && searchType === "tv" ? (
          // <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}&s${selected}&e=${selectedEpisode}`} width="100%" height="100 %" ></iframe>
          <TvShow id={selectedMovieId} historySelect={historySelect} setSearchType={setSearchType} setHistorySelect={setHistorySelect} searchType={searchType}
          />
          // <TvShow id={selectedMovieId} setHistorySelect={setHistorySelect} />
        ) : (
          <></>
        )}
      <h1>Search</h1>
      <SubMenu onSearchTypeChange={handleSearchTypeChange} />
      <br />
      {searchType === "movie" ? (
      <h3>Search for a Movie</h3>):
      ( <>
      <h3>Search for a TV Show</h3>
      </>)}
      <input type="text" placeholder={`search ${searchType}`} onChange={(e) => handleSearch(e.target.value)} />
      <div className="mapMovieCard">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))}
      {/* {searchType === "movie" ? (
      <h3>Search for a Movie</h3>):( <h3>Search for a TV Show</h3>)}
      <input type="text" placeholder={`search ${searchType}`} onChange={(e) => handleSearch(e.target.value)} />
      <div className="mapMovieCard">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))} */}
      </div>
    </div>
  );
};

export default Search;
