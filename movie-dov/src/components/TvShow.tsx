import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import DisplayHistory from "./DisplayHistory";
import SourceScroller from './SourceScroller';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { TIMEOUT } from 'dns';
import { useNavigate } from 'react-router-dom';
// import { link } from 'fs';
interface TVShow {
  id: number;
  title?: string;
  name?: string;
  genres?: { id: number; name: string }[];
  first_air_date?: string;
  poster_path?: string;
  backdrop_path?: string;
}

interface TVShowData {
  adult: boolean;
  backdrop_path: string;
  created_by: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  episode_run_time: number[];
  first_air_date: string;
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  };
  name: string;
  next_episode_to_air: string | null;
  networks: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: {
    id: number;
    logo_path: string | null;
    name: string;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
    vote_average: number;
  }[];
  spoken_languages: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}

interface TVShowHistoryItem {
  id: number;
  title: string;
  season: any;
  episode: any;
  timestamp: string;
  genre_ids: number[];         // ✅ Correct way to type an array of numbers
  first_air_date?: string;
  poster_path?: string; 
  type:string;         // (Optional) Add if you're also saving the poster
}

interface Season {
  id: number;
  name: string;
  air_date: string;
  overview: string;
  poster_path: string;
  season_number: number;
  episode_count: number;
}

