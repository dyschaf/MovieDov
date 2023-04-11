import React from 'react';
import { Genres } from './Genres';
interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: number;
    director: string;
    poster: string;
    genres:string;
  };
  onClick: (id: number) => void;
}
export let onClick:any
const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
console.log(movie.genres)
  return (
    <div className="movie-card" onClick={() => onClick(movie.id)}>
      <img src={movie.poster} alt={movie.title} />
      <h6>{movie.title}</h6>
      {movie.year?<p>{movie.year}</p>:<></>}
      <p>{movie.genres}</p>
      
    </div>
  );
};

export default MovieCard;
