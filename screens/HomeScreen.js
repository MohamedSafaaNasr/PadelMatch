import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <ImageBackground
      source={require("../assets/splash.png")}
      style={{ flex: 1, backgroundColor: "#003252" }}
      resizeMode="contain"
    >
      <SafeAreaView className="flex-1 items-center justify-end pb-10">
        <TouchableOpacity
          className="bg-white px-12 py-6 rounded-full shadow-lg"
          onPress={() => navigation.navigate("Match")}
        >
          <Text className="text-[#003B64] text-xl font-bold">
            Create a Match
          </Text>
        </TouchableOpacity>
        <StatusBar style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
}
