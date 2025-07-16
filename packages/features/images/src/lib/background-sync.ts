import { getSupabaseBrowserClient } from "@kit/supabase";
import * as BackgroundTask from "expo-background-task";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";
import * as TaskManager from "expo-task-manager";
import type { ImageMetadata } from "../types";

const BACKGROUND_SYNC_TASK = "background-image-sync";
const MINIMUM_INTERVAL = 15 * 60; // 15 minutes in seconds

// Function to get image metadata and generate unique ID
async function getImageMetadata(
  asset: MediaLibrary.Asset
): Promise<ImageMetadata> {
  const { width, height, creationTime, modificationTime, filename } = asset;
  // Create a unique ID based on file attributes
  const uniqueId = `${filename}-${width}-${height}-${creationTime}-${modificationTime}`;

  return {
    width,
    height,
    creationTime,
    modificationTime,
    filename,
    uniqueId,
  };
}

// Function to optimize image for upload
async function optimizeImage(uri: string) {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }], // Resize to max width of 1200px
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );
  return result.uri;
}

// Function to perform the sync
export async function performSync() {
  try {
    const supabase = getSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get permission to access media library
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Media library permission not granted");
    }

    // Get all photos
    const { assets } = await MediaLibrary.getAssetsAsync({
      mediaType: "photo",
      sortBy: [["creationTime", false]],
    });

    // Get already synced images
    const { data: syncedImages } = await supabase
      .from("images")
      .select("metadata")
      .eq("account_id", user.id)
      .eq("sync_status", "synced");

    const syncedIds = new Set(
      syncedImages?.map((img) => (img.metadata as ImageMetadata).uniqueId) || []
    );

    // Filter new images
    const newAssets = assets.filter((asset) => {
      const uniqueId = `${asset.filename}-${asset.width}-${asset.height}-${asset.creationTime}-${asset.modificationTime}`;
      return !syncedIds.has(uniqueId);
    });

    const results = [];

    // Upload new images
    for (const asset of newAssets) {
      try {
        // Get image metadata
        const metadata = await getImageMetadata(asset);

        // Optimize image
        const optimizedUri = await optimizeImage(asset.uri);

        // Upload to storage
        const filePath = `${user.id}/${metadata.uniqueId}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("user_images")
          .upload(
            filePath,
            await FileSystem.readAsStringAsync(optimizedUri, {
              encoding: "base64",
            }),
            {
              contentType: "image/jpeg",
              upsert: true,
            }
          );

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("user_images").getPublicUrl(filePath);

        // Save to database
        const { data, error } = await supabase.from("images").insert({
          account_id: user.id,
          metadata,
          image_url: publicUrl,
          sync_status: "synced",
        });

        if (error) throw error;
        if (data) results.push(data[0]);
      } catch (error) {
        console.error("Failed to sync image:", error);
        // Continue with next image
      }
    }

    return {
      success: true,
      newImages: results,
      message: `Synced ${results.length} new images`,
    };
  } catch (error) {
    console.error("Sync failed:", error);
    return {
      success: false,
      newImages: [],
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

// Define the background task
TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    await performSync();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Background task failed:", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

// Function to register the background task
export async function registerBackgroundSync() {
  try {
    await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: MINIMUM_INTERVAL,
    });
    return true;
  } catch (err) {
    console.error("Failed to register background task:", err);
    return false;
  }
}

// Function to unregister the background task
export async function unregisterBackgroundSync() {
  try {
    await BackgroundTask.unregisterTaskAsync(BACKGROUND_SYNC_TASK);
    return true;
  } catch (err) {
    console.error("Failed to unregister background task:", err);
    return false;
  }
}

// Function to check if background sync is registered
export async function isBackgroundSyncRegistered() {
  return TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
}

// Function to get background task status
export async function getBackgroundSyncStatus() {
  return BackgroundTask.getStatusAsync();
}

// Function to trigger sync manually (for testing)
export async function triggerSyncForTesting() {
  if (__DEV__) {
    return BackgroundTask.triggerTaskWorkerForTestingAsync();
  }
  return false;
}
