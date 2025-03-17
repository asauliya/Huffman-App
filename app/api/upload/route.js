import { NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import { spawn } from "child_process";

export async function POST(req) {
  try {
    // Get the uploaded file
    const formData = await req.formData();
    const mode = formData.get("mode");
    const file = formData.get("file");

    if (!file)
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

    // Save the file temporarily
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    const filePath = path.join(uploadsDir, file.name);

    await writeFile(filePath, buffer);

    // Path for the processed output file
    const outputFilePath = path.join(uploadsDir, `processed_${file.name}`);

    if (mode == "decoder") {
      // Run the C++ program
      await new Promise((resolve, reject) => {
        const cppProcess = spawn("./public/DECODER", [
          filePath,
          outputFilePath,
        ]);

        cppProcess.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error("C++ program failed"));
        });
      });

      const newFilename = file.name.replace(/\.huf$/, "");
      return NextResponse.json({
        message: "File Decoded successfully!",
        downloadUrl: `/uploads/${newFilename}`,
      });
    }

    // Run the C++ program
    await new Promise((resolve, reject) => {
      const cppProcess = spawn("./public/ENCODER", [filePath, outputFilePath]);

      cppProcess.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error("C++ program failed"));
      });
    });

    // Return the processed file URL
    return NextResponse.json({
      message: "File processed successfully!",
      downloadUrl: `/uploads/${file.name}.huf`,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
