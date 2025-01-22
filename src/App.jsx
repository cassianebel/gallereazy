import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import Header from "./Components/Header";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import CreateGallery from "./Components/CreateGallery";
import ReadGallery from "./Components/ReadGallery";
import GalleryFeed from "./Components/GalleryFeed";
import Profile from "./Components/Profile";

function App() {
  const [user] = useAuthState(auth);
  const [gallery, setGallery] = useState("OxEjjMc0URVefmod9gqa");

  return (
    <>
      <Header />
      <div className="max-w-[1700px] mx-auto p-4">
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
          <Route
            path="/gallery/:galleryID"
            element={
              user ? (
                <ReadGallery galleryID={gallery} />
              ) : (
                <Navigate to="/signin" />
              )
            }
          />
          <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
