// Search.tsx
import React, { useState } from 'react';
import MovieCard from './MovieCard';
import SubMenu from './SubMenu';
import TvShow from "./TvShow";

interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  director: string;
}

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState('movie');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type);
  };

  const handleSearch = (query: string) => {
    const requestOptions: any = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://api.themoviedb.org/3/search/${searchType}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US&query=${query}&page=1&include_adult=false`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        const movies: Movie[] = result.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title || movie.name,
          poster: 'https://image.tmdb.org/t/p/w220_and_h330_face/'+movie.poster_path,
          year: Number(movie.release_date?.slice(0, 4)),
          director: ''
        }));
        setMovies(movies);
      })
      .catch(error => console.log('error', error));
  };

  const handleMovieCardClick = (movieId: number) => {
    setSelectedMovieId(movieId);
  };

  return (
    <div>
      {selectedMovieId && searchType === "movie" ? (
        <>
          <iframe id="iframe" src={`https://www.2embed.to/embed/tmdb/${searchType}?id=${selectedMovieId}`} width="100%" height="100%" ></iframe>
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
      <input type="text" onChange={(e) => handleSearch(e.target.value)} />
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleMovieCardClick} />
        ))}
      </div>
    </div>
  );
};

export default Search;
