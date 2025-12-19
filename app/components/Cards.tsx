import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import images from "@/constants/images";
import icons from "@/constants/icons";
import { Models } from "react-native-appwrite";

export interface CardItemProps extends Models.Document {
  image: string;
  name: string;
  address: string;
  price: number;
  rating: number;
}

export interface CardProps {
  item: CardItemProps;
  onPress?: () => void;
}

const FeaturedCard = ({ onPress, item }: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative mr-5"
    >
      <Image source={{uri: item.image}} className="size-full rounded-2xl" />
      <Image
        source={images.cardGradient}
        className="size-full absolute bottom-0 rounded-2xl"
      />
      <View className="flex flex-row gap-1.5 absolute top-6 right-6 bg-white rounded-full shadow-lg px-2.5 py-1.5">
        <Image source={icons.star} className="size-4" />
        <Text className="font-rubik-semibold text-xs text-primary-300">
          {item.rating}
        </Text>
      </View>
      <View className="flex flex-col gap-2.5 absolute bottom-5 left-4">
        <Text className="font-rubik-bold text-xl text-white">
          {item.name}
        </Text>
        <Text className="font-rubik text-base text-white">{item.address}</Text>
        <Text className="font-rubik-bold text-xl text-white">${item.price}</Text>
      </View>
      <TouchableOpacity className="absolute bottom-4 right-3">
        <Image source={icons.heart} className="size-8 p-1 rounded-full" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default FeaturedCard;
