import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import icons from "@/constants/icons";

const SignIn = () => {
  const handleLogin = () => {
    console.log("Login");
  };
  return (
    <SafeAreaView className="h-full bg-black-bg">
      <ScrollView contentContainerClassName="h-full">
        <Image
          source={images.onboarding}
          className="w-full h-4/6 mt-8"
          resizeMode="contain"
        />
        <View className="px-10">
          <Text className="font-rubik leading-7 text-base uppercase text-center text-black-200 tracking-widest">
            Welcome to Real Scout
          </Text>
          <Text className="text-center mt-3 leading-10 text-black-300 font-rubik-bold font-semibold text-3xl capitalize">
            Let's get you closer {"\n"} to
            <Text className="text-primary-300"> your ideal home</Text>
          </Text>
          <Text className="text-center font-rubik text-black-200 text-18 mt-3">
            Login to Real Scout with Google
          </Text>
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-green-300 shadow-md shadow-zinc-300 px-10 py-4 mt-5 rounded-full w-full "
          >
            <View className="flex flex-row items-center justify-center gap-3">
              <Image source={icons.google} className="w-6 h-6" resizeMode="contain"/>
              <Text className="font-rubik-medium text-black-300 text-18">
                Sign Up with Google
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
