import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { TouchableOpacity, View } from "react-native";

export default function TimelineHeader() {
   return (
      <View className ="w-full bg-transparent h-fit justify-between flex-row items-center">
         <TouchableOpacity>
            <MaterialIcons name="hourglass-empty" size={28} color="#6A1FCC"/>
         </TouchableOpacity>

         <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={28} color="#6A1FCC"/>
         </TouchableOpacity>
      </View>
   )
}