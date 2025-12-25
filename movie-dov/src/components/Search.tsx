// Search.tsx
import React, { useEffect, useState, useRef } from 'react';
import MovieCard from './MovieCard';
import SubMenu from './SubMenu';
import {Genres} from './Genres';
import TvShow from "./TvShow";
import Accordion from 'react-bootstrap/Accordion'
import DisplayHistory from "./DisplayHistory"
import logo from "../components/IMG/logo.png"
import questionMark from "../components/IMG/search.svg"
import SourceScroller from './SourceScroller';
import DisplayGeneric from './DisplayGeneric';
import Anime from './Anime';
import { title } from 'process';
import { TIMEOUT } from 'dns';
import { useNavigate , useLocation, useParams } from 'react-router-dom';
// import { useLocation, useParams } from 'react-router-dom';

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
  year: string;
  director: string;
  genres: string;
}
interface TVShowHistoryItem {
  id: number;
  title: string;
  season: any;
  episode: any;
  timestamp: string;
  genres: number[];         // ✅ Correct way to type an array of numbers
  year: string;
  poster?: string; 
  type:string;         // (Optional) Add if you're also saving the poster
}
interface MovieHistoryItem {
  id: number;
  title: string;
  year: string;
  poster: string;
  timestamp: string;
  genres: number[];
  type: "movie";
}
interface type_media{
  type_media:string
}
const Search: React.FC = () => {
  const [searchType, setSearchType] = useState('movie');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [animeSelected, setAnimeSelected] = useState<Movie[]>([]);
  const [animeSearch, setAnimeSearch] = useState<Movie[]>([]);
  // const [clickedMovie, setClickedMovie] = useState<Movie[]>([]);
  const [clickedMovie, setClickedMovie] = useState<any | null>(null);
  const [tvHistory, setTvHistory] = useState<TVShowHistoryItem[]>([]);
  const [movieHistory, setMovieHistory] = useState<MovieHistoryItem[]>([]);

  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [historySelect, setHistorySelect] = useState<any | null>(null);
  const savedSourceIndex = localStorage.getItem("selectedMovieSourceIndex");
  const [movieTrendsData, setMovieTrendsData] = useState<any[]>([]);
  const [tvTrendsData, setTVTrendsData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const [selectedMovieSourceIndex, setSelectedMovieSourceIndex] = useState<number>(
    savedSourceIndex ? parseInt(savedSourceIndex) : 0
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  let selectedLabel = '';
  if (searchType === 'movie') {
    selectedLabel = 'Movie';
  } else if (searchType === 'tv') {
    selectedLabel = 'TV show';
  } else if (searchType === 'anime') {
    selectedLabel = 'Anime';
  }
  const location = useLocation();
  const params = useParams();
  // const { type, id, title, season, episode } = useParams();
  // const location = useLocation();
  const segments = location.pathname.split('/');
  const ParamType = segments[1];
  const ParamID = Number(segments[2]);
  const ParamTitle = segments[3];
  const ParamSeason = Number(segments[4]);
  const ParamEpisode = Number(segments[5]);
  // console.log("Route changed:", params);
  const scrollRefTrendMovie = useRef<HTMLDivElement>(null);
  const scrollRefTrendTv = useRef<HTMLDivElement>(null);
  const scrollRefSaveTv = useRef<HTMLDivElement>(null);
  const scrollRefSaveMovie = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [placeholderText, setPlaceholderText] = useState(`What ${selectedLabel} do you wanna watch?`);
  const ul = document.querySelector(".source-list-ul");
  const listRefMobile = useRef<HTMLDivElement>(null);
  const listRefDesktop = useRef<HTMLUListElement>(null);
  const iframeMovieRef = useRef<HTMLIFrameElement>(null);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);


  }, []);
  
  useEffect(() => {
    if (selectedMovieSourceIndex < listLinks.length) {
    localStorage.setItem("selectedMovieSourceIndex", selectedMovieSourceIndex.toString());
    }else {
      localStorage.setItem("selectedMovieSourceIndex", "0");
    }
  }, [selectedMovieSourceIndex]);
