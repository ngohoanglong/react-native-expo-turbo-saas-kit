import React from 'react';

import { View } from 'react-native';

import { Text } from '@kit/ui';

export default function HomePage() {
  return (
    <View className="flex-1">
      <Text className="text-sm text-muted-foreground">Hello World</Text>
    </View>
  );
}
