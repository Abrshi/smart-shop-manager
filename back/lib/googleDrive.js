import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

// Read JSON from Render env
const credentials = JSON.parse(
  process.env.GOOGLE_CREDENTIALS
);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/drive"],
});

const drive = google.drive({
  version: "v3",
  auth,
});

export const uploadFileToDrive = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error("File buffer missing");
    }

    // Buffer → stream
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

    // Make file public
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Return your backend image URL
    return `${process.env.BACKEND_URL}/api/v1/google-image/${fileId}`;

  } catch (err) {
    console.error("Error uploading file:", err);
    throw new Error("Failed to upload file");
  }
};