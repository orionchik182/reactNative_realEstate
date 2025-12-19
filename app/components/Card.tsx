import { Image, Text, TouchableOpacity, View } from "react-native";
import { CardProps } from "./Cards";
import icons from "@/constants/icons";

const Card = ({ onPress, item }: CardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="mt-5 w-[48%] relative px-3.5 pt-4 bg-white rounded-xl pb-5 shadow-lg shadow-black-100/40"
    >
      <Image source={{uri: item.image}} className="w-40 h-[154px] rounded-xl" />
      <View className="flex flex-row gap-1.5 absolute top-6 right-6 bg-white rounded-full shadow-lg px-2.5 py-1.5">
        <Image source={icons.star} className="size-4" />
        <Text className="font-rubik-semibold text-xs text-primary-300">
          {item.rating}
        </Text>
      </View>
      <View className="flex flex-col gap-2.5 mt-3">
        <Text className="font-rubik-semibold text-base text-black-300">
          {item.name}
        </Text>
        <Text className="font-rubik text-xs text-black-100">{item.address}</Text>
        <Text className="font-rubik-semibold text-base text-primary-300">
          ${item.price}
        </Text>
      </View>
      <TouchableOpacity className="absolute bottom-4 right-3">
        <Image
          source={icons.heart}
          className="size-8 p-1"
          tintColor={"#8C8E98"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;
