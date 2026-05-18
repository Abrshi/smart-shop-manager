import { google } from "googleapis";
import stream from "stream";
import dotenv from "dotenv";

dotenv.config();

const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
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

    // buffer -> stream
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