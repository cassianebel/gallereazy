import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";

const Upload = ({ user }) => {
  const [files, setFiles] = useState([{ image: "", description: "" }]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      console.error("You must be signed in to upload an image.");
      return;
    }

    if (!files[0]) {
      console.error("No file selected");
      return;
    }

    files.forEach((file) => {
      if (file.image) {
        const storageRef = ref(
          storage,
          `images/${user.uid}/${file.image.name}`
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
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <Button text="Submit" label="Upload" type="submit" style="primary" />
      </form>
    </div>
  );
};

export default Upload;
