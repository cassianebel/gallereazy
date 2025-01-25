import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { NavLink } from "react-router-dom";

const ReadGallery = ({ galleryID }) => {
  const [imageList, setImageList] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [profileID, setProfileID] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    console.log(galleryID);
    const fetchData = async () => {
      const galleryRef = doc(db, "Galleries", galleryID);
      const gallerySnapshot = await getDoc(galleryRef);
      if (gallerySnapshot.exists()) {
        const galleryData = gallerySnapshot.data();
        // console.log(galleryData);
        setProfileID(galleryData.userID);
        setGalleryTitle(galleryData.title);
        setGalleryCaption(galleryData.caption);
        setGalleryUrl(`images/${galleryData.userID}/${galleryID}`);
      } else {
        console.log("Gallery not found");
      }
    };
    fetchData();
  }, [galleryID]);

  useEffect(() => {
    const fetchData = async () => {
      const profileRef = doc(db, "Users", profileID);
      const profileSnapshot = await getDoc(profileRef);
      console.log(profileSnapshot);
      if (profileSnapshot.exists()) {
        const profileData = profileSnapshot.data();
        setProfileName(profileData.name);
        setProfileImage(profileData.profileImage);
        // console.log(profileData);
      } else {
        console.log("Profile not found");
      }
    };
    fetchData();
  }, [profileID]);

  useEffect(() => {
    const listRef = ref(storage, galleryUrl);
    listAll(listRef)
      .then((res) => {
        const promises = res.items.map((itemRef) => {
          return getDownloadURL(itemRef).then((url) => {
            return getMetadata(itemRef).then((metadata) => {
              return {
                url: url,
                description:
                  metadata?.customMetadata?.description || "No description",
                caption: metadata?.customMetadata?.caption || "",
                order: parseInt(metadata?.customMetadata?.order) || 0,
              };
            });
          });
        });

        Promise.all(promises)
          .then((results) => {
            results.sort((a, b) => a.order - b.order);
            setImageList(results);
          })
          .catch((error) => {
            console.error("Error processing items:", error);
          });
      })
      .catch((error) => {
        console.error("Error listing items:", error);
      });
  }, [galleryUrl]);

  return (
    <div>
      <NavLink to={`/gallery/${galleryID}`}>
        <h2>{galleryTitle}</h2>
      </NavLink>
      <p>{galleryCaption}</p>
      <img
        src={profileImage}
        alt={`Profile image of ${profileName}`}
        className="rounded-full"
      />
      <NavLink to={`/profile/${profileID}`}>
        <p>{profileName}</p>
      </NavLink>
      <div className="flex gap-2">
        {imageList.map((image) => (
          <div key={image.order} className={image.order}>
            <img
              src={image.url}
              alt={image.description}
              className="max-w-full"
            />
            <p>{image.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadGallery;