useEffect(() => {
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    setPlaceholderText(`Search ${selectedLabel}`);
  }

}, [selectedLabel]);

useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== 'https://vidlink.pro') return;
  
    if (event.data?.type === 'PLAYER_EVENT') {
      const { event: eventType, currentTime, duration } = event.data.data;
      // Handle the event
      // console.log(`Player ${eventType} at ${currentTime}s of ${duration}s`);
    }
    if (event.data?.type === 'MEDIA_DATA') {
      const mediaData = event.data.data;
      localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage); // ✅ Cleanup on unmount
  };
}, []); // ✅ Empty dependency array ensures this runs only once
window.addEventListener('message', (event) => {
  // if (event.origin !== 'https://vidlink.pro') return;
  
  if (event.data?.type === 'MEDIA_DATA') {
    const mediaData = event.data.data;
    localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
  }
});

const listLinks = selectedMovieId !== null ? [
  `https://vidsrc.net/embed/movie/${selectedMovieId}`,
  
  // `https://vidlink.pro/movie/${selectedMovieId}`,
  `https://111movies.com/movie/${selectedMovieId}`,
  `https://embed.su/embed/movie/${selectedMovieId}`,
  `https://vidsrc.pro/embed/movie/${selectedMovieId}`,
  `https://vidsrc.me/embed/${selectedMovieId}`,
  `https://www.2embed.cc/embed/${selectedMovieId}`,
  `https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}`,
  `https://vidsrc.to/embed/movie/${selectedMovieId}`,
  
  `https://vidsrc.uk/embed/movie/${selectedMovieId}`,
  `https://multiembed.mov/directstream.php?video_id=${selectedMovieId}&tmdb=1`,
  


] : [];