const TvShow: React.FC<{ id: number; historySelect: any; setSearchType: React.Dispatch<React.SetStateAction<any>>; setHistorySelect: React.Dispatch<React.SetStateAction<any>>; searchType: string; placeholderText: string; query:string ;setQuery: React.Dispatch<React.SetStateAction<any>> }> = ({ id, historySelect, setSearchType, setHistorySelect, searchType, query,setQuery }) => {
  const [seasons, setSeasons] = useState<any[]>([]);
  const [tvshowData, setTvshowData] = useState<any>([]);
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(1);
  const [changeSeasonActive, setChangeSeasonActive] = useState<boolean | null>(false);
  const [selectedEpisode, setSelectedEpisode] = useState<any | null>(null);
  const [saveTVShowTitle, setSaveTVShowTitle] = useState<string | null>(null);
  const savedSourceIndex = localStorage.getItem("selectedTVShowSourceIndex");
  const [selectedTVShowSourceIndex, setSelectedTVShowSourceIndex] = useState<number>(
    savedSourceIndex ? parseInt(savedSourceIndex) : 0
  );
  const navigate = useNavigate(); 

  const safeEpisode = selectedEpisode ?? { episode_number:1 };

  useEffect(() => {
    if(selectedTVShowSourceIndex < links.length  ){
    localStorage.setItem("selectedTVShowSourceIndex", selectedTVShowSourceIndex.toString());
    }else
    localStorage.setItem("selectedTVShowSourceIndex", "0");
    
  }, [selectedTVShowSourceIndex]);

  useEffect(() => {
    if (historySelect?.season) setSelectedSeason(historySelect.season);
    if (historySelect?.episode) setSelectedEpisode(historySelect.episode);
    if (historySelect?.title) setSaveTVShowTitle(historySelect.title);
    setHistorySelect(null)

  }, [historySelect?.season, historySelect?.episode, historySelect?.title]);
  // useEffect(() => {
  //   const fetchSeasons = async () => {
  //     const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`);
  //     const data = await response.json();
  //     setTvshowData(data)
  //     setSaveTVShowTitle(data.name);
  //     setSeasons(data.seasons);
  //     window.location.href = "/#upper";
  //     // console.log(placeholderText)
  // }
  // }, [id]);

  useEffect(() => {
    const tvHistory: TVShowHistoryItem[] = JSON.parse(localStorage.getItem("tvShowHistory") || "[]");

    const fetchSeasons = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`);
      const data = await response.json();
      setTvshowData(data)
      setSaveTVShowTitle(data.name);
      setSeasons(data.seasons);

      // window.location.href = "/#upper";
      const match = tvHistory.find(item => item.id === id);
      if (match) {
      // console.log("test156")
      // console.log(selectedSeason)

      //   setHistorySelect(match);
      //   setSelectedSeason(match.season)
      }else{
        setSelectedSeason(1)
        fetchEpisodes()
      }
      // console.log(placeholderText)
  }

    const fetchEpisodes = async () => {
    //   const tvShowContainer = document.getElementById("upper");
    // const stickyMenu = document.querySelector('.stick-menu');
    // const stickyMenuHeight = stickyMenu ? stickyMenu.clientHeight : 110;
  
    
    //   if (tvShowContainer) {
    // window.scrollTo({
    //   top: tvShowContainer.offsetTop - stickyMenuHeight,
    //   // behavior: 'smooth'
    // })}
    
      const response = await fetch(`https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`);
      if (response.status !== 404){
      const data = await response.json();
      
      if (historySelect || tvHistory.find(item => item.id === id)) {
        const selectedHistory = historySelect || tvHistory.find(item => item.id === id);
        if(changeSeasonActive){
        setSelectedEpisode(data.episodes[0])
        setSeasonEpisodes(data.episodes)
        setChangeSeasonActive(false)
        }else{
        if(selectedHistory.episode.episode_number){
        // console.log(selectedHistory.episode.episode_number-1)
        // setTimeout(() => {
        //     // console.log('This runs after 2 seconds');
        //   }, 2000); // 200
        const episodeIndex = Number(selectedHistory.episode.episode_number) - 1||0;
        console.log(episodeIndex)
      // console.log(56)
      // console.log(data.episodes)
      // console.log(data.episodes[episodeIndex])
        setSeasonEpisodes(data.episodes);
        setSelectedEpisode(data.episodes[episodeIndex]);
        console.log(data.episodes[episodeIndex])
        // setSelectedSeason(historySelect.season)
        }
      }
      } else {
        // if(savedSourceIndex.id === id){
        //   save
        // }
        // console.log("test2")
        // console.log(data.episodes[0])
        // console.log(data.episodes)
        // setSelectedSeason(1)
        // setSelectedSeason(1)
        // console.log(data.episodes)
        // console.log(data.episodes[0])
        setSeasonEpisodes(data.episodes);
        setSelectedEpisode(data.episodes[0]);
      }

      if (query !== "") {
        const match = tvHistory.find(item => item.id === id);
        if (match) {
        // console.log("test16")
        // console.log(selectedSeason)

          setSelectedSeason(match.season);
        }
        
      };
      
      // const match = tvHistory.find(item => item.id === id);
      // if (match) {
      // console.log("test156")
      // console.log(selectedSeason)

      //   setSelectedSeason(match.season);
      // }
      // console.log("test16")
      // console.log(selectedSeason)

      setQuery("")
    }
    };

    if (selectedSeason !== null) 
      fetchSeasons();
      fetchEpisodes();
      fetchEpisodes();
    // console.log("test156")
    // console.log(selectedSeason)
    
  }, [selectedSeason,id]);
  
  const handleSeasonSelect = (event: any) => {
    setHistorySelect(null);
    const seasonNumber = Number(event.target.value) || Number(selectedSeason);
    setSelectedSeason(seasonNumber);
    setChangeSeasonActive(true)
    setSelectedEpisode(null);
  };

  const handleEpisodeSelect = (event: any) => {
    setHistorySelect(null);
    const episodeNumber = Number(event.target.value) || Number(selectedEpisode);
    const selectedSeasonEpisodes = seasonEpisodes.filter(ep => ep.episode_number === episodeNumber);
    setSelectedEpisode(selectedSeasonEpisodes[0]);
  };
  useEffect(() => {
    // setTimeout(() => {
    //   // console.log('This runs after 2 seconds');
    // }, 2000); // 2000ms = 2 seconds
    
    if (
      saveTVShowTitle &&
      selectedEpisode?.episode_number !== undefined &&
      selectedSeason !== null
    ) {
      const tvShow = (Array.isArray(tvshowData) ? tvshowData[0] : tvshowData) as TVShow;
  
      const newEntry: TVShowHistoryItem = {
        id,
        title: saveTVShowTitle,
        season: selectedSeason,
        episode: selectedEpisode,
        timestamp: new Date().toISOString(),
        // genre_ids: tvShow?.genres?.map((genre) => genre.id) || [],
        first_air_date: tvShow?.first_air_date,
        genre_ids: tvShow?.genres?.map((genre: { id: number; name: string }) => genre.id) || [],
        poster_path: tvShow?.poster_path || tvShow?.backdrop_path || '',
        type: 'tv',
      };
      if (tvShow?.first_air_date){
        navigate(`/${searchType}/${id}/${saveTVShowTitle?.replace(/\s+/g, '-')}/${selectedSeason}/${selectedEpisode.episode_number}`);
        }
      const tvHistory: TVShowHistoryItem[] = JSON.parse(localStorage.getItem('tvShowHistory') || '[]');
  
      const existingItem = tvHistory.find(
        (item) => item.id === id && item.title === saveTVShowTitle
      );
  
      if (existingItem) {
        const isSameEpisode =
          existingItem.season === newEntry.season &&
          existingItem.episode.episode_number === newEntry.episode.episode_number;
  
        if (isSameEpisode) {
          // console.log("No changes detected. Skipping save.");
          return;
        }
  
        const filteredHistory = tvHistory.filter((item) => item.id !== id);
        const updatedTVHistory = [newEntry, ...filteredHistory];
        localStorage.setItem('tvShowHistory', JSON.stringify(updatedTVHistory));
        // console.log("Updated existing history entry.");
      } else {
        const updatedTVHistory = [newEntry, ...tvHistory];
        localStorage.setItem('tvShowHistory', JSON.stringify(updatedTVHistory));
        // console.log("Added new history entry.");
      }
  
      setHistorySelect(null); // ✅ Reset after save
     
    }
    
  },[selectedEpisode]);
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://vidlink.pro') return;
    
    if (event.data?.type === 'MEDIA_DATA') {
      const mediaData = event.data.data;
      localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
    }
  });
  // ✅ Removed id and title from dependencies // ✅ Removed id from dependencies
  const links = selectedEpisode ? [
    
    `https://vidsrc.net/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidlink.pro/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://111movies.com/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://embed.su/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`,
    `https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`,
    `https://embed.smashystream.com/playere.php?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`,
    `https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode.episode_number}`,
    `https://vidsrc.uk/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidsrc.pro/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`,
    `https://vidjoy.pro/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}`
    // ""




  


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
                          {/* {console.log(season)} */}
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

          <div className='player-container'id='player-container'>
            <SourceScroller
              links={links}
              selectedIndex={selectedTVShowSourceIndex}
              onSelect={setSelectedTVShowSourceIndex}
              searchType={searchType}
            />
            <div id="player">
              <iframe
                title={`player`}
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
