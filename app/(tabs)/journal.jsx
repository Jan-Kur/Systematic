import { Text, View } from "react-native";
import JournalCalendar from "../../components/journalCalendar";

export default function Index() {
  return (
    <View className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-center gap-5 items-center pr-4 pl-4">
      <Text className="text-darkMain dark:text-lightMain text-4xl text-center">JOURNAL</Text>
      <Text className="text-primary text-4xl text-center">JOURNAL</Text>
      <JournalCalendar/>
    </View>
  );
}