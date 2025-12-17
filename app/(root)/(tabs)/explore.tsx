import { View, FlatList, ActivityIndicator, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getProperties } from "@/lib/appwrite2";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card, CardItemProps } from "@/app/components/Cards";
import NoResults from "@/app/components/NoResults";
import Search from "@/app/components/Search";
import Filters from "@/app/components/Filters";
import icons from "@/constants/icons";

const Explore = () => {
  const params = useLocalSearchParams<{ filter?: string; query?: string }>();

  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { filter: params.filter!, query: params.query!, limit: 20 },
    skip: true,
  });

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 20,
    });
  }, [params.filter, params.query]);

  return (
    <SafeAreaView className="h-full bg-[#FFFFFF]/90">
      <FlatList
        data={properties}
        renderItem={({ item }) => (
          <Card
            onPress={() => handleCardPress(item.$id)}
            item={item as unknown as CardItemProps}
          />
        )}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="text-primary-300 mt-5" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={
          <View className="px-5">
            <View className="flex flex-row items-center justify-between pt-4">
              <TouchableOpacity onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-primary-300/10">
                <Image source={icons.backArrow} className="size-11 p-2.5" />
              </TouchableOpacity>
              <View className="flex flex-col items-start justify-center">
                <Text className="font-rubik-medium text-base text-black-300">
                  Search for Your Ideal Home
                </Text>
              </View>
              <View className="relative">
                <Image source={icons.bell} className="size-11 p-2.5" />
                <View className="absolute top-3 right-3 size-2.5 bg-primary-300 rounded-full" />
              </View>
            </View>
            <Search />
            <View className="mt-5">
              <Filters />
              <Text className="text-xl font-rubik-bold text-black-300 mt-5">
                Found {properties?.length} Properties
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default Explore;
