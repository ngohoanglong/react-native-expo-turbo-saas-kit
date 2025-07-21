import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, type AppStateStatus } from "react-native";
import { performSync } from "./background-sync";

const LAST_SYNC_KEY = "last_image_sync_timestamp";
const NEW_IMAGES_COUNT_KEY = "new_images_count";

export type AppStateChangeHandler = (newImagesCount: number) => void;

class AppStateMonitor {
  private listeners: AppStateChangeHandler[] = [];
  private isMonitoring = false;
  private subscription: ReturnType<typeof AppState.addEventListener> | null =
    null;

  // Start monitoring app state changes
  startMonitoring() {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.subscription = AppState.addEventListener(
      "change",
      this.handleAppStateChange
    );
  }

  // Stop monitoring app state changes
  stopMonitoring() {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    this.subscription?.remove();
    this.subscription = null;
  }

  // Add listener for new images notifications
  addListener(listener: AppStateChangeHandler) {
    this.listeners.push(listener);
  }

  // Remove listener
  removeListener(listener: AppStateChangeHandler) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  // Handle app state changes
  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === "active") {
      // App came to foreground - check for new images
      await this.checkForNewImages();
    } else if (nextAppState === "background") {
      // App went to background - store current timestamp
      await this.storeLastSyncTimestamp();
    }
  };

  // Store the last sync timestamp when app goes to background
  private async storeLastSyncTimestamp() {
    try {
      const timestamp = Date.now();
      await AsyncStorage.setItem(LAST_SYNC_KEY, timestamp.toString());
    } catch (error) {
      console.error("Failed to store last sync timestamp:", error);
    }
  }

  // Check for new images when app comes to foreground
  private async checkForNewImages() {
    try {
      // Perform sync to get new images
      const syncResult = await performSync();

      if (syncResult.success && syncResult.newImages.length > 0) {
        // Store the count of new images
        await AsyncStorage.setItem(
          NEW_IMAGES_COUNT_KEY,
          syncResult.newImages.length.toString()
        );

        // Notify listeners
        this.listeners.forEach((listener) => {
          listener(syncResult.newImages.length);
        });
      }
    } catch (error) {
      console.error("Failed to check for new images:", error);
    }
  }

  // Get the count of new images since last app session
  async getNewImagesCount(): Promise<number> {
    try {
      const count = await AsyncStorage.getItem(NEW_IMAGES_COUNT_KEY);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error("Failed to get new images count:", error);
      return 0;
    }
  }

  // Clear the new images count (call this after user acknowledges the notification)
  async clearNewImagesCount() {
    try {
      await AsyncStorage.removeItem(NEW_IMAGES_COUNT_KEY);
    } catch (error) {
      console.error("Failed to clear new images count:", error);
    }
  }

  // Get the last sync timestamp
  async getLastSyncTimestamp(): Promise<number | null> {
    try {
      const timestamp = await AsyncStorage.getItem(LAST_SYNC_KEY);
      return timestamp ? parseInt(timestamp, 10) : null;
    } catch (error) {
      console.error("Failed to get last sync timestamp:", error);
      return null;
    }
  }
}

// Export singleton instance
export const appStateMonitor = new AppStateMonitor();
