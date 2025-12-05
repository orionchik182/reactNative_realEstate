import { Card, FeaturedCard } from "@/app/components/Cards";
import Search from "@/app/components/Search";
import icons from "@/constants/icons";
import { useGlobalContext } from "@/lib/global-provider";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const { user } = useGlobalContext();
  return (
    <SafeAreaView className="h-full bg-white">
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5 mt-5">
        <FeaturedCard />
        <FeaturedCard />
        <FeaturedCard />
        <FeaturedCard />
      </ScrollView>

      <Card />
    </SafeAreaView>
  );
}
