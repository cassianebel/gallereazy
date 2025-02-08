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
        profileImage: user.profileImage || "../alien.png",
      },
      { merge: true }
    );

    console.log("User data saved to Firestore");
  } catch (error) {
    console.error("Error creating/updating user in Firestore:", error.message);
  }
};

export const referenceAnImage = async (userID) => {
  const storageRef = ref(storage);
  const fluidRef = ref(storage, "fluid-small.jpg");
  const fluidPath = fluidRef.fullPath;
  console.log(fluidPath);
};
