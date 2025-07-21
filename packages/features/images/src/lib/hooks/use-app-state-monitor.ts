import { useEffect, useState } from "react";
import { appStateMonitor } from "../app-state-monitor";

export function useAppStateMonitor() {
  const [newImagesCount, setNewImagesCount] = useState(0);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Start monitoring when hook mounts
    appStateMonitor.startMonitoring();
    setIsMonitoring(true);

    // Add listener for new images
    const handleNewImages = (count: number) => {
      setNewImagesCount((prev) => prev + count);
    };

    appStateMonitor.addListener(handleNewImages);

    // Load initial count
    appStateMonitor.getNewImagesCount().then(setNewImagesCount);

    return () => {
      // Cleanup
      appStateMonitor.removeListener(handleNewImages);
      appStateMonitor.stopMonitoring();
      setIsMonitoring(false);
    };
  }, []);

  const clearNewImagesCount = async () => {
    await appStateMonitor.clearNewImagesCount();
    setNewImagesCount(0);
  };

  const getLastSyncTimestamp = () => {
    return appStateMonitor.getLastSyncTimestamp();
  };

  return {
    newImagesCount,
    isMonitoring,
    clearNewImagesCount,
    getLastSyncTimestamp,
  };
}
