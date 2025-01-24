import { useState, useEffect } from "react";
import {
  query,
  collection,
  getDocs,
  doc,
  getDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { NavLink, useParams } from "react-router-dom";
import ReadGallery from "./ReadGallery";

const ProfileGalleries = ({ user }) => {
  const { profileID } = useParams();
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [galleries, setGalleries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profileRef = doc(db, "Users", profileID);
      const profileSnapshot = await getDoc(profileRef);
      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();
        setProfileName(profileData.name);
        setProfileImage(profileData.profileImage);
        console.log(profileData);
      } else {
        console.log("Profile not found");
      }
    };
    fetchData();
  }, [profileID]);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const galleriesCollectionRef = collection(db, "Galleries");
        const galleriesQuery = query(
          galleriesCollectionRef,
          where("userID", "==", profileID)
        );
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
      <h2>{profileName}</h2>
      <img
        src={profileImage}
        alt={`Profile image of ${profileName}`}
        className="rounded-full"
      />
      {galleries.map((gallery) => (
        <div key={gallery.id}>
          <ReadGallery galleryID={gallery.id} />
        </div>
      ))}
    </div>
  );
};

export default ProfileGalleries;
