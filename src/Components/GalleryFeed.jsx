import { useState, useEffect } from "react";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import ReadGallery from "./ReadGallery";

const GalleryFeed = () => {
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const galleriesCollectionRef = collection(db, "Galleries");
        const galleriesQuery = query(galleriesCollectionRef);
        const querySnapshot = await getDocs(galleriesQuery);
        const galleries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        galleries.sort((a, b) => b.createdAt - a.createdAt);
        setGalleries(galleries);
      } catch (error) {
        console.error("Error fetching decks:", error.message);
      }
    };
    fetchGalleries();
  }, []);

  return (
    <div>
      {galleries.map((gallery) => (
        <div key={gallery.id}>
          <ReadGallery galleryID={gallery.id} />
        </div>
      ))}
    </div>
  );
};

export default GalleryFeed;
