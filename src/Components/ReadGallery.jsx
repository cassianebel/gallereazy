import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { use } from "react";

const ReadGallery = ({ galleryID }) => {
  const [imageList, setImageList] = useState([]);
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
        const promises = res.items.map((itemRef) => {
          return getDownloadURL(itemRef).then((url) => {
            return getMetadata(itemRef).then((metadata) => {
              return {
                url: url,
                description:
                  metadata?.customMetadata?.description || "No description",
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
      <h2>{galleryTitle}</h2>
      <p>{galleryCaption}</p>
      <div className="flex gap-2">
        {imageList.map((image) => (
          <div key={image.order} className={image.order}>
            <img
              src={image.url}
              alt={image.description}
              className="max-w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadGallery;
