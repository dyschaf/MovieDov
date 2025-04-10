import React from 'react';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    year: string;
    poster: string;
    genres?: string; // comma-separated, e.g., "Action,War,Comedy"
  };
  onClick: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  // const genreList = movie.genres.split(',');
// console.log(movie.poster)
  return (
    <div className="movie-card" onClick={() => onClick(movie.id)}>
      <img src={movie.poster} alt={movie.title} className="movie-poster" />
      <div className='movie-sub-info'>
      <h5 className="movie-title">{movie.title}</h5>
      <div className="year-genre-tags">
      <div className="genre-tags">
      {movie.genres?.split(',').map((genre, genreIndex) => (
  <span key={genreIndex} className="genre-tag">
    {genre}
  </span>
))}
      </div>
      <p className="movie-year">{movie.year}</p>
      </div>
    </div>
    </div>
  );
};

export default MovieCard;
