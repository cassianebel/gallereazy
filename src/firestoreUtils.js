import {
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import { ref } from "firebase/storage";

export const createUserInDatabase = async (user) => {
  try {
    const userDocRef = doc(db, "Users", user.uid);
    await setDoc(
      userDocRef,
      {
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
      },
      { merge: true }
    );

    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error creating/updating user in Firestore:", error.message);
  }
};

export const fetchPublicGalleries = async () => {
  try {
    const galleriesCollectionRef = collection(db, "Galleries");
    const galleriesQuery = query(
      galleriesCollectionRef,
      where("public", "==", true)
    );
    const querySnapshot = await getDocs(galleriesQuery);
    const galleries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return galleries;
  } catch (error) {
    console.error("Error fetching galleries:", error.message);
  }
};

export const fetchPrivateGalleries = async (userID) => {
  try {
    const galleriesCollectionRef = collection(db, "Galleries");
    const galleriesQuery = query(
      galleriesCollectionRef,
      where("userID", "==", userID)
    );
    const querySnapshot = await getDocs(galleriesQuery);
    const galleries = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return galleries;
  } catch (error) {
    console.error("Error fetching galleries:", error.message);
  }
};

export const referenceAnImage = async (userID) => {
  const storageRef = ref(storage);
  const fluidRef = ref(storage, "fluid-small.jpg");
  const fluidPath = fluidRef.fullPath;
  console.log(fluidPath);
};
