import { createContext, useRef, useState, useEffect } from 'react';
import { songsData } from '../assets/assets';

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, settrack] = useState(songsData[0]);
  const [playstatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 }
  });

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setPlayStatus(true);
      }).catch((err) => {
        console.error("Play failed:", err);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = (id) => {
    settrack(songsData[id]);
    setPlayStatus(true);
  };

  const previous = () => {
    if (track.id > 0) {
      settrack(songsData[track.id - 1]);
      setPlayStatus(true);
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      settrack(songsData[track.id + 1]);
      setPlayStatus(true);
    }
  };

  useEffect(() => {
    if (audioRef.current && playstatus) {
      audioRef.current.play().catch((err) => {
        console.error("Autoplay blocked:", err);
      });
    }
  }, [track]);

  const seekSong = async(e) => {
    audioRef.current.currentTime=((e.nativeEvent.offsetX/seekBg.current.offsetWidth)*audioRef.current.duration)
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        seekBar.current.style.width = `${Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)}%`;
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          }
        });
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    settrack,
    playstatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
