import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";

const CommentList = ({ galleryId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "Comments"),
      where("galleryId", "==", galleryId),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const comment = { id: docSnap.id, ...docSnap.data() };

          // Fetch user name from Users collection
          const userRef = doc(db, "Users", comment.userId);
          const userSnap = await getDoc(userRef);
          comment.userName = userSnap.exists()
            ? userSnap.data().name
            : "Unknown User";

          return comment;
        })
      );

      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [galleryId]);

  return (
    <div className="comments">
      {/* {comments.length === 0 ? <p>No comments yet.</p> : null} */}
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <p>
            <strong>{comment.userName}:</strong> {comment.text}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
