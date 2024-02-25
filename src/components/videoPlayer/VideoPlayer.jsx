import { useState, useEffect, useRef } from "react";
import { FaHeart } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { FaArrowAltCircleDown } from "react-icons/fa";

import axios from "axios";
import "./VideoPlayer.css";

const TOKEN = process.env.REACT_APP_VIDEO_TOKEN;

const VideoPlayer = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [isPlaying, setIsPlaying] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likes, setLikes] = useState(Array(videos.length).fill(false));
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const API_KEY = TOKEN;
        const response = await axios.get(
          `https://api.pexels.com/videos/popular?per_page=10&page=1`,
          {
            headers: {
              Authorization: API_KEY,
            },
          }
        );
        setVideos(response.data.videos);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.querySelector("video").focus();
    }
  }, [videos, likes]);

  const videoHandle = (index) => {
    const newIsPlaying = [...isPlaying];
    newIsPlaying[index] = !newIsPlaying[index];
    setIsPlaying(newIsPlaying);

    const video = document.getElementById(`video-${index}`);
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowUp") {
      if (currentIndex === 0) {
        setCurrentIndex(videos.length - 1);
      } else {
        setCurrentIndex((prev) => prev - 1);
      }
    } else if (event.key === "ArrowDown") {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };
  const handleLike = (index) => {
    setLikes((like) => {
      const updatedLike = [...like];
      updatedLike[index] = !updatedLike[index];
      return updatedLike;
    });
    playerRef.current.focus();
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };
  const handlePrev = () => {
    if (currentIndex === 0) {
      setCurrentIndex(videos.length - 1);
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };
  return (
    <>
      <h1 className="heading">SHORTS</h1>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <div
          className="videoPlayer"
          ref={playerRef}
          onKeyDown={handleKeyUp}
          tabIndex="-1">
          {videos &&
            videos?.map((video, index) => (
              <>
                <div
                  className={`${
                    currentIndex === index ? "show" : "hide"
                  } videoDiv`}>
                  <video
                    className="currentVideo"
                    id={`video-${index}`}
                    key={index}
                    width="500"
                    height="500"
                    autoPlay
                    loop
                    src={video?.video_files[0]?.link}
                    onClick={() => videoHandle(index)}
                  />
                  <div className="videoLike">
                    <FaHeart
                      size={30}
                      onClick={() => handleLike(index)}
                      className={`${likes[index] ? "liked" : "like"} ${
                        currentIndex === index ? "show" : "hide"
                      } navigateBtn`}
                    />
                    {isMobile && (
                      <>
                        <FaArrowAltCircleUp
                          className="navigateBtn"
                          size={30}
                          onClick={handlePrev}
                        />
                        <FaArrowAltCircleDown
                          className="navigateBtn"
                          size={30}
                          onClick={handleNext}
                        />
                      </>
                    )}
                  </div>
                </div>
              </>
            ))}
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
