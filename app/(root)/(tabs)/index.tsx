import Card from "@/app/components/Card";
import { CardItemProps } from "@/app/components/Cards";
import FeaturedCard from "@/app/components/Cards";
import Filters from "@/app/components/Filters";
import NoResults from "@/app/components/NoResults";
import Search from "@/app/components/Search";
import icons from "@/constants/icons";
import { getLatestProperties, getProperties } from "@/lib/appwrite2";
import { useGlobalContext } from "@/lib/global-provider";

import useAppwrite from "@/lib/useAppwrite";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ filter?: string; query?: string }>();
  const { data: latestProperties, loading: latestPropertiesLoading } =
    useAppwrite({ fn: getLatestProperties });
  const {
    data: properties,
    loading,
    refetch,
  } = useAppwrite({
    fn: getProperties,
    params: { filter: params.filter!, query: params.query!, limit: 6 },
    skip: true,
  });

  const handleCardPress = (id: string) => {
    router.push(`/properties/${id}`);
  };

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 6,
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
          <>
            <View className="flex flex-row items-center justify-between pt-4 px-5">
              <Image
                source={{ uri: user?.avatar }}
                className="size-11 rounded-full"
              />
              <View className="ml-2.5 mr-auto flex flex-col items-start justify-center">
                <Text className="font-rubik text-xs text-black-100">
                  Good Morning
                </Text>
                <Text className="font-rubik-medium text-base text-black-300">
                  {user?.name}
                </Text>
              </View>
              <View className="relative">
                <Image source={icons.bell} className="size-11 p-2.5" />
                <View className="absolute top-3 right-3 size-2.5 bg-primary-300 rounded-full" />
              </View>
            </View>
            <View className="px-5">
              <Search />
            </View>

            <View className="flex flex-row items-center justify-between mt-6 px-5">
              <Text className="font-rubik-semibold text-xl text-black-300">
                Featured
              </Text>
              <TouchableOpacity>
                <Text className="font-rubik-semibold text-base text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            {latestPropertiesLoading ? (
              <ActivityIndicator size="large" className="text-primary-300" />
            ) : !latestProperties || latestProperties.length === 0 ? (
              <NoResults />
            ) : (
              <FlatList
                data={latestProperties}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <FeaturedCard
                    item={item as unknown as CardItemProps}
                    onPress={() => handleCardPress(item.$id)}
                  />
                )}
                keyExtractor={(item) => item.$id}
                bounces={false}
                contentContainerClassName="flex mt-5 px-5"
                showsVerticalScrollIndicator={false}
              />
            )}

            <View className="flex flex-row items-center justify-between mt-6 px-5">
              <Text className="font-rubik-semibold text-xl text-black-300">
                Our Recommendation
              </Text>
              <TouchableOpacity>
                <Text className="font-rubik-semibold text-base text-primary-300">
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            <Filters />
          </>
        }
      />
    </SafeAreaView>
  );
}
