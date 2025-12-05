import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import images from "@/constants/images";
import icons from "@/constants/icons";

interface Props {
  onPress?: () => void;
}

export const FeaturedCard = ({ onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex flex-col items-start w-60 h-80 relative mr-5"
    >
      <Image source={images.japan} className="size-full rounded-2xl" />
      <Image
        source={images.cardGradient}
        className="size-full absolute bottom-0 rounded-2xl"
      />
      <View className="flex flex-row gap-1.5 absolute top-6 right-6 bg-white rounded-full shadow-lg px-2.5 py-1.5">
        <Image source={icons.star} className="size-4" />
        <Text className="font-rubik-semibold text-xs text-primary-300">
          4.8
        </Text>
      </View>
      <View className="flex flex-col gap-2.5 absolute bottom-5 left-4">
        <Text className="font-rubik-bold text-xl text-white">Merialla Villa</Text>
        <Text className="font-rubik text-base text-white">New York, US</Text>
        <Text className="font-rubik-bold text-xl text-white">$12219</Text>
      </View>
      <TouchableOpacity className="absolute bottom-4 right-3">
        <Image source={icons.heart} className="size-8 p-1 rounded-full" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export const Card = () => {
  return (
    <View className="mt-5">
      <Text>Card</Text>
    </View>
  );
};
