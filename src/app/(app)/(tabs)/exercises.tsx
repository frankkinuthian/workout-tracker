import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { defineQuery } from "groq";
import { client } from "@/lib/sanity/client";
import { Exercise } from "@/lib/sanity/types";
import ExerciseCard from "@/app/components/ExerciseCard";

export const exercisesQuery = defineQuery(`*[_type == "exercise"] {
  _createdAt,
  _id,
  _rev,
  _type,
  _updatedAt,
  description,
  difficulty,
  image,
  isActive,
  name,
  videoUrl
}`);

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const fetchExercises = async () => {
    try {
      //fetching from Sanity CMS
      const exercises = await client.fetch(exercisesQuery);

      setExercises(exercises);
      setFilteredExercises(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      // TODO: add error toast
    }
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    const filtered = exercises.filter((exercise: Exercise) =>
      exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredExercises(filtered);
  }, [searchQuery, exercises]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchExercises();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header section here */}

      <View className="px-6 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">
          Exercise Library
        </Text>
        <Text className="text-gray-600 mt-1">
          Discover and master new exercises
        </Text>

        {/* search bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mt-4">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-3 text-gray-300"
            placeholder="Search exercises..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="ml-2"
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* exercise list */}
      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <ExerciseCard
            item={item}
            onPress={() => router.push(`/exercise-detail?id=${item._id}`)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
            title="Pull to refresh exercises"
            titleColor="#6B7280"
          />
        }
        ListEmptyComponent={
          <View className="bg-white rounded-2xl p-8 items-center">
            <Ionicons name="fitness-outline" size={64} color="#9CA3AF" />
            <Text className="text-xl font-semibold text-gray-900 mt-4">
              {searchQuery
                ? "Try adjusting your search"
                : "Your exercises will appear here"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
