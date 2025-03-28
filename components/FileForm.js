"use client";

import React from "react";
import { useState, useRef } from "react";
import ProgressBar from "./ProgessBar";

const FileForm2 = () => {
  const [file, setFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [mode, setMode] = useState("encoder"); 
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(10)
  const [statusText, setStatusText] = useState("Starting...");

  const ref = useRef();

  const handleMode = (event) => {
    setMode(event.target.value);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) return;
  
    setLoading(true);
    setProgress(10);
    setStatusText("Starting...");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mode", mode);
  
    // Upload File
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      alert("Upload failed.");
      setLoading(false);
      return;
    }
  
    // Poll progress every 1 second
    const interval = setInterval(async () => {
      const response = await fetch("/api/upload", {
        method: "GET",
      });
      const data = await response.json();
  
      setProgress(data.progress);
      setStatusText(data.statusText);
  
      if (data.progress === 100) {
        setDownloadUrl("http://localhost:3000" + data.downloadUrl);
        clearInterval(interval); // Stop polling when done
      }
    }, 1000);
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
      {!loading? <form ref={ref} className="bg-white p-6 rounded-2xl shadow-lg w-96">
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
      : <ProgressBar progress={progress} statusText={statusText}/>
    }
      {downloadUrl && (
          <div>
              <button onClick={handleDownload} className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
                Download
              </button>
          </div>
        )}
    </div>
  );
};

export default FileForm2;
