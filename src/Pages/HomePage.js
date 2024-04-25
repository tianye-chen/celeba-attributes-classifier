import { UploadBox } from "../Components/UploadBox";
import { ResultBox } from "../Components/ResultBox";
import React, { useState, useEffect } from "react";

export const HomePage = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [results, setResults] = useState(null);
  var debug = false; // If true, display grid cell borders

  useEffect(() => {
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  }, [file]);

  // Gets the uploaded file from UploadBox component
  const handleFileUpload = (uploaded_file) => {
    setFile(uploaded_file);
  };

  // Reset everything on cancel
  const handleCancel = () => {
    setFile(null);
    setImage(null);
    setResults(null);
  };

  // Fetch predictions from backend
  const handleConfirm = () => {
    console.log("Fetching predictions...");
    if (!file) {
      console.error("No file");
      return;
    }

    const image_file = new FormData();
    image_file.append("image_file", file);

    fetch("https://celeba-classifier.web.app/make_preds", {
      method: "POST",
      body: image_file,
    })
      .then((res) => res.text())
      .then((data) => {
        data = JSON.parse(data);
        setResults(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div
      class={"justify-left grid h-screen grid-flow-col grid-cols-2 grid-rows-3"}
    >
      <div class={`${debug ? "border-2" : ""} row-span-1 self-end`}>
        <h1 class="pb-6 pl-6 text-6xl font-bold text-white">
          CelebA Attributes Classifier
        </h1>
      </div>

      <div class={`${debug ? "border-2" : ""} row-span-2 ml-6 pl-6`}>
        {image ? (
          <img
            src={image}
            class="h-3/4 w-3/4 rounded-lg object-cover"
            alt="Uploaded"
          />
        ) : (
          <UploadBox onFileUpload={handleFileUpload} />
        )}

        <div
          class={`${debug ? "border-2" : ""} mt-2 flex w-3/4 flex-row justify-around p-4`}
        >
          <div
            onClick={handleCancel}
            class="select-none rounded-3xl bg-white px-10 py-6 text-2xl 
            font-bold transition-all ease-in-out hover:cursor-pointer hover:bg-gray-200 active:bg-gray-300"
          >
            Cancel
          </div>
          <div
            onClick={handleConfirm}
            class="active:bg-gray-30 select-none rounded-3xl bg-white px-8 py-6 
            text-2xl font-bold transition-all ease-in-out hover:cursor-pointer hover:bg-gray-200"
          >
            Confirm
          </div>
        </div>
      </div>

      <div class={`${debug ? "border-2" : ""} row-span-1 self-end`}>
        <h1 class="pb-6 text-6xl font-bold text-white">Results v1</h1>
      </div>

      <div class={`${debug ? "border-2" : ""} row-span-2 ml-6`}>
        <ResultBox results={results} />
      </div>
    </div>
  );
};
