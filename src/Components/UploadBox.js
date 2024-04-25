import React, { useRef, useState } from "react";

export const UploadBox = ({ onFileUpload }) => {
  const fileInput = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  // When user drags a file over the upload box
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  // When user drags a file out of the upload box
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  // When user drops a file into the upload box
  const handleDrop = (e) => {
    e.preventDefault();

    // Lifts the file state up to the parent component
    onFileUpload(e.dataTransfer.files[0]);
    setDragOver(false);
  };

  // When user clicks to upload a file
  const handleFileSelect = (e) => {
    e.preventDefault();

    // Lifts the file state up to the parent component
    onFileUpload(e.target.files[0]);
  };

  // Triggers handleFileSelect when user clicks on the upload box
  const triggerFileSelect = () => {
    fileInput.current.click();
  };

  return (
    <div
      className={`flex h-3/4 w-3/4 flex-col items-center justify-center rounded-lg
      ${dragOver ? "bg-gray-600" : "bg-gray-700"} border-4 border-dashed border-gray-400
      transition-all ease-in-out hover:cursor-pointer hover:bg-gray-600 active:bg-gray-700`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <h1 className="select-none text-4xl font-bold text-white">
        Upload an image
      </h1>
      <input
        ref={fileInput}
        type="file"
        onChange={handleFileSelect}
        class="hidden"
      />
    </div>
  );
};
