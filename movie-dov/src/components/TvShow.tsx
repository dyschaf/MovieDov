import React, { useState, useEffect } from 'react';

interface Season {
  id: number;
  name: string;
  air_date: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
}

interface Episode {
  id: number;
  name: string;
  air_date: string;
  overview: string;
  still_path: string;
  episode_number: number;
}

// interface Props {
//   selectedMovieId: number;
// }

const TvShow: React.FC<{ id: number }> = ({ id }) =>  {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`
      );
      const data = await response.json();
      setSeasons(data.seasons);
      window.location.href = "/#upper"
    };

    if (selectedSeason !== null) {
      const fetchEpisodes = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`
        );
        const data = await response.json();
        setSeasonEpisodes(data.episodes);
      };

      fetchEpisodes();
    }

    fetchSeasons();
  }, [selectedSeason, id]);

  const handleSeasonSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonNumber = Number(event.target.value);
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(null);
  };

  const handleEpisodeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const episodeNumber = Number(event.target.value);
    const selectedSeasonEpisodes = seasonEpisodes.filter(
      (episode) => episode.episode_number === episodeNumber
    );
    setSelectedEpisode(selectedSeasonEpisodes[0]);
  };
  // const handleFullScreenClick = () => {
  //   const iframe = document.getElementById("iframe") as HTMLIFrameElement;
  //   if (iframe.requestFullscreen) {
  //     iframe.requestFullscreen();
  //   } else if (iframe.webkitRequestFullscreen) {
  //     /* Safari */
  //     iframe.webkitRequestFullscreen();
  //   } else if (iframe.msRequestFullscreen) {
  //     /* IE11 */
  //     iframe.msRequestFullscreen();
  //   }
  // }


  return (
    <div>
      {selectedEpisode && (
        <div>
        {/* <button onClick={handleFullScreenClick}>Fullscreen</button> */}
        <iframe id="iframe-embed" src={`https://www.2embed.to/embed/tmdb/tv?id=${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`} width="100%" height="100 %"  allowFullScreen={true}></iframe>

          <h2>Episode - {selectedEpisode.name}</h2>
          <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${selectedEpisode.still_path}`} alt={selectedEpisode.name} />
          <p>{selectedEpisode.overview}</p>
        </div>
      )}
      {/* <h1>{seasons.name}</h1> */}
      {/* <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${seasons.poster_path}`} alt={""} /> */}
      {/* <p>{seasons.overview}</p> */}
      <div>
        <h2>Seasons</h2>
        <select onChange={handleSeasonSelect}>
          {seasons.map((season) => (
            <option key={season.id} value={season.season_number}>
              Season {season.season_number}
            </option>
          ))}
        </select>
      </div>
      {selectedSeason && (
        <div>
          <h2>Episodes - Season {selectedSeason}</h2>
          <select onChange={handleEpisodeSelect}>
            {seasonEpisodes.map((episode) => (
              <option key={episode.id} value={episode.episode_number}>
                Episode {episode.episode_number} - {episode.name}
              </option>
            ))}
          </select>
        </div>
      )}
      
    </div>
  );
};

export default TvShow;