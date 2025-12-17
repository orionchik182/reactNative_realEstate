import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ViewToken,
  LayoutAnimation,
  TouchableOpacity,
} from "react-native";
import React, { useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPropertyById } from "@/lib/appwrite2";
import useAppwrite from "@/lib/useAppwrite";
import icons from "@/constants/icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Property = () => {
  const { id } = useLocalSearchParams();
  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id as string },
  });
  console.log(property);

  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading) return <Text className="text-center mt-10">Loading...</Text>;
  if (!property) return <Text className="text-center mt-10">Not found</Text>;

  const galleryImages =
    property?.images && property.images.length > 0
      ? property.images
      : property?.image
        ? [property.image]
        : [];

  if (galleryImages.length === 0) {
    return (
      <SafeAreaView>
        <Text>No images available</Text>
      </SafeAreaView>
    );
  }

  return (
    <View className="h-full bg-[#FFFFFF]">
      <View className="relative">
        <View className="absolute top-16 left-6 right-6 z-50 flex flex-row justify-between items-center">
      
      
      <TouchableOpacity onPress={() => router.back()}>
        <Image source={icons.backArrow} className="w-10 h-10" />
      </TouchableOpacity>

      
      <View className="flex-row gap-4 items-center">
        
        <TouchableOpacity onPress={() => console.log("Лайк нажат")}>
          <Image 
            source={icons.heart} 
            className="w-10 h-10" 
            style={{ tintColor: 'black' }} 
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => console.log("Отправить нажато")}>
          <Image source={icons.send} className="w-10 h-10" />
        </TouchableOpacity>
      </View>

    </View>
        <FlatList
          data={galleryImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item: imageUrl }) => (
            <Image
              source={{ uri: imageUrl }}
              style={{ width: SCREEN_WIDTH, height: 320 }}
              resizeMode="cover"
            />
          )}
        />

        {galleryImages.length > 1 && (
          <View className="absolute bottom-5 flex-row justify-center w-full z-50">
            <View className="flex-row gap-2 bg-transparent p-2 rounded-full">
              {galleryImages.map((_, index: number) => (
                <View
                  key={index}
                  className={`h-2.5 rounded-full ${
                    activeIndex === index
                      ? "w-8 bg-primary-300"
                      : "w-2.5 bg-white"
                  }`}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      <SafeAreaView className="px-5">
        <Text className="text-2xl font-bold">{property?.name}</Text>
      </SafeAreaView>
    </View>
  );
};

export default Property;
