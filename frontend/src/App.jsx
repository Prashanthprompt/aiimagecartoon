import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useFetcher,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Login from "./components/login/Login";
// import video1 from "./assets/video1.mp4";
// import video2 from "./assets/video2.mp4";
import MainHome from "./components/mainHome/MainHome";
import Home from "./components/home/Home";
import img1 from "./assets/img1.jpg";
import img2 from "./assets/img2.jpg";
import Upload from "./components/upload/Upload";
import ConvertedImage from "./components/convertedImage/convertedImage";

// const videos = [
//   {
//     title: "Clap",
//     url: video1,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//     lang: "english",
//   },
//   {
//     title: "Numbers",
//     url: video2,
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
//     lang: "english",
//   },
// ];

const images = [
  {
    title: "img1",
    url: img1,
  },
  {
    title: "img2",
    url: img2,
  },
];

function App() {
  // const [searchQuery, setSearchQuery] = useState("");
  // const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showModifiedHome, setShowModifiedHome] = useState(true);
  const [loginStatus, setLoginStatus] = useState(
    sessionStorage.getItem("loginStatus") === "true"
  );

  console.log(showModifiedHome);

  useEffect(() => {
    sessionStorage.setItem("loginStatus", loginStatus);
  }, [loginStatus]);

  useEffect(() => {
    console.log("Modified Home state:", showModifiedHome);
    if (loginStatus) {
      setShowModifiedHome(true);
      const timer = setTimeout(() => {
        setShowModifiedHome(false);
        console.log("Modified Home hidden after 5 seconds");
      }, 5000);

      return () => clearTimeout(timer); // Cleanup timer
    }
  }, [loginStatus]);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <Router>
      <Navbar
        handleSearch={handleSearch}
        openSearchModal={openSearchModal}
        loginStatus={loginStatus}
        setLoginStatus={setLoginStatus}
      />
      <Routes>
        {!loginStatus ? (
          <Route path="*" element={<Navigate to="/login" replace />} />
        ) : (
          <>
            {showModifiedHome ? (
              <Route
                path="*"
                element={
                  <MainHome
                    images={images}
                    setShowModifiedHome={setShowModifiedHome}
                  />
                } // Modified home
              />
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/converted-image" element={<ConvertedImage />} />
              </>
            )}
          </>
        )}
        <Route
          path="/login"
          element={<Login setLoginStatus={setLoginStatus} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
