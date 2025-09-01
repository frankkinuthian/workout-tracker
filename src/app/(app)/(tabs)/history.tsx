import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex flex-1" style={{ paddingTop: insets.top }}>
      <Text>History</Text>
    </View>
  );
}
