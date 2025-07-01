import { FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function TaskSettings() {
   const [time1, setTime1] = useState(new Date())
   const [time2, setTime2] = useState(new Date())
   const [show1, setShow1] = useState(false)
   const [show2, setShow2] = useState(false)
   
   function onChangeTime1(event, selectedDate) {
      const currentDate = selectedDate
      setShow1(false)
      setTime1(currentDate)
   }

   function onChangeTime2(event, selectedDate) {
      const currentDate = selectedDate
      setShow2(false)
      setTime2(currentDate)
   } 

   function TimePicker1() {
      if (show1) {
         return <DateTimePicker
               mode="time"
               is24Hour={true}
               onChange={onChangeTime1}
               value={time1}
            />
      } else {
         return null
      }
   }

   function TimePicker2() {
      if (show2) {
         return <DateTimePicker
               mode="time"
               is24Hour={true}
               onChange={onChangeTime2}
               value={time2}
            />
      } else {
         return null
      }
   }

   function formatTime(date) {
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${hours}:${minutes}`
   }

   function calculateDuration(t1, t2) {
      const diffMs = t2.getTime() - t1.getTime()
      const diffMin = Math.round(diffMs / (1000 * 60))
      const hours = Math.floor(diffMin / 60)
      const minutes = diffMin % 60

      if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`
      if (hours > 0) return `${hours}h`
      return `${minutes}min`
   }

   return(
      <SafeAreaView className="w-full h-full flex-1 flex-col gap-4 bg-darkMain items-center px-4 py-2">
         <TextInput
            placeholder="Name"
            className="text-3xl font-medium text-[#e3e1ea]"
         />

         <View className="w-full bg-darkGray rounded-lg p-[6] text-center justify-center items-center -mt-2">
            <Text className="text-[#e3e1ea] font-medium text-2xl">Duration: {calculateDuration(time1, time2)}</Text>
         </View>

         <View className="flex-row gap-3 items-center">
            
            <TouchableOpacity className="gap-2 py-2 px-5 bg-darkGray rounded-lg items-center justify-center" onPress={() => setShow1(true)}>
               <Text className="text-[#e3e1ea] text-xl font-medium">{formatTime(time1)}</Text>
            </TouchableOpacity>
            <TimePicker1/>

            <FontAwesome6 name="arrow-right" size={30} color="#6A1FCC" />
         
            <TouchableOpacity className="gap-2 py-2 px-5 bg-darkGray rounded-lg items-center justify-center" onPress={() => setShow2(true)}>
               <Text className="text-[#e3e1ea] text-xl font-medium">{formatTime(time2)}</Text>
            </TouchableOpacity>
            <TimePicker2/>
         </View>

         {/* 

         <DateTimePicker/>

         <View className="flex-row gap-3 items-center">
            <ColorPicker>
               <Panel1/>
            </ColorPicker>

            <TextInput
               placeholder="Emoji"
            />
         </View>

         <Switch/> */}
      </SafeAreaView>
   )
}