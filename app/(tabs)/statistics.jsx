import { Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Statistics() {

  const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
      <Text className="text-darkMain dark:text-lightMain text-4xl text-center">STATS</Text>
      <Text className="text-primary text-4xl text-center">STATS</Text>
      <View className="w-8 h-8 p-3 bg-darkGray">
        <View className="w-full h-full bg-lightGray"></View>
      </View>
    </ContainerComponent>
    
  );
}