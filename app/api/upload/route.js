import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";

let progress = 0;
let statusText = "Starting...";
let downloadUrl = "";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const mode = formData.get("mode");
    const file = formData.get("file");

    if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadsDir, file.name);

    await writeFile(filePath, buffer);

    // Update progress
    progress = 30;
    statusText = "File uploaded successfully...";

    // Path for the processed output file
    const outputFilePath = path.join(uploadsDir, `processed_${file.name}`);

    // Determine the C++ executable
    const processType = mode === "decoder" ? "DECODER" : "ENCODER";

    // Start processing
    progress = 60;
    statusText = "Processing file...";

    const cppProcess = spawn(`./public/${processType}`, [filePath, outputFilePath]);

    cppProcess.on("close", (code) => {
      if (code === 0) {
        progress = 100;
        statusText = "Processing completed!";

        const newFilename = mode === "decoder" ? file.name.replace(/\.huf$/, ".txt") : file.name.replace(/\.txt$/, ".huf");
        downloadUrl = `/uploads/${newFilename}`;
      } else {
        progress = 0;
        statusText = "Error processing file.";
        downloadUrl = "";
      }
    });

    return NextResponse.json({ message: "File upload started!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Function to return progress
export async function GET() {
  return NextResponse.json({ progress, statusText, downloadUrl });
}
