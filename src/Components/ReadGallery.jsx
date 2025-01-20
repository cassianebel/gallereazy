import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";

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
        res.items.forEach((itemRef) => {
          getDownloadURL(itemRef)
            .then((url) => {
              getMetadata(itemRef)
                .then((metadata) => {
                  setImageList((prev) => [
                    ...prev,
                    {
                      url: url,
                      description:
                        metadata?.customMetadata?.description ||
                        "No description",
                    },
                  ]);
                })
                .catch((error) => {
                  console.error("Error fetching metadata:", error);
                });
            })
            .catch((error) => {
              console.error("Error fetching download URL:", error);
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
      {imageList.map((image) => (
        <img key={image.url} src={image.url} alt={image.description} />
      ))}
    </div>
  );
};

export default ReadGallery;
