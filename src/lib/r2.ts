import { AwsClient } from "aws4fetch";

const R2_BUCKET = process.env.R2_BUCKET;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

if (!R2_BUCKET) throw new Error("R2_BUCKET is not defined");
if (!R2_ENDPOINT) throw new Error("R2_ENDPOINT is not defined");
if (!R2_ACCESS_KEY_ID) throw new Error("R2_ACCESS_KEY_ID is not defined");
if (!R2_SECRET_ACCESS_KEY)
  throw new Error("R2_SECRET_ACCESS_KEY is not defined");
if (!R2_PUBLIC_URL) throw new Error("R2_PUBLIC_URL is not defined");

export const r2Client = new AwsClient({
  accessKeyId: R2_ACCESS_KEY_ID,
  secretAccessKey: R2_SECRET_ACCESS_KEY,
});

export const uploadObject = async (key: string, body: Blob) => {
  const response = await r2Client.fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: "PUT",
    body,
    headers: {
      "Content-Type": body.type || "application/octet-stream",
      "Content-Length": body.size.toString(),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to upload object: ${response.statusText}`);
  }

  return {
    url: `${R2_PUBLIC_URL}/${key}`,
  };
};

export const deleteObject = async (key: string) => {
  const response = await r2Client.fetch(`${R2_ENDPOINT}/${R2_BUCKET}/${key}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete object: ${response.statusText}`);
  }
};

export const renameObject = async (
  oldKeyOrUrl: string,
  newKeyOrUrl: string,
) => {
  const oldKey = oldKeyOrUrl.replace(`${R2_PUBLIC_URL}/`, "");
  const newKey = newKeyOrUrl.replace(`${R2_PUBLIC_URL}/`, "");

  // R2 does not support renaming objects, so we need to copy the object to the new key and then delete the old key
  const response = await r2Client.fetch(
    `${R2_ENDPOINT}/${R2_BUCKET}/${oldKey}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to get object: ${response.statusText}`);
  }
  const blob = await response.blob();

  await uploadObject(newKey, blob);
  await deleteObject(oldKey);

  return `${R2_PUBLIC_URL}/${newKey}`;
};
