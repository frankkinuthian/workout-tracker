import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";
import { client, urlFor } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import { defineQuery } from "groq";
import {
  getDifficultyColor,
  getDifficultyText,
} from "../components/ExerciseCard";
import Markdown from "react-native-markdown-display"


const singleExerciseQuery = defineQuery(
  `*[_type == "exercise" && _id == $id] [0]`
);

const { width } = Dimensions.get("window");

export default function ExerciseDetail() {
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise>(null);
  const [loading, setLoading] = useState(true);
  const [aiGuidance, setAiGuidance] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);

  const { id } = useLocalSearchParams<{
    id: string;
  }>();

  // Initialize video player
  const player = useVideoPlayer(exercise?.videoUrl || "", (player) => {
    player.loop = true;
    player.muted = false;
  });

  useEffect(() => {
    const fetchExercise = async () => {
      if (!id) return;

      try {
        const exerciseData = await client.fetch(singleExerciseQuery, { id });
        setExercise(exerciseData);
      } catch (error) {
        console.error("Error fetching exercise:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id]);

  const getAiGuidance = async () => {
    if (!exercise) return;
    setAiLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          exerciseName: exercise.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch AI guidance");
      }

      const data = await response.json();
      setAiGuidance(data.message);
    } catch (error) {
      console.error("Error fetching AI guidance:", error);
      setAiGuidance(
        "Sorry, there was an error getting AI guidance. Please try again."
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Update player source when exercise changes
  useEffect(() => {
    if (exercise?.videoUrl) {
      player.replace(exercise?.videoUrl);
    }
  }, [exercise?.videoUrl]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-gray-500">Loading exercise...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-500">Exercise not found: {id}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 bg-blue-500 px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {/* header with close button */}
      <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-black/20 rounded-full items-center justify-center backdrop-blur-sm"
        >
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View className="h-80 bg-white relative">
          {exercise?.image ? (
            <Image
              source={{ uri: urlFor(exercise?.image?.asset?._ref).url() }}
              className="w-full h-full"
              resizeMode="contain"
            />
          ) : (
            <View className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 items-center justify-center">
              <Ionicons name="fitness" size={80} color="white" />
            </View>
          )}

          {/* Gradient overlay */}
          <View className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
        </View>

        {/* Content */}
        <View className="px-6 py-6">
          {/* Title and difficulty */}
          <View className="flex-row items-start justify-between mb-4">
            <View className="flex-1 mr-4">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                {exercise?.name}
              </Text>
              <View
                className={`self-start px-4 py-2 rounded-full ${getDifficultyColor(
                  exercise?.difficulty
                )}`}
              >
                <Text className="text-sm font-semibold text-white">
                  {getDifficultyText(exercise?.difficulty)}
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-xl font-semibold text-gray-800 mb-3">
              Description
            </Text>
            <Text className="text-gray-600 leading-6 text-base">
              {exercise?.description ||
                "No description available for this exercise"}
            </Text>
          </View>

          {/* Video Section, if present */}
          {exercise?.videoUrl && (
            <View className="mb-6">
              <Text className="text-xl font-semibold text-gray-800 mb-3">
                Video Tutorial
              </Text>

              {/* Video Player Container */}
              <View className="bg-black rounded-xl overflow-hidden shadow-lg">
                <VideoView
                  style={{
                    width: width - 48, // Account for padding
                    height: (width - 48) * 0.56, // 16:9 aspect ratio
                  }}
                  player={player}
                  allowsFullscreen
                  allowsPictureInPicture
                  startsPictureInPictureAutomatically={false}
                  showsTimecodes
                  requiresLinearPlayback={false}
                />
              </View>

              {/* Video Controls */}
              <View className="mt-4 flex-row justify-center space-x-4">
                <TouchableOpacity
                  className="bg-blue-500 rounded-lg px-4 py-3 flex-row items-center"
                  onPress={() => {
                    if (player.playing) {
                      player.pause();
                    } else {
                      player.play();
                    }
                  }}
                >
                  <Ionicons
                    name={player.playing ? "pause" : "play"}
                    size={16}
                    color="white"
                  />
                  <Text className="text-white font-medium ml-2">
                    {player.playing ? "Pause" : "Play"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-500 rounded-lg px-4 py-3 flex-row items-center"
                  onPress={() => {
                    player.seekBy(-10);
                  }}
                >
                  <Ionicons name="play-back" size={16} color="white" />
                  <Text className="text-white font-medium ml-2">-10s</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="bg-gray-500 rounded-lg px-4 py-3 flex-row items-center"
                  onPress={() => {
                    player.seekBy(10);
                  }}
                >
                  <Ionicons name="play-forward" size={16} color="white" />
                  <Text className="text-white font-medium ml-2">+10s</Text>
                </TouchableOpacity>
              </View>

              {/* Video Info */}
              <View className="mt-4 p-4 bg-gray-50 rounded-xl">
                <View className="flex-row items-center">
                  <Ionicons name="play-circle" size={20} color="#6B7280" />
                  <Text className="ml-2 text-gray-600 font-medium">
                    Exercise demonstration video
                  </Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  Learn proper form and technique
                </Text>
              </View>

              {/* Fallback link for external viewing */}
              <TouchableOpacity
                className="mt-3 bg-blue-500 rounded-lg p-3 flex-row items-center justify-center"
                onPress={() => Linking.openURL(exercise?.videoUrl)}
              >
                <Ionicons name="open-outline" size={16} color="white" />
                <Text className="text-white font-medium ml-2">
                  Open in Browser
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* AI Guidance section goes here */}
          {(aiGuidance || aiLoading) && (
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="fitness" size={24} color="#3B82F6" />
                <Text className="text-xl font-semibold text-gray-800 ml-2">
                  AI coach says...
                </Text>
              </View>

              {aiLoading ? (
                <View>
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text className="text-gray-600 mt-2">
                    Getting personalized guidance.....
                  </Text>
                </View>
              ) : (
                <View className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                  <Markdown
                    style={{
                      body: {
                        paddingBottom: 20,
                      },
                      heading2: {
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#1f2937",
                        marginTop: 12,
                        marginBottom: 6,
                      },
                      heading3: {
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#374151",
                        marginTop: 8,
                        marginBottom: 4,
                      },
                    }}
                  >
                    {aiGuidance}
                  </Markdown>
                </View>
              )}
            </View>
          )}

          {/* --------TODO--------- */}

          {/* Action buttons */}
          <View className="mt-8 gap-2">
            {/* AI Coach button */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                aiLoading
                  ? "bg-gray-400"
                  : aiGuidance
                    ? "bg-green-500"
                    : "bg-blue-500"
              }`}
              onPress={getAiGuidance}
              disabled={aiLoading}
            >
              {aiLoading ? (
                <View className="flex-row items-center">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Loading.....
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-bold text-lg">
                  {aiGuidance
                    ? "Refresh AI Guidance"
                    : "Get AI Guidance on Form & Technique"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 rounded-xl py-4 items-center"
              onPress={() => router.back()}
            >
              <Text className="text-gray-800 font-bold text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
