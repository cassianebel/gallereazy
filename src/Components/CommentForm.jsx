import { useState } from "react";
import { db } from "../firebase"; // Ensure Firebase is initialized
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const CommentForm = ({ galleryId, user }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    if (!user) {
      alert("You must be logged in to comment.");
      return;
    }

    try {
      await addDoc(collection(db, "Comments"), {
        galleryId,
        userId: user.uid,
        text: comment,
        timestamp: serverTimestamp(),
      });
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="block w-full p-2 mb-2 bg-zinc-100 bg-opacity-0 placeholder:text-zinc-500"
      />
      {/* <button type="submit">Post</button> */}
    </form>
  );
};

export default CommentForm;
