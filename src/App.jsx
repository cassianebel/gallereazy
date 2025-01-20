import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import "./App.css";
import GoogleSignIn from "./Components/SignInGoogle";
import CreateGallery from "./Components/CreateGallery";
import Upload from "./Components/Upload";

function App() {
  const [image, setImage] = useState(null);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const fluidRef = ref(storage, "images/eclipse.jpg");
        const imageUrl = await getDownloadURL(fluidRef);
        setImage(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <>
      <GoogleSignIn />

      <CreateGallery user={user} />
    </>
  );
}

export default App;
