import React from 'react';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: number;
    director: string;
    poster: string;
  };
  onClick: (id: number) => void;
}
export let onClick:any
const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {

  return (
    <div className="movie-card" onClick={() => onClick(movie.id)}>
      <img src={movie.poster} alt={movie.title} />
      <h6>{movie.title}</h6>
      <p>{movie.year}</p>
      <p>{movie.director}</p>
    </div>
  );
};

export default MovieCard;
