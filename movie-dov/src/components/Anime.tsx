import React, { useEffect, useState } from 'react';
import SourceScroller from './SourceScroller';

interface AnimeData {
  id: number;
  title: string;
  main_picture?: {
    medium: string;
    large: string;
  };
  synopsis?: string;
  start_date?: string;
}

interface AnimeHistoryItem {
  id: number;
  title: string;
  timestamp: string;
  poster_path?: string;
  type: string;
}

const Anime: React.FC<{
  id: number;
  historySelect: any;
  setSearchType: React.Dispatch<React.SetStateAction<any>>;
  setHistorySelect: React.Dispatch<React.SetStateAction<any>>;
  searchType: string;
  placeholderText: string;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<any>>;
}> = ({ id, historySelect, setSearchType, setHistorySelect, searchType, query, setQuery }) => {
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [episodeNumber, setEpisodeNumber] = useState(1);

  const [selectedSourceIndex, setSelectedSourceIndex] = useState<number>(() => {
    const saved = localStorage.getItem("selectedAnimeSourceIndex");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem("selectedAnimeSourceIndex", selectedSourceIndex.toString());
  }, [selectedSourceIndex]);

  
  useEffect(() => {
    const fetchAnime = async () => {
      // fetch(`/api/mal-anime-details?id=${movieId}&fields=id,title,start_date,main_picture,synopsis,genres,mean,num_episodes,status`)
      // .then((res) => {
      //   if (!res.ok) throw new Error("Request failed");
      //   return res.json();
      // })
      // .then((data) => {
      //   console.log(data); // or 
      //   setAnimeSelected(data);
      // })
      // .catch((err) => {
      //   console.error("Fetch error:", err);
      // });
      const res = await fetch(`/api/mal-anime-details?id=${id}&fields=id,title,start_date,main_picture,synopsis,genres,mean,num_episodes,status`);
      const data = await res.json();
      setAnimeData(data);
      console.log(data)
      // const season = await fetch(`/api/mal-anime-details?id=${id}&fields=id,title,start_date,main_picture,synopsis,genres,mean,num_episodes,status`);
      // const seasonData = await season.json();
      // console.log(seasonData)
    };
    fetchAnime();
    
  }, [id]);

  useEffect(() => {
    if (animeData) {
      const newEntry: AnimeHistoryItem = {
        id,
        title: animeData.title,
        timestamp: new Date().toISOString(),
        poster_path: animeData.main_picture?.medium || '',
        type: 'anime',
      };

      const animeHistory: AnimeHistoryItem[] = JSON.parse(localStorage.getItem('animeHistory') || '[]');
      const existing = animeHistory.find(item => item.id === id);

      let updatedHistory;
      if (existing) {
        updatedHistory = [newEntry, ...animeHistory.filter(item => item.id !== id)];
      } else {
        updatedHistory = [newEntry, ...animeHistory];
      }
      localStorage.setItem('animeHistory', JSON.stringify(updatedHistory));
    }
  }, [animeData]);

  const links = animeData ? [
    `https://vidlink.pro/anime/${id}/${episodeNumber}/Dub?fallback=true`,
    `https://vidsrc.to/embed/anime/${id}`,
    `https://vidlink.pro/anime/${id}`,
    `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1`,
    `https://vidsrc.uk/embed/anime/${id}`,
  ] : [];

  return (
    <div>
      {animeData && (
        <>
          <div className="tv-show-container">
            <img className="tv-show-poster" src={animeData.main_picture?.medium} alt="Anime poster" />
            <div className="tv-show-info">
              <h1 className="tv-title">{animeData.title}</h1>
              <p className="tv-overview">{animeData.synopsis}</p>
            </div>
          </div>

          <div className='player-container'>
            <SourceScroller
              links={links}
              selectedIndex={selectedSourceIndex}
              onSelect={setSelectedSourceIndex}
              searchType={searchType}
            />
            <div id="player">
              <iframe
                src={links[selectedSourceIndex]}
                width="100%"
                height="100%"
                allowFullScreen
              />
            </div>
          </div>
          <div className="episode-nav">
            <button className="arrow-button" onClick={() => {    if (episodeNumber > 1) {
              episodeNumber - 1}}}
              >
              &lt;
            </button>
            <span className="episode-label">Episode {safeEpisode.episode_number}</span>
            <button className="arrow-button" onClick={() => {  episodeNumber + 1}} >
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Anime;
