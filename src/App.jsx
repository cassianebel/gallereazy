import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Header from "./Components/Header";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import CreateGallery from "./Components/CreateGallery";
import GalleryFeed from "./Components/GalleryFeed";
import Profile from "./Components/Profile";
import GalleryPage from "./Components/GalleryPage";
import ProfileGalleries from "./Components/ProfileGalleries";

function App() {
  const [theme, setTheme] = useState("light");
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={theme}>
      <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 pb-20 min-h-screen transition-all duration-300">
        <Header toggleTheme={toggleTheme} />
        <div className="max-w-[1700px] mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                user ? <Navigate to="/discover" /> : <Navigate to="/signin" />
              }
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/discover"
              element={user ? <GalleryFeed /> : <Navigate to="/signin" />}
            />
            <Route
              path="/create"
              element={
                user ? <CreateGallery user={user} /> : <Navigate to="/signin" />
              }
            />
            <Route path="/gallery/:galleryID" element={<GalleryPage />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route
              path="/profile/:profileID"
              element={<ProfileGalleries user={user} />}
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
