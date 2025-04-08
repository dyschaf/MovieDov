import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import DisplayHistory from "./DisplayHistory";
import SourceScroller from './SourceScroller';

const TvShow: React.FC<{ id: number; historySelect: any; setSearchType: React.Dispatch<React.SetStateAction<any>>; setHistorySelect: React.Dispatch<React.SetStateAction<any>>; searchType: string; placeholderText: string }> = ({ id, historySelect, setSearchType, setHistorySelect, searchType }) => {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [saveTVShowTitle, setSaveTVShowTitle] = useState<string | null>(null);
  const savedSourceIndex = localStorage.getItem("selectedTVShowSourceIndex");
  const [selectedTVShowSourceIndex, setSelectedTVShowSourceIndex] = useState<number>(
    savedSourceIndex ? parseInt(savedSourceIndex) : 0
  );

  const safeEpisode = selectedEpisode ?? { episode_number: "" };

  useEffect(() => {
    localStorage.setItem("selectedTVShowSourceIndex", selectedTVShowSourceIndex.toString());
  }, [selectedTVShowSourceIndex]);

  useEffect(() => {
    if (historySelect?.season) setSelectedSeason(historySelect.season);
    if (historySelect?.episode) setSelectedEpisode(historySelect.episode);
    if (historySelect?.title) setSaveTVShowTitle(historySelect.title);
  }, [historySelect?.season, historySelect?.episode, historySelect?.title]);

  useEffect(() => {
    const fetchSeasons = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`);
      const data = await response.json();
      setSaveTVShowTitle(data.name);
      setSeasons(data.seasons);
      window.location.href = "/#upper";
    };

    const fetchEpisodes = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`);
      const data = await response.json();
      if (historySelect) {
        const episodeIndex = Number(historySelect.episode.episode_number) - 1;
        setSelectedEpisode(data.episodes[episodeIndex]);
        setSeasonEpisodes(data.episodes);
      } else {
        setSeasonEpisodes(data.episodes);
        setSelectedEpisode(data.episodes[0]);
      }
    };

    if (selectedSeason !== null) fetchEpisodes();
    fetchSeasons();
  }, [selectedSeason, id]);

  const handleSeasonSelect = (event: any) => {
    setHistorySelect(null);
    const seasonNumber = Number(event.target.value) || Number(selectedSeason);
    setSelectedSeason(seasonNumber);
    setSelectedEpisode(null);
  };

  const handleEpisodeSelect = (event: any) => {
    setHistorySelect(null);
    const episodeNumber = Number(event.target.value) || Number(selectedEpisode);
    const selectedSeasonEpisodes = seasonEpisodes.filter(ep => ep.episode_number === episodeNumber);
    setSelectedEpisode(selectedSeasonEpisodes[0]);
  };

  const links = selectedEpisode ? [
    `https://vidsrc.net/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`,
    `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`,
    `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`,
    `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode.episode_number}`,
    `https://vidsrc.uk/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidsrc.pro/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    // `https://9animetv.to`
  ] : [];

  return (
    <div>
      {selectedEpisode && selectedSeason && (
        <>
          <div className="tv-show-container">
            <img
              className="tv-show-poster"
              src={`https://image.tmdb.org/t/p/w300/${seasons[selectedSeason]?.poster_path}`}
              alt="Season poster"
            />
            <div className="tv-show-info">
              <div className="tv-show-top-row">
                <h1 className="tv-title">{saveTVShowTitle}</h1>
                <div className="season-episode-row">
                  <select className="select-tv-season" onChange={handleSeasonSelect} value={selectedSeason ?? ""}>
                    {seasons.map(season =>
                      season.season_number !== 0 ? (
                        <option key={season.id} value={season.season_number}>
                          Season {season.season_number}
                        </option>
                      ) : null
                    )}
                  </select>

                  <select className="episodes" onChange={handleEpisodeSelect} value={safeEpisode.episode_number}>
                    {seasonEpisodes.map(ep => (
                      <option key={ep.id} value={ep.episode_number}>
                        Episode {ep.episode_number} - {ep.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="tv-overview">{selectedEpisode.overview}</p>
            </div>
          </div>

          <div className='player-container'>
            <SourceScroller
              links={links}
              selectedIndex={selectedTVShowSourceIndex}
              onSelect={setSelectedTVShowSourceIndex}
              searchType={searchType}
            />
            <div id="player">
              <iframe
                src={links[selectedTVShowSourceIndex]}
                width="100%"
                height="100%"
                allowFullScreen
              />

              <div className='seasonEpisode-controls'>
                <div className='season-episode-navigation'>
                  <div className="season-nav">
                    <button className="arrow-button" onClick={() => {
                      const currentIndex = seasons.findIndex(season => season.season_number === selectedSeason);
                      const prevSeason = seasons[currentIndex - 1];
                      if (prevSeason) handleSeasonSelect({ target: { value: prevSeason.season_number } });
                    }} disabled={seasons[0]?.season_number === selectedSeason}>
                      &lt;
                    </button>
                    <span className="season-label">Season {selectedSeason}</span>
                    <button className="arrow-button" onClick={() => {
                      const currentIndex = seasons.findIndex(season => season.season_number === selectedSeason);
                      const nextSeason = seasons[currentIndex + 1];
                      if (nextSeason) handleSeasonSelect({ target: { value: nextSeason.season_number } });
                    }} disabled={seasons[seasons.length - 1]?.season_number === selectedSeason}>
                      &gt;
                    </button>
                  </div>

                  <div className="episode-nav">
                    <button className="arrow-button" onClick={() => {
                      const currentIndex = seasonEpisodes.findIndex(ep => ep.episode_number === safeEpisode.episode_number);
                      const prevEpisode = seasonEpisodes[currentIndex - 1];
                      if (prevEpisode) handleEpisodeSelect({ target: { value: prevEpisode.episode_number } });
                    }} disabled={seasonEpisodes[0]?.episode_number === safeEpisode.episode_number}>
                      &lt;
                    </button>
                    <span className="episode-label">Episode {safeEpisode.episode_number}</span>
                    <button className="arrow-button" onClick={() => {
                      const currentIndex = seasonEpisodes.findIndex(ep => ep.episode_number === safeEpisode.episode_number);
                      const nextEpisode = seasonEpisodes[currentIndex + 1];
                      if (nextEpisode) handleEpisodeSelect({ target: { value: nextEpisode.episode_number } });
                    }} disabled={seasonEpisodes[seasonEpisodes.length - 1]?.episode_number === safeEpisode.episode_number}>
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TvShow;
