import React from "react";
import "./App.css";
import VideoPlayer from "./components/videoPlayer/VideoPlayer";

const App = () => {
  return (
    <>
      <div className="app">
        <div className="app_videos">
          <VideoPlayer />
        </div>
      </div>
    </>
  );
};

export default App;
