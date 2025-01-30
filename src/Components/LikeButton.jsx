import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { FaHeart } from "react-icons/fa6";

const LikeButton = ({ galleryId, initialLikeCount }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const user = auth.currentUser;
  const likeDocRef = user ? doc(db, "Likes", `${user.uid}_${galleryId}`) : null;

  useEffect(() => {
    if (!user) return;

    const checkLikeStatus = async () => {
      const docSnap = await getDoc(likeDocRef);
      console.log(docSnap);
      if (docSnap.exists()) {
        setLiked(true);
      }
    };

    checkLikeStatus();
  }, [user, likeDocRef]);

  const toggleLike = async () => {
    if (!user) {
      alert("You must be logged in to like a gallery.");
      return;
    }

    if (liked) {
      console.log(`Unliking gallery: ${galleryId}, deleting like doc`);
      await deleteDoc(likeDocRef); // Ensure this is executing
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      console.log(`Liking gallery: ${galleryId}, creating like doc`);
      await setDoc(likeDocRef, { userId: user.uid, galleryId });
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <button
      onClick={toggleLike}
      className={`p-2 rounded flex justify-center items-center gap-2 ${
        liked ? "text-rose-700" : "text-black"
      }`}
    >
      <span className="text-black">{likeCount > 0 && likeCount}</span>
      <FaHeart className="text-2xl" />
    </button>
  );
};

export default LikeButton;
