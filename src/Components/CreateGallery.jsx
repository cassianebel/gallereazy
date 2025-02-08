import { useState, useRef } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Input from "./Input";
import Button from "./Button";

const CreateGallery = ({ user }) => {
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [files, setFiles] = useState([
    { image: "", description: "", caption: "", order: 0 },
    { image: "", description: "", caption: "", order: 1 },
    { image: "", description: "", caption: "", order: 2 },
  ]);
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const fileInputRefs = useRef([]);

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
        caption: galleryCaption,
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
              caption: file.caption,
              order: file.order,
            },
          };

          uploadBytes(storageRef, file.image, metadata).then((snapshot) => {
            console.log("Uploaded a file!");
          });
        }
      });
      // Clear the form fields
      setGalleryTitle("");
      setGalleryCaption("");
      setFiles([
        { image: "", description: "", caption: "", order: 0 },
        { image: "", description: "", caption: "", order: 1 },
        { image: "", description: "", caption: "", order: 2 },
      ]);
      fileInputRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });
      setUploaded(true);
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleCaptionChange = (e, index) => {
    const newFiles = [...files];
    newFiles[index]["caption"] = e.target.value;
    setFiles(newFiles);
  };

  const addFile = () => {
    setFiles((prevFiles) => [
      ...prevFiles,
      { image: "", description: "", caption: "", order: files.length },
    ]);
  };

  return (
    <>
      {uploaded ? (
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-4xl mb-4">Gallery Created!</h2>
          <Button text="Go to Feed" action={() => navigate("/discover")} />
        </div>
      ) : (
        ""
      )}
      <div>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <Input
            label="Title"
            name="title"
            type="text"
            value={galleryTitle}
            changeHandler={(e) => setGalleryTitle(e.target.value)}
            required={true}
          />
          <label htmlFor="caption" className="block mx-2">
            Gallery Caption
          </label>
          <textarea
            name="galleryCaption"
            id="galleryCaption"
            className="block w-full p-2 mb-2 border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300 rounded-md "
            value={galleryCaption}
            onChange={(e) => setGalleryCaption(e.target.value)}
          />
          {files.map((file, index) => (
            <div
              key={index}
              className="p-4 my-6 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-md"
            >
              <label
                htmlFor={`image-${index + 1}`}
                className="block mx-2"
              >{`Image ${index + 1}`}</label>
              <input
                type="file"
                name={`image-${index + 1}`}
                onChange={(e) => handleFileChange(e, index)}
                ref={(el) => (fileInputRefs.current[index] = el)}
                className="block w-full p-2 mb-2 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-300"
              />
              <Input
                type="text"
                label={`Description of Image ${
                  index + 1
                } for the visually impared`}
                name={`description-${index + 1}`}
                value={file.description}
                changeHandler={(e) => handleDescriptionChange(e, index)}
              />
              <Input
                type="text"
                label={`Caption for Image ${index + 1}`}
                name={`caption-${index + 1}`}
                value={file.caption}
                changeHandler={(e) => handleCaptionChange(e, index)}
              />
            </div>
          ))}
          <Button
            text="Add Another Image"
            label="Add another image"
            action={addFile}
            style="secondary"
          />
          <Button type="submit" style="primary" text="Create Gallery" />
        </form>
      </div>
    </>
  );
};

export default CreateGallery;