useEffect(() => {
  const fetchAllData = async () => {
    const url = 'https://api.themoviedb.org/3/trending/all/day?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWM1OGM4ZDA5ZTE3MDdmOGFlOThhMTgzMmRkMTVhMyIsIm5iZiI6MTY4MDQ4NTE0Ny42LCJzdWIiOiI2NDJhMmIxYjY2NTQwODAwOTdmNjE4NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9pk3bj2GOmq_vPmEZHd6CNWy2T_k1BsD-_mZEMsJ9qQ'
      }
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setAllData(data.results);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchMovieTrendsData = async () => {
    const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWM1OGM4ZDA5ZTE3MDdmOGFlOThhMTgzMmRkMTVhMyIsIm5iZiI6MTY4MDQ4NTE0Ny42LCJzdWIiOiI2NDJhMmIxYjY2NTQwODAwOTdmNjE4NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9pk3bj2GOmq_vPmEZHd6CNWy2T_k1BsD-_mZEMsJ9qQ'
      }
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setMovieTrendsData(data.results);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchTVTrendsData = async () => {
    const url = 'https://api.themoviedb.org/3/trending/tv/day?language=en-US';
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWM1OGM4ZDA5ZTE3MDdmOGFlOThhMTgzMmRkMTVhMyIsIm5iZiI6MTY4MDQ4NTE0Ny42LCJzdWIiOiI2NDJhMmIxYjY2NTQwODAwOTdmNjE4NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9pk3bj2GOmq_vPmEZHd6CNWy2T_k1BsD-_mZEMsJ9qQ'
      }
    };

    try {
      const res = await fetch(url, options);
      const data = await res.json();
      setTVTrendsData(data.results);
    } catch (err) {
      console.error(err);
    }
  };

  fetchTVTrendsData();
  fetchMovieTrendsData();

  fetchAllData();
}, []);
  useEffect(() => {
    if (searchType === 'movie') {
      selectedLabel = 'Movie';
    } else if (searchType === 'tv') {
      selectedLabel = 'TV show';
    } else if (searchType === 'anime') {
      selectedLabel = 'Anime';
    }
    
  setPlaceholderText(`What ${selectedLabel} do you wanna watch?`);
    // Perform any setup here if necessary (for example, loading data from localStorage).
  }, [searchType]); 
  const handleSearchTypeChange = (type: string) => {
 
    // let selectedLabel = '';

  //   if (searchType === 'movie') {
  //     selectedLabel = 'Movie';
  //   } else if (searchType === 'tv') {
  //     selectedLabel = 'TV show';
  //   } else if (searchType === 'anime') {
  //     selectedLabel = 'Anime';
  //   }
    
  // setPlaceholderText(`What ${selectedLabel} do you wanna watch?`);
  setSearchType(type);
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
   
    // if (searchType === "anime"){
      // fetch(`/api/mal-proxy?q=${query}`)
      //   .then((res) => {
      //     if (!res.ok) throw new Error("Request failed");
      //     return res.json();
      //   })
      //   .then((data) => {
      //     const movies: Movie[] = data.data.map((entry: any) => {
      //       const anime = entry.node;
          
      //       return {
      //         id: anime.id,
      //         title: anime.title,
      //         poster: anime.main_picture?.medium || '',  // or `.large` if you want bigger
      //         year: '', // You can add this later if you fetch `start_date`
      //         director: '',
      //         genres: '', // Only available if you fetch `genres` field
      //       };
      //     });
      //     setMovies(movies);
      //     setAnimeSearch(data.data);
      //     console.log(movies)
      //   })
        // .catch((err) => {
        //   setError(err.message);
        // });
    // }else{
      const requestOptions: any = {
        method: 'GET',
        redirect: 'follow'
      };
    // fetch(`https://api.themoviedb.org/3/search/keyword?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${query}&page=1&include_adult=false`, requestOptions)
    if (searchType === "anime"){
    // fetch(`https://api.themoviedb.org/3/discover/tv?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&query=${query}&with_genres=16&page=1&include_adult=false`, requestOptions)
    // .then(response => response.json())
    // .then(result => {
      fetch(`https://api.themoviedb.org/3/search/tv?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&query=${encodeURIComponent(query)}&page=1&include_adult=false`)
      .then(res => res.json())
      .then(data => {
        const animeResults = data.results.filter((item: any) =>
           item.genre_ids.includes(16)
        );
        // console.log(animeResults)       // setResults(animeResults);
      

      const movies: Movie[] = animeResults.map((movie: any) => ({
        id: movie.id,
        title: movie.title || movie.name,
        poster: 'https://image.tmdb.org/t/p/w220_and_h330_face/'+movie.poster_path,
        year: movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || '',
        // year: Number(movie.release_date?.first_air_date?.split('-')[0] )|| '',
        director: '',
        // genres: movie.genre_ids
        genres: movie.genre_ids.flatMap((genreId: number) => {
          const matchingGenre = Genres.find((genre) => genre.id === genreId);
          return matchingGenre ? [matchingGenre.name] : []
        }).join(', ')
      // }));
      }));
      setMovies(movies);
  // window.location.href = "/#movie-search"
  
      
    })
    .catch(error => console.log('error', error));
    
  }else{
    fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${query}&page=1&include_adult=false`, requestOptions)
      .then(response => response.json())
      .then(result => {
        
        const movies: Movie[] = result.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title || movie.name,
          poster: 'https://image.tmdb.org/t/p/w220_and_h330_face/'+movie.poster_path,
          year: movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0] || '',
          // year: Number(movie.release_date?.first_air_date?.split('-')[0] )|| '',
          director: '',
          // genres: movie.genre_ids
          genres: movie.genre_ids.flatMap((genreId: number) => {
            const matchingGenre = Genres.find((genre) => genre.id === genreId);
            return matchingGenre ? [matchingGenre.name] : []
          }).join(', ')
        // }));
        }));
        setMovies(movies);
    // window.location.href = "/#movie-search"
    
        
      })
      .catch(error => console.log('error', error));
    }
  };
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [])
  
  const handleAllCardClick = (movieId: number, movieType: string) => {
    const type = movieType || 'movie'; // or 'tv', 'anime'
    // const = encodeURIComponent(movieId);
    // const year = item.year || '';
    const moviePlayer = document.getElementById("upper");
    // const moviePlayer = document.querySelector('.source-list-movie-div');
    const stickyMenu = document.querySelector('.stick-menu');
    const stickyMenuHeight = stickyMenu ? stickyMenu.clientHeight : 100;

    if (moviePlayer) {
    window.scrollTo({
      top: moviePlayer.offsetTop - stickyMenuHeight,
      // behavior: 'smooth'
    });}
    
    // setClickedMovie(null)
    if (movieType === "tv") {
      // setSearchType("movie");
      setSearchType(movieType);
      setSelectedMovieId(movieId);
      // const match = tvHistory.find(item => item.id === id);
      
      // console.log(tvHistory)
  
      
      const storedTvHistory = localStorage.getItem("tvShowHistory");
    // console.log(storedTvHistory)
    if (storedTvHistory) {
      try {
        const parsed : TVShowHistoryItem[] = JSON.parse(storedTvHistory);
        const match = parsed.find(item => item?.id === movieId);
        console.log(match)
        if (match) {
        // console.log("test156")
        // console.log(selectedSeason)
  
          setHistorySelect(match);
        }
        setTvHistory(Array.isArray(parsed) ? parsed : []);
        // console.log(tvHistory)  
      } catch (e) {
        console.error("Invalid JSON in localStorage:", e);
        setTvHistory([]);
      }
    } else {
      setTvHistory([]);
    }

   
    } 
    if (movieType === "movie") {
      
      setSearchType(movieType);
      handleMovieCardClick(movieId);
    }
    setClickedMovie(null)
  };
  useEffect(() => {
    

    // console.log("Route params:", { type, id, title, season, episode });

    // if (ParamSeason && ParamEpisode && ParamID != selectedMovieId) {
    //   handleAllCardClick(ParamID,ParamType)
  
    // } else 
    if (ParamID && ParamTitle && ParamID != selectedMovieId) {
    //   // show detail panel or similar
    // const storedTvHistory = localStorage.getItem("tvShowHistory");
      // setTvHistory(storedTvHistory)
      console.log(ParamID,ParamType)
      handleAllCardClick(ParamID,ParamType)
    }
  }, []);
  const handleMovieCardClick = (movieId: number) => {
    // setClickedMovie(null)
    // setHistorySelect(historySelect);
    
    setSelectedMovieId(movieId);
    // if(ParamEpisode){
    //   setSearchType(ParamType)
    // }
    // console.log(searchType)
    if (searchType !== "Anime") {
  
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWM1OGM4ZDA5ZTE3MDdmOGFlOThhMTgzMmRkMTVhMyIsIm5iZiI6MTY4MDQ4NTE0Ny42LCJzdWIiOiI2NDJhMmIxYjY2NTQwODAwOTdmNjE4NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9pk3bj2GOmq_vPmEZHd6CNWy2T_k1BsD-_mZEMsJ9qQ'
      }
    };
  
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // console.log("Fetched movie data:", json);
        setClickedMovie(null)
        setClickedMovie(json); // ✅ save to state
      
      })
      .catch((err) => {
        
        // setClickedMovie(null)
        // console.error("Failed to fetch movie data:", err);
      });
    }else{
       
    const url = `https://api.themoviedb.org/3/tv/${movieId}?language=en-US`;

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMWM1OGM4ZDA5ZTE3MDdmOGFlOThhMTgzMmRkMTVhMyIsIm5iZiI6MTY4MDQ4NTE0Ny42LCJzdWIiOiI2NDJhMmIxYjY2NTQwODAwOTdmNjE4NTIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.9pk3bj2GOmq_vPmEZHd6CNWy2T_k1BsD-_mZEMsJ9qQ'
      }
    };
  
    fetch(url, options)
      .then((res) => res.json())
      .then((json) => {
        // console.log("Fetched movie data:", json);
        setClickedMovie(null)
        setClickedMovie(json); // ✅ save to state
      
      })
      ;
  };
   
  };

  
  const scrollByAmount = (ref: React.RefObject<HTMLDivElement>, amount: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };
  useEffect(() => {
    if (selectedMovieId && searchType === 'movie' && clickedMovie?.id) {
      // Get existing movie history from localStorage
      const storedMovieHistory = JSON.parse(localStorage.getItem("movieHistory") || "[]");
  
      // Find the movie entry in the history
      const existingMovieIndex = storedMovieHistory.findIndex((item: any) => item.id === selectedMovieId);
  
      
      // Create a new movie entry with updated timestamp
      // const newEntry = {
      //   id: selectedMovieId,
      //   title: movies.find((movie) => movie.id === selectedMovieId)?.title,
      //   timestamp: new Date().toISOString(),
      //   type: "movie"

      // };
      // const clickedMovie = movies.find((movie) => movie.id === selectedMovieId||allData.find((data) => data.id === selectedMovieId));

      const newEntry = {
        id: clickedMovie?.id,
        title: clickedMovie?.title,
        genre_ids: clickedMovie?.genres?.map((genre: { id: number; name: string }) => genre.id) || [],
        first_air_date:clickedMovie?.release_date,
        poster_path: clickedMovie?.poster_path,
        timestamp: new Date().toISOString(),
        type: "movie"
      };
      
      // navigate(`/${searchType}/${clickedMovie.title}/$year`)
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
      if(clickedMovie?.release_date){
        navigate(`/${searchType}/${selectedMovieId}/${clickedMovie?.title.replace(/\s+/g, '-')}`);
        }
      // Save the updated movie history back to localStorage
      localStorage.setItem("movieHistory", JSON.stringify(updatedMovieHistory));
    }
  }, [clickedMovie]);
  // console.log("TvShow.tsx received historySelect:", historySelect);
  // const handleHistorySelect = (item: any) => {
  //   setHistorySelect({ ...item }); // ✅ Creates a new object to trigger re-renders
  // };


  useEffect(() => {
    // setTimeout(() => {
    //   // console.log("⏰ 5 seconds passed!");
    //   // You can run any code here after the delay
    // }, 10000);
    const storedTvHistory = localStorage.getItem("tvShowHistory");
    if (storedTvHistory) {
      try {
        const parsed = JSON.parse(storedTvHistory);
        setTvHistory(parsed);
      } catch (err) {
        console.error("Failed to parse tvShowHistory:", err);
      }
    }
      const storedMovieHistory = localStorage.getItem("movieHistory");
      if (storedMovieHistory) {
        try {
          const parsed = JSON.parse(storedMovieHistory);
          setMovieHistory(parsed);
        } catch (err) {
          console.error("Failed to parse movieHistory:", err);
        }
      }
    
  }, [selectedMovieId, historySelect]);
  
  useEffect(() => {
    if (historySelect) {
      if (historySelect.type==="movie") {
        setSearchType("movie")
        setSelectedMovieId(historySelect.id);  // Set the selectedMovieId to the id of the movie
        setHistorySelect(null);  // Clear the historySelect after handling
        // console.log(historySelect)
        
        // This is a TV Show with an episode
        // Handle TV Show logic here, for example, setting selectedEpisode or selectedSeason
      } else {
        // This is a Movie (no episode field)
        // console.log(historySelect)
       
        // setHistorySelect(null)
      }
    }
  }, [historySelect]); 
  // const [forceRender, setForceRender] = useState(false);
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
      <div className="header" >
        <img className="pointer" src={logo} alt="Logo" onClick={() =>window.location.href = "/"}/>
        <h2 className="pointer" onClick={() => window.location.href = "/"}>Movie-Dov</h2>
    </div>

      {/* <h1>Search</h1> */}
      <div className="submenu-fixed">
