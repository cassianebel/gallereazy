import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import Input from "./Input";
import Button from "./Button";

const CreateGallery = ({ user }) => {
  const [galleryTitle, setGalleryTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([{ image: "", description: "" }]);

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
            },
          };

          uploadBytes(storageRef, file.image, metadata).then((snapshot) => {
            console.log("Uploaded a file!");
          });
        }
      });
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
    setFiles((prevFiles) => [...prevFiles, { image: "", description: "" }]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          label="title"
          name="title"
          type="text"
          value={galleryTitle}
          changeHandler={(e) => setGalleryTitle(e.target.value)}
          required={true}
        />
        <Input
          label="caption"
          name="caption"
          type="text"
          required={false}
          value={caption}
          changeHandler={(e) => setCaption(e.target.value)}
        />
        {files.map((file, index) => (
          <div key={index}>
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
