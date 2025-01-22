import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";

const CreateGallery = ({ user }) => {
  const [galleryTitle, setGalleryTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([
    { image: "", description: "", order: 0 },
    { image: "", description: "", order: 1 },
    { image: "", description: "", order: 2 },
  ]);
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("You must be signed in to create a gallery.");
      return;
    }

    if (!files[0]) {
      console.error("No file selected");
      return;
    }

    try {
      // Add a new document to the "Galleries" collection
      const galleryRef = await addDoc(collection(db, "Galleries"), {
        title: galleryTitle,
        caption: caption,
        userID: user.uid,
        createdAt: new Date(),
      });

      // Upload each file to Firebase Storage
      files.forEach((file) => {
        if (file.image) {
          const storageRef = ref(
            storage,
            `images/${user.uid}/${galleryRef.id}/${file.image.name}`
          );
          const metadata = {
            contentType: file.image.type,
            customMetadata: {
              owner: user.uid,
              description: file.description,
              order: file.order,
            },
          };

          uploadBytes(storageRef, file.image, metadata).then((snapshot) => {
            console.log("Uploaded a file!");
          });
        }
      });
      setUploaded(true);
      // setTimeout(() => {
      //   navigate("/discover");
      // }, 2000);
    } catch (error) {
      console.error("Error creating gallery: ", error);
    }
  };

  const handleFileChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index]["image"] = e.target.files[0];
    setFiles(newFiles);
  };

  const handleDescriptionChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index]["description"] = e.target.value;
    setFiles(newFiles);
  };

  const addFile = () => {
    setFiles((prevFiles) => [
      ...prevFiles,
      { image: "", description: "", order: files.length },
    ]);
  };

  if (uploaded) {
    return (
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-4xl mb-4">Gallery Created!</h2>
        <Button text="Go to Feed" action={() => navigate("/discover")} />
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <Input
          label="title"
          name="title"
          type="text"
          value={galleryTitle}
          changeHandler={(e) => setGalleryTitle(e.target.value)}
          required={true}
        />
        <label htmlFor="caption" className="block mx-2 uppercase">
          Caption
        </label>
        <textarea
          name="caption"
          id="caption"
          className="block w-full p-2 mb-2 border border-zinc-300 rounded-md "
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {files.map((file, index) => (
          <div key={index} className="p-2 my-4 bg-zinc-100 rounded-md">
            <Input
              type="file"
              label={`Image ${index + 1}`}
              name={`image-${index + 1}`}
              changeHandler={(e) => handleFileChange(e, index)}
            />
            <Input
              type="text"
              label={`Description for Image ${index + 1}`}
              name={`description-${index + 1}`}
              changeHandler={(e) => handleDescriptionChange(e, index)}
            />
          </div>
        ))}
        <Button
          text="Add Another Image"
          label="Add another image"
          action={addFile}
          style="primary"
        />
        <Button type="submit" text="Create Gallery" />
      </form>
    </div>
  );
};

export default CreateGallery;
