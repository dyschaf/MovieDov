// Search.tsx
import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';
import SubMenu from './SubMenu';
import {Genres} from './Genres';
import TvShow from "./TvShow";
import Accordion from 'react-bootstrap/Accordion'
import DisplayHistory from "./DisplayHistory"
import logo from "../components/IMG/logo.png"

// import Accordion from 'react-bootstrap/Accordion';

type TvShowProps = {
  id: number;
  historySelect: any;
  setSearchType: React.Dispatch<React.SetStateAction<string>>;
  setHistorySelect: React.Dispatch<any>;
  searchType: string;
  placeholderText: string; // ✅ Add this line
};

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
  const savedSourceIndex = localStorage.getItem("selectedMovieSourceIndex");
  const [selectedMovieSourceIndex, setSelectedMovieSourceIndex] = useState<number>(
    savedSourceIndex ? parseInt(savedSourceIndex) : 0
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedLabel = searchType === 'movie' ? 'movie' : 'TV show';

  const [placeholderText, setPlaceholderText] = useState(`What ${selectedLabel} do you wanna watch?`);

useEffect(() => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    setPlaceholderText(`🔍 ${selectedLabel} `);
  }
}, [selectedLabel]);
const listLinks = selectedMovieId !== null ? [
  `https://vidsrc.in/embed/movie/${selectedMovieId}`,
  `https://vidsrc.pro/embed/movie/${selectedMovieId}`,
  `https://vidsrc.me/embed/${selectedMovieId}`,
  `https://www.2embed.cc/embed/${selectedMovieId}`,
  `https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}`,
  `https://vidsrc.to/embed/movie/${selectedMovieId}`,
  
  `https://vidsrc.uk/embed/movie/${selectedMovieId}`,
  `https://multiembed.mov/directstream.php?video_id=${selectedMovieId}&tmdb=1`

] : [];


  useEffect(() => {
    // Perform any setup here if necessary (for example, loading data from localStorage).
  }, []); 
  const handleSearchTypeChange = (type: string) => {
  const selectedLabel = type === 'movie' ? 'movie' : 'TV show';
  setSearchType(type);
  setPlaceholderText(`What ${selectedLabel} do you wanna watch?`);
  setSelectedMovieId(null);
  setMovies([]);
  handleSearch(query)

    // window.history.replaceState(null, '', window.location.href.split('#')[0])
  };
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [query])
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
    // window.location.href = "/#movie-search"
    
        
      })
      .catch(error => console.log('error', error));
  };
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [])
  const handleMovieCardClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    const moviePlayer = document.getElementById("player");
    const stickyMenu = document.querySelector('.stick-menu');
    const stickyMenuHeight = stickyMenu ? stickyMenu.clientHeight : 100;

    if (moviePlayer) {
    window.scrollTo({
      top: moviePlayer.offsetTop - stickyMenuHeight,
      // behavior: 'smooth'
    });
    // window.location.href = "/#player"
// 
  }
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
        const moviePlayer = document.getElementById("player");
        const stickyMenu = document.querySelector('.stick-menu');
        const stickyMenuHeight = stickyMenu ? stickyMenu.clientHeight : 100;
    
        if (moviePlayer) {
        window.scrollTo({
          top: moviePlayer.offsetTop - stickyMenuHeight,
          // behavior: 'smooth'
        });}
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
  const handleSourceClick = (index: number): void => {
    setSelectedMovieSourceIndex(index);
    localStorage.setItem("selectedMovieSourceIndex", index.toString()); // Save the index in localStorage
  };
  // let typingTimeout: NodeJS.Timeout;
  const handleTyping = (query: string) => {
    const movieSearchSection = document.getElementById("movie-search");
    const stickyMenu = document.querySelector('.stick-menu');
    const stickyMenuHeight = stickyMenu ? stickyMenu.clientHeight : 0;

    if (movieSearchSection) {
    window.scrollTo({
      top: movieSearchSection.offsetTop - stickyMenuHeight,
      behavior: 'smooth'
    });
    // window.location.href = "/#player"
// 
  }
    // As soon as the user starts typing, immediately redirect
    // window.location.href = "/#movie-search";
  
    handleSearch(query);
  };

// useEffect(() => {
//   setForceRender((prev) => !prev); // Force component update
// }, [historySelect]);
  return (
    
    <div id='upper'>
    <div className='stick-menu'>
      <div className="header">
        <img src={logo} alt="Logo" />
        <h2>Movie-Dov</h2>
    </div>

      {/* <h1>Search</h1> */}
<div  className="submenu-container">
      <SubMenu onSearchTypeChange={handleSearchTypeChange} searchType={searchType} setSearchType={setSearchType}/>

            <input
        type="text"
        className="search-input"
        placeholder={`${placeholderText}`}
        onChange={(e) => handleTyping(e.target.value)}
        ref={searchInputRef} 
      />

      <span className="search-icon">🔍</span>
      </div>
            {/* {searchType === "movie" ? (
            <h3>Search for a Movie</h3>)
            :
            ( <>
            <h3>Search for a TV Show</h3>
            </>)} */}
            {/* <input type="text" placeholder={`search ${searchType}`} onChange={(e) => handleSearch(e.target.value)} /> */}
            </div>
            {selectedMovieId && listLinks[0] && searchType === "movie" ? (
        <>
        <div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
          {/* Movie sources list */}
          <div>
            <p></p>
          <ul style={{ listStyleType: "none", padding: "30px", marginBottom: "20px" }}>sources
            {listLinks.map((link, index) => (
              <li key={index}
              style={{padding: "20%"}}
              >
                <button
                  onClick={() => handleSourceClick(index)}
                  
                >
                  {index + 1} 
                </button>
              </li>
            ))}
          </ul>
          </div>
          <div id="player" style={{width:"80%"}}>
          {/* Embed the selected movie source in the iframe */}
          <iframe src={listLinks[selectedMovieSourceIndex]} width="100%" height="100%" allowFullScreen />
        </div>
        </div>
        </div>
          {/* <iframe src={listLinks[0]}  width="100%" height="100%" allowFullScreen></iframe> */}
       
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
          <TvShow id={selectedMovieId} historySelect={historySelect} setSearchType={setSearchType} setHistorySelect={setHistorySelect} searchType={searchType} placeholderText={placeholderText}
          />
          // <TvShow id={selectedMovieId} setHistorySelect={setHistorySelect} />
        ) : (
          <></>
        )}
            <div className="mapMovieCard" id='movie-search'>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))}
      {/* {searchType === "movie" ? (
        <div> */}

  {/* // Component logic */}

          <DisplayHistory historySelect={historySelect}  setHistorySelect={setHistorySelect}/>
        {/* </div>
      )
      : (
        <></>
      )} */}
      
      
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
