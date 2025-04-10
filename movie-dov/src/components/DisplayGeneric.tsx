import React from 'react';
import './css/DisplayGeneric.css';

const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  10759: 'Action & Adventure',
  10765: 'Sci-Fi & Fantasy',
};

interface DisplayGenericProps {
  data: {
    adult?: boolean;
    backdrop_path?: string;
    id: number;
    title?: string; // for movies
    name?: string;  // for TV shows
    original_language?: string;
    original_title?: string;
    original_name?: string;
    overview?: string;
    poster_path?: string;
    poster?: string;
    media_type?: string;
    genre_ids?: number[];
    popularity?: number;
    release_date?: string;       // for movies
    first_air_date?: string;     // for TV shows
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    type_media? : string
  };
//   interface type_media{
    type_media:string
//   }
  onClick: (movieId: number, type_media: string) => void;
}

const DisplayGeneric: React.FC<DisplayGenericProps> = ({ data, onClick, type_media}) => {
  const genres = data.genre_ids?.map(id => genreMap[id]).filter(Boolean);
  const title = data.title || data.name;
  const type = data.type_media || type_media;
  const year = data.release_date?.split('-')[0] || data.first_air_date?.split('-')[0] || '';
  const img= `https://image.tmdb.org/t/p/w300/${data.poster_path}`||`https://image.tmdb.org/t/p/w220_and_h330_face/${data.poster_path}`
//   console.log(genres)
  return (
    <div className="movie-card" onClick={() => onClick(data.id, type)}>
      <img
        src={img}
        alt={title}
        className="movie-poster"
      />
      <div className="movie-sub-info">
        <h5 className="movie-title">{title}</h5>
        <div className="year-genre-tags">
          <div className="genre-tags">
            {genres?.map((genre, genreIndex) => (
              <span key={genreIndex} className="genre-tag">
                {genre}
              </span>
            ))}
          </div>
          <p className="movie-year">{year}</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayGeneric;
