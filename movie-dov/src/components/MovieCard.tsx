import React from 'react';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: number;
    poster: string;
    genres: string; // comma-separated, e.g., "Action,War,Comedy"
  };
  onClick: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  const genreList = movie.genres.split(',');

  return (
    <div className="movie-card" onClick={() => onClick(movie.id)}>
      <img src={movie.poster} alt={movie.title} className="movie-poster" />
      <h5 className="movie-title">{movie.title}</h5>
      <div>
      <div className="genre-tags">
        {genreList.map((genre, index) => (
          <span key={index} className="genre-tag">
            {genre.trim()}
          </span>
        ))}
      </div>
      <p className="movie-year">{movie.year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
