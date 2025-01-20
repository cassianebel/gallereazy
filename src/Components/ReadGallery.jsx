import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

const ReadGallery = ({ galleryID }) => {
  const [imageList, setImageList] = useState([]);
  const [metadataList, setMetadataList] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const galleryRef = doc(db, "Galleries", galleryID);
      const gallerySnapshot = await getDoc(galleryRef);
      if (gallerySnapshot.exists()) {
        const galleryData = gallerySnapshot.data();
        console.log(galleryData);
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
    const listRef = ref(storage, galleryUrl);
    listAll(listRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef).then((url) => {
            setImageList((prev) => {
              if (!prev.includes(url)) {
                return [...prev, url];
              }
              return prev;
            });
          });
          getMetadata(itemRef).then((metadata) => {
            setMetadataList((prev) => {
              if (!prev.some((item) => item.fullPath === metadata.fullPath)) {
                return [...prev, metadata];
              }
              return prev;
            });
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [galleryUrl]);

  return (
    <div>
      <h2>{galleryTitle}</h2>
      <p>{galleryCaption}</p>
      {imageList.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={
            metadataList[index]?.customMetadata?.description || "No description"
          }
        />
      ))}
    </div>
  );
};

export default ReadGallery;
