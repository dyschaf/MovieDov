// Search.tsx
import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';
import SubMenu from './SubMenu';
import {Genres} from './Genres';
import TvShow from "./TvShow";

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

  return (
    <div id='upper'>
      {selectedMovieId && searchType === "movie" ? (
        <>
          <iframe src={`https://vidsrc.me/embed/${selectedMovieId}/`} frameBorder="0" width="100%" height="100%" allowfullscreen></iframe>
          <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}`} width="100%" height="100%"allowFullScreen={true} ></iframe>
          {/* <iframe id="iframe" src="https://www.2embed.to/embed/tmdb/movie?id=849869" width="100%" height="100%" frameBorder="0"></iframe> */}
        </>
        ) : (
          <></>
        )}
        {selectedMovieId && searchType === "tv" ? (
          // <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}&s${selected}&e=${selectedEpisode}`} width="100%" height="100 %" ></iframe>
          <TvShow id={selectedMovieId}/>
        ) : (
          <></>
        )}
      <h1>Search</h1>
      <SubMenu onSearchTypeChange={handleSearchTypeChange} />
      <br />
      {searchType === "movie" ? (
      <h3>Search for a Movie</h3>):( <h3>Search for a TV Show</h3>)}
      <input type="text" placeholder={`search ${searchType}`} onChange={(e) => handleSearch(e.target.value)} />
      <div className="mapMovieCard">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))}
      </div>
    </div>
  );
};

export default Search;