<div  className="submenu-container">
      <SubMenu onSearchTypeChange={handleSearchTypeChange} searchType={searchType} setSearchType={setSearchType}/>

            <input
        type="text"
        className="search-input"
        placeholder={`${placeholderText}`}
        onChange={(e) => handleTyping(e.target.value)}
        ref={searchInputRef} 
      />
      <img className="search-icon"src={questionMark}></img>
      {/* <span className="search-icon"></span> */}
      </div>
            {/* {searchType === "movie" ? (
            <h3>Search for a Movie</h3>)
            :
            ( <>
            <h3>Search for a TV Show</h3>
            </>)} */}
            {/* <input type="text" placeholder={`search ${searchType}`} onChange={(e) => handleSearch(e.target.value)} /> */}
            </div>
            </div>
            {selectedMovieId && listLinks[0] && searchType === "movie" ? (
  // <div className="source-list-movie-div">
  <>
<div className='player-container' id="player-container">
    <SourceScroller
      links={listLinks}
      selectedIndex={selectedMovieSourceIndex}
      onSelect={setSelectedMovieSourceIndex}
      searchType={searchType}
    />
    <div id="player">
      <iframe
        ref={iframeMovieRef}
        src={listLinks[selectedMovieSourceIndex]}
        width="100%"
        height="100%"
        allowFullScreen
      />
    </div>
    </div>
    </>

) : null}
    {/* </div> */}

  

        {/* </div> */}
          {/* <iframe src={listLinks[0]}  width="100%" height="100%" allowFullScreen></iframe> */}
       
          {/* <iframe src={`https://embed.smashystream.com/playere.php?tmdb=${selectedMovieId}/`}  width="100%" height="100%" allowFullScreen></iframe>
          <iframe src={`https://vidsrc.me/embed/${selectedMovieId}/`}  width="100%" height="100%" allowFullScreen></iframe>
          <iframe id="iframe" src={`https://www.2embed.cc/embed/${selectedMovieId}`} width="100%" height="100%"allowFullScreen={true} ></iframe> */}
          {/* <iframe id="iframe" src="https://www.2embed.to/embed/tmdb/movie?id=849869" width="100%" height="100%" frameBorder="0"></iframe> */}
        {/* </>
        ) : (
          <></>
        )} */}
        {selectedMovieId && searchType === "anime" ? (
          // <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}&s${selected}&e=${selectedEpisode}`} width="100%" height="100 %" ></iframe>
          <Anime id={selectedMovieId} historySelect={historySelect} setSearchType={setSearchType} setHistorySelect={setHistorySelect} searchType={searchType} placeholderText={placeholderText }query={query}setQuery={setQuery}
          />
          // <TvShow id={selectedMovieId} setHistorySelect={setHistorySelect} />
        ) : (
          <></>
        )}
        {selectedMovieId && searchType === "tv" ? (
          // <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}&s${selected}&e=${selectedEpisode}`} width="100%" height="100 %" ></iframe>
          <TvShow id={selectedMovieId} historySelect={historySelect} setSearchType={setSearchType} setHistorySelect={setHistorySelect} searchType={searchType} placeholderText={placeholderText }query={query}setQuery={setQuery}
          />
          // <TvShow id={selectedMovieId} setHistorySelect={setHistorySelect} />
        ) : (
          <></>
        )}
            <div className="mapMovieCard" id='movie-search'>
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))}
        </div>
      {/* {searchType === "movie" ? (
        <div> */}
   {/* <div className="mapMovieCard" id='movie-search'> */}
              {/* {allData.map((data) => (
                <DisplayGeneric key={data.id} data={data} onClick={handleMovieCardClick} />
        ))} */}
  {/* // Component logic */}
  {/* <div className="mapMovieCard" id='movie-search'> */}
  {/* <div> */}

  {tvHistory  && tvHistory.length > 0?(
      <>
  <h5 className='generic-title'>TV Show History</h5>
  <div className="generic-scroller-wrapper">
      <button className="scroll-arrow left" onClick={() => scrollByAmount(scrollRefSaveTv,-300)}>
        &lt;
      </button>
  <div className="generic-scroller-container" ref={scrollRefSaveTv}>
  <div className="generic-scroller-inner">
  {tvHistory.map((data) => (
                <DisplayGeneric key={data.id} data={data} onClick={handleAllCardClick} type_media={'tv'} />
        ))}
 
        </div>
         </div>
         <button className="scroll-arrow right" onClick={() => scrollByAmount(scrollRefSaveTv,300)}>
        &gt;
      </button>
    </div>
    </>
  ):null}



