/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import * as functions from "firebase-functions/v1";

// Initialize Firebase Admin SDK
initializeApp();
const db = getFirestore();

export const updateLikeCount = functions.firestore
  .document("Likes/{likeId}") // Ensure collection name matches Firestore
  .onWrite(async (change) => {
    const like = change.after.exists ? change.after.data() : null;
    const galleryId = like ? like.galleryId : change.before.data()?.galleryId;

    if (!galleryId) {
      console.error("No galleryId found in like document.");
      return;
    }

    const galleryRef = db.collection("Galleries").doc(galleryId);

    const increment = like ? 1 : -1;

    try {
      await galleryRef.update({
        likeCount: FieldValue.increment(increment),
      });
      console.log(`Gallery ${galleryId} likeCount updated by ${increment}`);
    } catch (error) {
      console.error(
        `Error updating likeCount for gallery ${galleryId}:`,
        error
      );
    }
  });
