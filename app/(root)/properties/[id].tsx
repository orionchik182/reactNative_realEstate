import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  ViewToken,
  LayoutAnimation,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPropertyById, getReviews } from "@/lib/appwrite2";
import useAppwrite from "@/lib/useAppwrite";
import icons from "@/constants/icons";
import { facilities } from "@/constants/data";
import images from "@/constants/images";
import ImageView from "react-native-image-viewing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const Property = () => {
  const { id } = useLocalSearchParams();
  const { data: property, loading } = useAppwrite({
    fn: getPropertyById,
    params: { id: id as string },
  });

  const { data: reviews, loading: loadingReviews } = useAppwrite({
    fn: getReviews,
    params: { propertyId: id as string },
    skip: !id,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const [visible, setVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesForViewer = property?.images.map((img) => ({ uri: img })) || [];

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

  const agent = typeof property.agent === "object" ? property.agent : null;

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
    <ScrollView className="h-full bg-[#FFFFFF]">
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
                style={{ tintColor: "black" }}
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
              style={{ width: SCREEN_WIDTH, height: 460 }}
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

      <View className="px-6">
        <Text className="text-2xl mt-6 font-rubik-bold">{property?.name}</Text>
      </View>
      <View className="px-6 mt-3">
        <View className="flex flex-row items-center justify-start">
          <Text className="px-2.5 py-1.5 bg-primary-300/10 text-primary-300 uppercase rounded-full font-rubik-semibold text-xs mr-2.5">
            {property.type}
          </Text>
          <Image source={icons.star} className="w-5 h-5 mr-1.5" />
          <Text></Text>
          <Text>
            {property.rating} ({reviews?.length || 0} reviews)
          </Text>
        </View>
      </View>
      <View className="px-6 mt-4 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Image
            source={icons.bed}
            className="w-10 h-10 p-3 bg-primary-300/10 rounded-full"
          />
          <Text>{property.bedrooms} Beds</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Image
            source={icons.bath}
            className="w-10 h-10 p-3 bg-primary-300/10 rounded-full"
          />
          <Text>{property.bathrooms} Baths</Text>
        </View>
        <View className="flex flex-row items-center gap-2 mr-5">
          <Image
            source={icons.area}
            className="w-10 h-10 p-3 bg-primary-300/10 rounded-full"
          />
          <Text>{property.area} sqft</Text>
        </View>
      </View>
      <View className="border-b border-primary-300/10 mt-7 mx-6" />
      <View className="px-6 mt-5">
        <Text className="text-xl font-rubik-semibold">Agent</Text>
        <View className="flex flex-row items-center mt-4">
          <Image
            source={{ uri: agent?.avatar }}
            className="w-16 h-16 rounded-full"
          />
          <View className="ml-5 flex-1">
            <Text className="font-rubik-semibold text-lg">{agent?.name}</Text>
            <Text className="text-black-200 text-sm">Owner</Text>
          </View>
          <TouchableOpacity>
            <Image source={icons.chat} className="w-10 h-10" />
          </TouchableOpacity>
          <TouchableOpacity className="ml-6">
            <Image source={icons.phone} className="w-10 h-10" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-6 mt-5">
        <Text className="text-xl font-rubik-semibold">Overview</Text>
        <Text className="text-black-200 mt-4 font-rubik-regular text-base">
          {property.description}
        </Text>
      </View>
      <View className="px-6 mt-8">
        <Text className="text-xl font-rubik-semibold">Facilities</Text>
        <View className="flex flex-row flex-wrap items-start justify-start mt-5">
          {property.facilities.map((facilityName, index) => {
            const facility = facilities.find(
              (item) => item.title === facilityName
            );

            if (facility) {
              return (
                <View
                  key={index}
                  className="flex flex-col items-center px-4 gap-2 mt-5"
                >
                  <Image
                    source={facility.icon}
                    className="size-15 rounded-full bg-primary-300/10 p-5"
                  />
                  <Text className="text-black-300 font-rubik-regular text-sm">
                    {facility.title}
                  </Text>
                </View>
              );
            }

            return null;
          })}
        </View>
      </View>
      {property.images.length > 0 && (
        <View className="mt-5">
          <Text className="text-xl font-rubik-semibold px-5">Gallery</Text>
          <FlatList
            data={property.images}
            horizontal
            showsHorizontalScrollIndicator={false}
            // Добавляем index, чтобы знать, на какую картинку нажали
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setCurrentImageIndex(index); // Устанавливаем индекс нажатой картинки
                  setVisible(true); // Открываем галерею
                }}
              >
                <Image
                  source={{ uri: item }}
                  className="w-28 h-28 rounded-lg ml-5 mr-1 mt-5"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item} // Хорошая практика добавить keyExtractor
          />
        </View>
      )}

      <View className="px-6 mt-7">
        <Text className="text-xl font-rubik-semibold">Location</Text>
        <View className="flex flex-row items-center mt-4 gap-2">
          <Image source={icons.location} className="size-5" />
          <Text className="text-black-200 font-rubik-medium text-sm">
            {property.address}
          </Text>
        </View>
        <Image source={images.map} className="w-full h-52 mt-8" />
      </View>
      <View className="flex flex-row items-center justify-between mt-7 px-5">
        <View className="flex flex-row items-center gap-2">
          <Image source={icons.star} className="size-5" />
          <Text className="font-rubik-semibold text-xl text-black-300">
            {property.rating} ({reviews?.length || 0} reviews)
          </Text>
        </View>

        <TouchableOpacity>
          <Text className="font-rubik-semibold text-base text-primary-300">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <View className="px-6 mt-7">
        <View className="flex flex-row items-center gap-2.5">
          <Image source={images.avatar} className="size-16 rounded-full" />
          <Text className="font-rubik-semibold text-base">
            Charolette Hanlin
          </Text>
        </View>
        <Text className="text-black-200 font-rubik-regular text-base mt-3">
          The apartment is very nice and clean
        </Text>
        <View className="flex flex-row items-center gap-2 mt-3">
          <TouchableOpacity>
            <Image
              source={icons.heart}
              className="size-5"
              tintColor={"#0061FF"}
            />
          </TouchableOpacity>
          <Text className="font-rubik-medium text-sm text-black-300 flex-1">
            938
          </Text>
          <Text className="font-rubik text-sm text-black-200">6 days ago</Text>
        </View>
      </View>
      <View className="border-t border-primary-300/10 mt-7 rounded-full mx-6" />
      <View className="px-6 pb-9 pt-6 flex flex-row items-center justify-between">
        <View>
          <Text className="font-rubik-medium text-xs text-black-200 uppercase tracking-[2px]">
            Price
          </Text>
          <Text className="font-rubik-semibold text-2xl text-primary-300 mt-1.5">
            ${property.price}
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="font-rubik-semibold text-base text-white bg-primary-300 px-16 py-3.5 rounded-full">
            Book Now
          </Text>
        </TouchableOpacity>
      </View>

      <ImageView
        images={imagesForViewer}
        imageIndex={currentImageIndex}
        visible={visible}
        onRequestClose={() => setVisible(false)} // Закрытие по свайпу или кнопке назад
        animationType="fade" // Плавное появление
      />

    </ScrollView>
  );
};

export default Property;
