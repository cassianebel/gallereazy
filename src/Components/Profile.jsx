import SignIn from "./SignIn";
import SignOut from "./SignOut";

const Profile = ({ user }) => {
  return (
    <>
      {user && user.email ? (
        <>
          <h2 className="mb-5 text-center text-2xl kaushan-script-regular">
            Profile
          </h2>
          <p className="text-center">
            Signed in as <strong>{user.displayName}</strong>
          </p>
          <img
            src={user.photoURL}
            alt={`profile image of ${user.displayName}`}
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
