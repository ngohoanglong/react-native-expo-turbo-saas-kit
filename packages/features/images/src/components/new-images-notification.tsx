import { Badge } from "@kit/ui/src/components/ui/badge";
import { Text } from "@kit/ui/src/components/ui/text";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppStateMonitor } from "../lib/hooks/use-app-state-monitor";

export function NewImagesNotification() {
  const { newImagesCount, clearNewImagesCount } = useAppStateMonitor();
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (newImagesCount > 0) {
      setShowNotification(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
        clearNewImagesCount();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [newImagesCount, clearNewImagesCount]);

  if (!showNotification || newImagesCount === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.notification}>
        <View style={styles.header}>
          <View style={styles.badgeContainer}>
            <Badge variant="secondary">
              <Text style={styles.badgeText}>{newImagesCount}</Text>
            </Badge>
            <Text style={styles.title}>New images detected!</Text>
          </View>
          <Text
            style={styles.dismiss}
            onPress={() => {
              setShowNotification(false);
              clearNewImagesCount();
            }}
          >
            Dismiss
          </Text>
        </View>
        <Text style={styles.message}>
          {newImagesCount} new image{newImagesCount > 1 ? "s" : ""} have been
          synced while the app was in the background.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 50,
  },
  notification: {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  badgeText: {
    fontSize: 12,
    color: "#fff",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  dismiss: {
    fontSize: 12,
    color: "#fff",
    textDecorationLine: "underline",
  },
  message: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
});
