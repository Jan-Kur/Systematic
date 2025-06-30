import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView, Switch, Text, TextInput, View } from "react-native";
import ColorPicker, { Panel1 } from 'reanimated-color-picker';

export default function TaskSettings() {
   

   return(
      <SafeAreaView className="w-full h-full flex-1 flex-col g-4">
         <TextInput
            placeholder="Name"

         />

         <View>
            <Text className="text-lightMain font-medium text-xl">Duration: {}min</Text>
         </View>

         <View className="flex-row gap-3 items-center">
            <DateTimePicker/>

            <FontAwesome6 name="arrow-right" size={30} color="#6A1FCC" />
         
            <DateTimePicker/>
         </View>

         <DateTimePicker/>

         <View className="flex-row gap-3 items-center">
            <ColorPicker>
               <Panel1/>
            </ColorPicker>

            <TextInput
               placeholder="Emoji"
            />
         </View>

         <Switch/>
      </SafeAreaView>
   )
}