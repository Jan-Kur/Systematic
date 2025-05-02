import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="dark:bg-background bg-background-dark flex-1 justify-center gap-5">
      <Text className="text-text-dark dark:text-text text-3xl text-center">Systematic</Text>
      <Text className="text-primary text-3xl text-center">This is where it begins</Text>
    </View>
    
  );
}