import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "../firebase";
import { NavLink } from "react-router-dom";
import { FaHeart } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
// import "swiper/css/pagination";
import "swiper/css/scrollbar";

const ReadGallery = ({ galleryID }) => {
  const [imageList, setImageList] = useState([]);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryUrl, setGalleryUrl] = useState("");
  const [profileID, setProfileID] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );

  useEffect(() => {
    // console.log(galleryID);
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
      // console.log(profileSnapshot);
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
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <div className="my-20">
      <div className="w-screen mx-auto ms-[-1rem]">
        <Swiper
          spaceBetween={20}
          slidesPerView={isPortrait ? 1 : 3}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
          modules={[Pagination, Navigation]}
          navigation
          pagination={{ clickable: true }}
          // scrollbar={{ draggable: true }}
          className="bg-black text-white pt-4"
        >
          {imageList.map((image) => (
            <SwiperSlide
              key={image.order}
              className="swiper-slide h-full flex flex-col justify-center items-center"
            >
              <img src={image.url} alt={image.description} className="" />
              <p className="p-2 text-center text-xs">{image.caption}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-between items-center gap-2">
        <div>
          <NavLink
            to={`/profile/${profileID}`}
            className="flex items-center gap-2"
          >
            <h3 className="">{profileName}</h3>
          </NavLink>
        </div>
        <div>
          <NavLink to={`/gallery/${galleryID}`}>
            <h2 className="text-center">{galleryTitle}</h2>
          </NavLink>
        </div>

        <div>
          <FaHeart />
        </div>
      </div>
      {galleryCaption && (
        <div className="flex items-start gap-2">
          <NavLink to={`/profile/${profileID}`}>
            <h4 className="">{profileName}</h4>
          </NavLink>
          <p>{galleryCaption}</p>
        </div>
      )}
    </div>
  );
};

export default ReadGallery;
