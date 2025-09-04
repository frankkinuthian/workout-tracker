import {
  View,
  Text,
  StatusBar,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useCallback } from "react";
import { useStopwatch } from "react-timer-hook";

import { useFocusEffect } from "@react-navigation/native";

export default function ActiveWorkout() {
  useFocusEffect(
    useCallback(() => {
      // Set status bar when screen is focused
      StatusBar.setBarStyle("light-content");
      StatusBar.setBackgroundColor("#1F2937");

      return () => {
        // Reset status bar when screen is unfocused
        StatusBar.setBarStyle("dark-content");
        StatusBar.setBackgroundColor("#FFFFFF");
      };
    }, []),
  );
  
  //TODO: use Zustand for global state, to persist workout data

  //use this hook for timing with offset based on workout start time
  const { seconds, minutes, hours, totalSeconds, reset } = useStopwatch({
    autoStart: true,
  });

  const getWorkoutDuration = () => {
    return `${minutes.toString().padStart(2, "0")}: ${seconds.toString().padStart(2, "0").toString().padStart(2, "0")}`;
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/*Top safe area*/}
      <View
        className="bg-gray-800"
        style={{
          paddingTop: Platform.OS === "ios" ? 55 : StatusBar.currentHeight || 0,
        }}
      >
        {/*Header*/}
        <View className="bg-gray-800 px-6 py-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-semibold">
                Active Workout
              </Text>
              <Text className="text-gray-300">{getWorkoutDuration()}</Text>
            </View>
            <View className="flex-row items-center space-x-3 gap-2">
              {/*Weight unit toggle*/}
              <View className="flex-row bg-gray-700 rounded-lg p-1">
                <TouchableOpacity
                  onPress={() => setWeightUnit("kgs")}
                  className={`px-3 py-1 rounded ${
                    weightUnit === "kgs" ? "bg-blue-600" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "kgs" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    kgs
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setWeightUnit("lbs")}
                  className={`px-3 py-1 rounded ${
                    weightUnit === "lbs" ? "bg-blue-600" : ""
                  }`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      weightUnit === "lbs" ? "text-white" : "text-gray-300"
                    }`}
                  >
                    lbs
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={cancelWorkout}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-medium">End Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
