"use client"
import React from 'react'
import { useState } from 'react';

const FileForm = () => {
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [mode, setMode] = useState("encoder");
  
    const handleFileChange = (event) => {
      const file = event.target.files?.[0];
  
      if (file && file.type === "text/plain") {
        setSelectedFile(file);
      } else {
        alert("Please upload a .txt file only.");
        event.target.value = ""; // Reset file input
      }
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      if (!selectedFile) {
        alert("Please upload a .txt file.");
        return;
      }
  
      alert(`Uploading ${selectedFile.name} as ${mode.toUpperCase()}`);
    };


  return (
<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-96">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Upload a Text File</h2>

        {/* File Input */}
        <input
          name='textfile'
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:bg-blue-500 file:border-none file:text-white file:px-4 file:py-2 file:rounded-lg"
        />

        {/* Display Selected File */}
        {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected: {selectedFile.name}</p>}

        {/* Encoder / Decoder Selection */}
        <div className="mt-4">
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="mode"
              value="encoder"
              checked={mode === "encoder"}
              onChange={() => setMode("encoder")}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Encoder</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="mode"
              value="decoder"
              checked={mode === "decoder"}
              onChange={() => setMode("decoder")}
              className="form-radio text-blue-600"
            />
            <span className="ml-2">Decoder</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default FileForm
