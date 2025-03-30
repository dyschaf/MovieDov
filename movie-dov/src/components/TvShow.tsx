import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import DisplayHistory from "./DisplayHistory"

// import Accordion from 'react-bootstrap/Accordion';
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
interface TVShowHistoryItem {
  id: number;
  title: string;
  season: any;
  episode: any;
  timestamp: string;
}
// interface Props {
//   selectedMovieId: number;
// }

// const TvShow: React.FC = ({ id, setHistorySelect() }) => {
// const [tvShowHistory, setTvShowHistory] = useState<any[]>([]);
const TvShow: React.FC<{ id: number; historySelect:any ;setSearchType:React.Dispatch<React.SetStateAction<any>>;setHistorySelect:React.Dispatch<React.SetStateAction<any>>; searchType:string}> = ({ id, historySelect, setSearchType ,setHistorySelect, searchType}) =>{
  // Your component logic here
// console.log(historySelect)

  const [seasons, setSeasons] = useState<Season[]>([]);
  const [seasonEpisodes, setSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [saveEpisode, setaveEpisode] = useState<Episode | null>(null);
  const [saveTVShowTitle, setSaveTVShowTitle] = useState<string | null>(null);
  const [propsHistorySelect, setPropsHistorySelect] = useState<string | null>(null);
  const [forceRender, setForceRender] = useState(false);
  // const episodeIndex = Number ;
  const safeEpisode = selectedEpisode ?? { episode_number: "" };
  const episodeIndex = (Number(historySelect?.episode) || 1) - 1;
  // const chosenSeason:number= historySelect.season || 1
  // const Indexepisode = (Number(historySelect?.episode) || 1) - 1;
  let valueHoler 
  useEffect(() => {
    if (historySelect?.season) {
      setSelectedSeason(historySelect.season);}
    if (historySelect?.episode) {
      setSelectedEpisode(historySelect.episode);
      // console.log(selectedEpisode);
      // console.log(historySelect.episode.episode_number)
    }
    if (historySelect?.title) {
      setSaveTVShowTitle(historySelect.title);
    }
  }, [historySelect?.season, historySelect?.episode,historySelect?.title,]);
  useEffect(() => {
    if (historySelect) {
      // console.log("History Selected:", historySelect);

      if (historySelect.season) {
        setSelectedSeason(historySelect.season)
        setSearchType("tv");
       
      } else {
      
      }
    }
    // console.log('start')
    const fetchSeasons = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`
      );
      const data = await response.json();    
      setSaveTVShowTitle(data.name)
      setSeasons(data.seasons);
      window.location.href = "/#upper"
    };
    if (selectedSeason !== null ) {
      const fetchEpisodes = async () => {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=d1c58c8d09e1707f8ae98a1832dd15a3&language=en-US`
        );
        // console.log('fetch')
        const data = await response.json();
        if (historySelect) {
          
          // console.log(data.season_number)
          const episodeIndex = Number(historySelect.episode.episode_number) -1
          setSelectedEpisode(data.episodes[episodeIndex])
          // const indexep = Number(historySelect.episode.episode_number) -1
          setSeasonEpisodes(data.episodes);         
        }else{
          setSeasonEpisodes(data.episodes);
          setSelectedEpisode(data.episodes[0]);
        }
      };
      if (historySelect) {
        setSelectedSeason(historySelect.season)
        id= historySelect.id
      }
      fetchEpisodes();

    }

      fetchSeasons();
      setTimeout(() => {
      // setHistorySelect(null)  
      }, (100000000000));
    
  }, [selectedSeason, id]);

  const handleSeasonSelect = (event:any) => {
    
      setHistorySelect(null)
    const seasonNumber = Number(event.target.value)|| Number(selectedSeason);
      setSelectedSeason(seasonNumber);
      setSelectedEpisode(null);
    
  };

  const handleEpisodeSelect = (event: any) => {
    setHistorySelect(null)
    const episodeNumber = Number(event.target.value)|| Number(selectedEpisode);
    const selectedSeasonEpisodes = seasonEpisodes.filter(
      (episode) => episode.episode_number === episodeNumber
      );     
      setSelectedEpisode(selectedSeasonEpisodes[0])
  };
  useEffect(() => {
    if (
      saveTVShowTitle &&  // ✅ Ensure title exists
      selectedEpisode?.episode_number !== undefined &&  // ✅ Ensure episode exists
      selectedSeason !== null // ✅ Ensure season exists
    ) {
      // setTimeout(() => {
      //   // Code to execute after 5 seconds
      // }, 1000000);
  
      const newEntry: TVShowHistoryItem = {
        id: id,
        title: saveTVShowTitle,
        season: selectedSeason,
        episode: selectedEpisode,
        timestamp: new Date().toISOString(),
      };
  
      
      const tvHistory: TVShowHistoryItem[] = JSON.parse(localStorage.getItem("tvShowHistory") || "[]");

      // ✅ Find entry where both ID and Title match (ensuring title consistency)
      const existingItem = tvHistory.find((item) => item.id === id && item.title === saveTVShowTitle);
  
      if (existingItem) {
        // ✅ **Check if season and episode are the same**
        if (existingItem.season === newEntry.season && existingItem.episode === newEntry.episode) {
          // console.log("No changes detected. Skipping save.");
          return;
        }
  
        // ✅ Remove the old entry before updating
        const filteredHistory = tvHistory.filter((item) => item.id !== id);
  
        // ✅ Save updated history with the new entry
        const updatedTVHistory = [newEntry, ...filteredHistory];
        // console.log("Updated TV Show History:", updatedTVHistory);
        localStorage.setItem("tvShowHistory", JSON.stringify(updatedTVHistory));
      } else {
        // ✅ If the entry does not exist, save it as a new entry
        const updatedTVHistory = [newEntry, ...tvHistory];
        // console.log("New TV Show History Entry:", updatedTVHistory);
        localStorage.setItem("tvShowHistory", JSON.stringify(updatedTVHistory));
      }
  
      setHistorySelect(null); // ✅ Reset history selection after saving
    }
  }, [selectedEpisode]); // ✅ Removed `id` and `title` from dependencies // ✅ Removed `id` from dependencies
  return (
    <div>
      {/* <DisplayHistory/> */}
      {selectedEpisode && (
        <div>
          <Accordion defaultActiveKey="5">
          <Accordion.Item eventKey="0">
        <Accordion.Header>Source 1</Accordion.Header>
        <Accordion.Body>
        {/* <iframe src={`https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`}  width="100%" height="100%" allowFullScreen></iframe> */}
   
              </Accordion.Body>
      </Accordion.Item>  
        <Accordion.Item eventKey="2">
        <Accordion.Header>Source 2</Accordion.Header>
        <Accordion.Body>
        <iframe id="iframe" src={`https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`} width="100%" height="100 %"  allowFullScreen={true}></iframe>
{/* test */}
        </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="3">
        <Accordion.Header>Source 3</Accordion.Header>
        <Accordion.Body>

          
        <iframe
              src={`https://embed.smashystream.com/playere.php?tmdb=${id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="4">
        <Accordion.Header>Source 4</Accordion.Header>
        <Accordion.Body>

          
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              src={`https://vidsrc.to/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}  `}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="5">
        <Accordion.Header>Source 5</Accordion.Header>
        <Accordion.Body>

          
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              src={`https://vidsrc.net/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}  `}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="6">
        <Accordion.Header>Source 6</Accordion.Header>
        <Accordion.Body>

        {/* src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode.episode_number}  `} */}
          
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              // xsrc={`https://multiembed.mov/directstream.php?video_id=tt6263850  `}
              src={`https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${selectedSeason}&e=${selectedEpisode.episode_number}  `}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="7">
        <Accordion.Header>Source 7</Accordion.Header>
        <Accordion.Body>

          
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              src={`https:vidsrc.uk/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}  `}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       <Accordion.Item eventKey="8">
        <Accordion.Header>Source 8</Accordion.Header>
        <Accordion.Body>

          
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              src={`https://vidsrc.pro/embed/tv/${id}/${selectedSeason}/${selectedEpisode.episode_number}  `}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
      {/* </Accordion>
      <Accordion> */}
       <Accordion.Item eventKey="9">
        <Accordion.Header>Anime</Accordion.Header>
        <Accordion.Body>
        <iframe
              // xsrc={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              src={`https://aniwave.cool`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>  
       {/* <Accordion.Item eventKey="5"> */}
        {/* <Accordion.Header>Anime</Accordion.Header>
        <Accordion.Body>
        <iframe
              // src={`https://aniwave.to/watch/technoroid-overmind-${id}?ep=96946{id}&season=${selectedSeason}&episode=${selectedEpisode.episode_number}`}
              // src={`https://aniwave.to/home`}
              src={`https://aniwave.to/watch/oshi-no-ko2.4q1jm/ep-9?type=dub`}
              // src={`https://aniwave.to/home`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
              </Accordion.Body>
      </Accordion.Item>   */}
    </Accordion>
      {/* <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>First iframe</Accordion.Header>
          <Accordion.Body>
            
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Second iframe</Accordion.Header>
          <Accordion.Body>
            <iframe
              src={`https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Third iframe</Accordion.Header>
          <Accordion.Body>
            <iframe
              src={`https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`}
              width="100%"
              height="100%"
              allowFullScreen
            ></iframe>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}

      {/* <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Fourth iframe</Accordion.Header>
          <Accordion.Body> */}
            {/* <iframe
              id="iframe"
              src={`https://www.2embed.cc/embedtv/${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`}
              width="100%"
              height="100%"
              allowFullScreen={true}
            ></iframe> */}
          {/* </Accordion.Body>
        </Accordion.Item>
      </Accordion> */}
        {/* <button onClick={handleFullScreenClick}>Fullscreen</button> */}
        
        {/* <iframe src={`https://embed.smashystream.com/playere.php?tmdb=${id}&season=${selectedSeason}&${selectedEpisode.episode_number}`}  width="100%" height="100%" allowFullScreen></iframe> */}
        {/* <iframe src={`https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`}  width="100%" height="100%" allowFullScreen></iframe> */}
        {/* <iframe src={`https://vidsrc.me/embed/${id}/${selectedSeason}-${selectedEpisode.episode_number}`}  width="100%" height="100%" allowFullScreen></iframe> */}
        {/* <iframe id="iframe" src={`https://www.2embed.cc/embed/${id}&s=${selectedSeason}&e=${selectedEpisode.episode_number}`} width="100%" height="100 %"  allowFullScreen={true}></iframe> */}

          <h4>Episode - {selectedEpisode.name}</h4>
          {/* <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${selectedEpisode.still_path}`} alt={selectedEpisode.name} /> */}
          <p>{selectedEpisode.overview}</p>
        </div>
      )}
      {/* <h1>{seasons.name}</h1> */}
      {/* <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2/${seasons.poster_path}`} alt={""} /> */}
      {/* <p>{seasons.overview}</p> */}
      <div className='seasonEpisode'>
      <div>
        <h2>Seasons</h2>
        <select onChange={handleSeasonSelect} value={selectedSeason ?? ""}>
      
        {seasons?.map((season) => {
          if (season.season_number === 0) {
            return null; // or you can use 'continue' statement here
          }
          return (
            <option key={season.id} value={season.season_number}>
              Season {season.season_number}
            </option>
          );
        })}

        </select>

      </div>
      {selectedSeason && (
        <div>
          <h2>Episodes</h2>
          <select className='episodes' onChange={handleEpisodeSelect} value={safeEpisode.episode_number} >
            {seasonEpisodes?.map((episode) => (
              <option key={episode.id} value={episode.episode_number}>
                Episode {episode.episode_number} - {episode.name}
              </option>
            ))}
          </select>
        </div>
      )}
      </div>
      
    </div>
  );
};

export default TvShow;
