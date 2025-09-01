import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Page() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex flex-1" style={{ paddingTop: insets.top }}>
      <Header />
      <Content />
    </View>
  );
}

function Content() {
  return (
    <View className="flex-1">
      <View className="py-12 md:py-24 lg:py-32 xl:py-48">
        <View className="px-4 md:px-6">
          <View className="flex flex-col items-center gap-4 text-center">
            <Text
              role="heading"
              className="text-3xl text-center native:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Expo + Tailwind (NativeWind) Template
            </Text>

            <Text className="mx-auto max-w-[700px] text-lg text-center md:text-xl">
              This template sets up Expo and Tailwind (NativeWind) allowing you
              to quickly build a mobile app!
            </Text>
            <Link href="#" target="_blank">
              <Text className="text-lg text-center text-blue-500 hover:text-blue-700 underline md:text-xl dark:text-blue-400 dark:hover:text-blue-300">
                https://github.com/frankkinuthian/workout-tracker
              </Text>
            </Link>

            <View className="gap-4">
              <Link
                suppressHighlighting
                className="flex h-9 items-center justify-center overflow-hidden rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 web:shadow ios:shadow transition-colors hover:bg-gray-900/90 active:bg-gray-400/90 web:focus-visible:outline-none web:focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="https://www.youtube.com/@sonnysangha"
              >
                Visit my GitHub Repository
              </Link>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function Header() {
  return (
    <View>
      <View className="px-4 lg:px-6 h-14 flex items-center flex-row justify-between ">
        <Link className="font-bold flex-1 items-center justify-center" href="/">
          Workout Tracker
        </Link>
        <View className="">
          <Link
            className="text-md font-medium hover:underline web:underline-offset-4"
            href="#"
          >
            Join Me!
          </Link>
        </View>
      </View>
    </View>
  );
}
