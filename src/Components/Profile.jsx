import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import SignIn from "./SignIn";
import SignOut from "./SignOut";

const Profile = ({ user }) => {
  const [profileID, setProfileID] = useState(user?.uid || "");
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const profileRef = doc(db, "Users", profileID);
      const profileSnapshot = await getDoc(profileRef);
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
  return (
    <>
      {user && user.email ? (
        <>
          <h2 className="mb-5 text-center text-2xl kaushan-script-regular">
            Profile
          </h2>
          <p className="text-center">
            Signed in as <strong>{profileName}</strong>
          </p>
          <img
            src={profileImage}
            alt={`profile image of ${profileName}`}
            className="mx-auto rounded-full "
          />
          <SignOut />
        </>
      ) : (
        <SignIn />
      )}
    </>
  );
};

export default Profile;