{movieHistory&& movieHistory.length > 0 ? (
  <>
  <h5 className='generic-title'>Movie History</h5>
    <div className="generic-scroller-wrapper">
      <button className="scroll-arrow left" onClick={() => scrollByAmount(scrollRefSaveMovie,-300)}>
        &lt;
      </button>
  <div className="generic-scroller-container" ref={scrollRefSaveMovie}>
  <div className="generic-scroller-inner">

  {movieHistory.map((data) => (
                <DisplayGeneric key={data.id} data={data} onClick={handleAllCardClick} type_media={'movie'} />
        ))}

        </div>
         </div>
         <button className="scroll-arrow right" onClick={() => scrollByAmount(scrollRefSaveMovie,300)}>
        &gt;
      </button>
    </div>
    </>
):null}

<h5 className='generic-title'>Trending Movies</h5>
    <div className="generic-scroller-wrapper">
      <button className="scroll-arrow left" onClick={() => scrollByAmount(scrollRefTrendMovie,-300)}>
        &lt;
      </button>
  <div className="generic-scroller-container" ref={scrollRefTrendMovie}>
  <div className="generic-scroller-inner">
  {movieTrendsData.map((data) => (
                <DisplayGeneric key={data.id} data={data} onClick={handleAllCardClick}type_media={'movie'}  />
        ))}
 
        </div>
         </div>
         <button className="scroll-arrow right" onClick={() => scrollByAmount(scrollRefTrendMovie,300)}>
        &gt;
      </button>
    </div>

    <h5 className='generic-title'>Trending TV Shows</h5>
  <div className="generic-scroller-wrapper">
      <button className="scroll-arrow left" onClick={() => scrollByAmount(scrollRefTrendTv,-300)}>
        &lt;
      </button>
  <div className="generic-scroller-container" ref={scrollRefTrendTv}>
  <div className="generic-scroller-inner">
  {tvTrendsData.map((data) => (
                <DisplayGeneric key={data.id} data={data} onClick={handleAllCardClick} type_media={'tv'}  />
        ))}
 
        </div>
         </div>
         <button className="scroll-arrow right" onClick={() => scrollByAmount(scrollRefTrendTv,300)}>
        &gt;
      </button>
    </div>
  
         {/* </div> */}
        {/* </div>  */}
          {/* <DisplayGeneric allData={{ results: allData }}/> */}
          {/* <DisplayGeneric allData={{ results: allData }}/> */}
          <DisplayHistory historySelect={historySelect} setHistorySelect={setHistorySelect} movieHistory={movieHistory} setMovieHistory={setMovieHistory} tvHistory={tvHistory} setTvHistory={setTvHistory}/>
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
    // </div>
  );
};

export default Search;
