import { Text, ScrollView, TouchableOpacity } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";
import { categories } from "@/constants/data";

const Filters = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ filter?: string }>();
  const selectedCategory = params.filter || "All";
  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category) {
      router.setParams({ filter: "All" });
    }
    router.setParams({ filter: category });
  };
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="px-5 mt-3 mb-2"
    >
      {categories.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => handleCategoryPress(item.category)}
          className={`flex flex-col items-start mr-4 px-4 py-2 rounded-full ${
            selectedCategory === item.category
              ? "bg-primary-300"
              : "bg-primary-100 border border-primary-200"
          }`}
        >
          <Text
            className={`text-sm ${
              selectedCategory === item.category
                ? "text-white font-rubik-bold mt-0.5"
                : "text-black-300 font-rubik"
            }`}
          >
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default Filters;
