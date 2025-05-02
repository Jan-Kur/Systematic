import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-center gap-5 items-center">
      <Text className="text-darkMain dark:text-lightMain text-4xl text-center">STATS</Text>
      <Text className="text-primary text-4xl text-center">STATS</Text>
      <View className="w-8 h-8 p-3 bg-darkGray">
        <View className="w-full h-full bg-lightGray"></View>
      </View>
    </View>
    
  );
}