import { createAuthClient } from "better-auth/react";
import { mutationOptions } from "@tanstack/react-query";


import { generateSecret, generateURI } from "otplib";
import QRCode from "qrcode"; // npm install qrcode

export async function setupTwoFactor(userEmail: string) {
  // Generate a new secret
  const secret = generateSecret();

  // Create otpauth:// URI
  const uri = generateURI({
    issuer: "CHikoritaHitList",
    label: userEmail,
    secret,
  });

  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(uri);

  return {
    secret, // Store securely in database
    qrDataUrl, // Send to frontend for display
    uri, // Alternative: manual entry
  };
}

import { verify } from "otplib";

export async function validateToken( userSecret:string, userSubmittedToken:string) {
  // Returns an object: { valid: true/false, delta: number }
  const result = await verify({
    secret: userSecret,
    token: userSubmittedToken,
  });

  if (result.valid) {
    console.log("Token is valid!");
    return true;
  } else {
    console.log("Token is invalid.");
    return false;
  }
}


export const authClient = createAuthClient({
  baseURL: process.env.APP_URL,
});

export const signInOptions = mutationOptions({
  mutationKey: ["user-sign-in"],
  mutationFn: async () => {
    const res = await authClient.signIn.social({ provider: "google" });

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});

export const signOutOptions = mutationOptions({
  mutationKey: ["user-sign-out"],
  mutationFn: async () => {
    const res = await authClient.signOut();

    if (!res.data) {
      throw new Error(JSON.stringify(res.error));
    }
  },
  onSuccess: (_, __, ___, { client }) => {
    client.invalidateQueries();
  },
});
