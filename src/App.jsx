import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import "./App.css";
import GoogleSignIn from "./Components/SignInGoogle";
import CreateGallery from "./Components/CreateGallery";
import ReadGallery from "./Components/ReadGallery";
import GalleryFeed from "./Components/GalleryFeed";

function App() {
  const [user] = useAuthState(auth);
  const [gallery, setGallery] = useState("OxEjjMc0URVefmod9gqa");

  return (
    <>
      <GoogleSignIn />

      <CreateGallery user={user} />

      {/* <ReadGallery galleryID={gallery} /> */}

      <GalleryFeed />
    </>
  );
}

export default App;
