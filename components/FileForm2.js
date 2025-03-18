"use client";

import React from "react";
import { useState } from "react";

const FileForm2 = () => {
  // const submitAction = async (e) =>{
  //   "use server"
  //   console.log(e.get('textfile') , e.get('mode'));
  //   fs.writeFile("harry.txt" , "hwllo i amdfgd noob.");
  // }

  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [mode, setMode] = useState("encoder"); // Default mode

  const handleMode = (event) => {
    setMode(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode" , mode);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      console.log("success", "http://localhost:3000/" + data.downloadUrl);
      setDownloadUrl("http://localhost:3000/" + data.downloadUrl);
    } else {
      console.log("failed");
      alert("Upload failed.");
    }
  };

  const handleDownload = async () => {
    if (!downloadUrl) return;

    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      if(mode == 'encoder'){
        const newFilename = file.name.replace(/\.txt$/, ".huf");
        console.log("downloading encoded file")
        downloadLink.download = `${newFilename}`; // Ensure proper file name
      }
      else{
        const newFilename = file.name.replace(/\.huf$/, "");
        console.log("downloading decoded file")
        downloadLink.download = `${newFilename}`; // Ensure proper file name
      }
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-700 mb-4">
          Upload a Text File
        </h2>

        {/* File Input */}
        <input
          name="textfile"
          type="file"
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:bg-blue-500 file:border-none file:text-white file:px-4 file:py-2 file:rounded-lg"
          onChange={handleFileChange}
        />

        {/* Encoder / Decoder Selection */}
        <div className="mt-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="mode"
              value="encoder"
              className="form-radio text-blue-600"
              checked={mode === "encoder"}
              onChange={handleMode}
            />
            <span className="ml-2">Encoder</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="decoder"
              className="form-radio text-blue-600"
              checked={mode === "decoder"}
              onChange={handleMode}
            />
            <span className="ml-2">Decoder</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleUpload}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      {downloadUrl && (
          <div>
              <button onClick={handleDownload} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Download
              </button>
          </div>
        )}
    </div>
  );
};

export default FileForm2;
