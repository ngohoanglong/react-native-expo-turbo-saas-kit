import React, { useEffect, useState } from 'react';

import * as MediaLibrary from 'expo-media-library';
import { FlatList, Image, StyleSheet, View } from 'react-native';

import {
  type ImageMetadata,
  type SyncedImage,
  isBackgroundSyncRegistered,
  performSync,
  registerBackgroundSync,
  triggerSyncForTesting,
  useImages,
} from '@kit/images';
import { Button, Card, Text } from '@kit/ui';

export default function HomePage() {
  const { data: images = [], isLoading, refetch } = useImages();
  const [syncStatus, setSyncStatus] = useState<string>('Checking...');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    checkSyncStatus();
    requestPermissions();
  }, []);

  const checkSyncStatus = async () => {
    try {
      const isRegistered = await isBackgroundSyncRegistered();
      setSyncStatus(
        isRegistered ? 'Active (Syncs every 15 minutes)' : 'Not active',
      );
    } catch (error) {
      setSyncStatus('Error checking status');
    }
  };

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      const isRegistered = await isBackgroundSyncRegistered();
      if (!isRegistered) {
        await registerBackgroundSync();
        checkSyncStatus();
      }
    }
  };

  const handleManualSync = async () => {
    try {
      setIsSyncing(true);
      const result = await performSync();
      if (result.success) {
        await refetch();
        setSyncStatus(`Last sync: ${result.message}`);
      } else {
        setSyncStatus(`Sync failed: ${result.message}`);
      }
    } catch (error) {
      setSyncStatus('Sync failed with error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestSync = async () => {
    try {
      setIsSyncing(true);
      await triggerSyncForTesting();
      await refetch();
      setSyncStatus('Test sync completed');
    } catch (error) {
      setSyncStatus('Test sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const renderImage = ({ item }: { item: SyncedImage }) => {
    const metadata = item.metadata as ImageMetadata;
    return (
      <Card className="m-2 overflow-hidden">
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
        <View className="p-2">
          <Text className="text-sm text-muted-foreground">
            {new Date(item.created_at).toLocaleString()}
          </Text>
          <Text className="text-xs text-muted-foreground">
            {metadata.filename}
          </Text>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading images...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="border-b border-border bg-card p-4">
        <Text className="text-lg font-semibold">Synced Images</Text>
        <Text className="text-sm text-muted-foreground">
          Background Sync: {syncStatus}
        </Text>
        <View className="mt-2 flex-row gap-2">
          <Button
            onPress={handleManualSync}
            disabled={isSyncing}
            variant="outline"
          >
            <Text>{isSyncing ? 'Syncing...' : 'Sync Now'}</Text>
          </Button>
          {__DEV__ && (
            <Button
              onPress={handleTestSync}
              disabled={isSyncing}
              variant="outline"
            >
              <Text>Test Sync</Text>
            </Button>
          )}
        </View>
      </View>

      <FlatList<SyncedImage>
        data={images}
        renderItem={renderImage}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 8,
  },
  image: {
    width: '100%',
    height: 150,
  },
});
