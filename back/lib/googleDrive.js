import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

const KEY_FILE_PATH = process.cwd() + "/final-project-455209-3941f974a570.json";

const auth = new google.auth.GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({ version: "v3", auth });

export const uploadFileToDrive = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer missing");
    }

    // convert buffer → stream (THIS is the key fix)
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);

    const response = await drive.files.create({
      requestBody: {
        name: file.originalname,
        mimeType: file.mimetype,
      },
      media: {
        mimeType: file.mimetype,
        body: bufferStream,
      },
    });

    const fileId = response.data.id;

    // make public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return `https://drive.google.com/uc?id=${fileId}`;

  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("Failed to upload file");
  }
};