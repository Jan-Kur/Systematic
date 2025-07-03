import { AntDesign, Feather, FontAwesome6 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import GraphemeSplitter from "grapheme-splitter";
import { useMemo, useState } from "react";
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ColorPicker, { HueSlider, OpacitySlider, Panel1 } from "reanimated-color-picker";

export default function TaskSettings({onClose, onSave, task}) {
   const [time1, setTime1] = useState(task?.startDate ? new Date(task.startDate) : new Date())

   const initialDate = new Date()
   initialDate.setMinutes(initialDate.getMinutes() + 15)

   const [time2, setTime2] = useState(task?.startDate && task?.duration ? new Date(new Date(task.startDate).getTime() + task.duration * 60000): initialDate)
   const [show1, setShow1] = useState(false)
   const [show2, setShow2] = useState(false)
   const [date, setDate] = useState(task?.startDate ? new Date(task.startDate) : new Date())
   const [showDatePicker, setShowDatePicker] = useState(false)
   const [color, setColor] = useState(task?.color || "#6A1FCC")
   const [showColorPicker, setShowColorPicker] = useState(false)
   const [name, setName] = useState(task?.name || "")
   const [emoji, setEmoji] = useState(task?.emoji || "")
   const [error, setError] = useState(null)

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

   function onChangeDate(event, selectedDate) {
      const currentDate = selectedDate
      setShowDatePicker(false)
      setDate(currentDate)
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

   function getDurationInMinutes(t1, t2) {
      const diffMs = t2.getTime() - t1.getTime()
      return Math.round(diffMs / (1000 * 60))
   }

   function checkErrors() {
      if (name.trim().length === 0) {
         setError("Please enter a task name")
         return false
      }

      const splitter = new GraphemeSplitter();
      const graphemes = splitter.splitGraphemes(emoji);
      if (graphemes.length !== 1) {
         setError("Please enter 1 task emoji")
         return false
      }

      if (getDurationInMinutes(time1, time2) <= 0) {
         setError("Please set a valid timeframe")
         return false
      }

      setError(null)
      return true
   }

   function getStartAndEndTimes(date, time1, time2) {
      const startDateTime = new Date(date)
      let endDateTime = new Date(date)

      startDateTime.setHours(time1.getHours(), time1.getMinutes(), 0, 0)
      endDateTime.setHours(time2.getHours(), time2.getMinutes(), 0, 0)

      if (endDateTime <= startDateTime) {
         endDateTime = new Date(endDateTime.getTime() + 24 * 60 * 60 * 1000)
      }
      return {startDateTime, endDateTime}
   }

   const { startDateTime, endDateTime } = useMemo(() => {
      return getStartAndEndTimes(date, time1, time2);
   }, [date, time1, time2]);

   const durationDisplay = useMemo(() => {
      return calculateDuration(startDateTime, endDateTime);
   }, [startDateTime, endDateTime]);

   return(
      <SafeAreaView className="w-full h-full flex-1 flex-col gap-5 bg-darkMain items-center px-6 py-2">
         <TouchableOpacity className="absolute right-6 top-2" onPress={onClose}>
            <AntDesign name="close" size={28} color="#6A1FCC" />
         </TouchableOpacity>

         <TextInput
            placeholder="Name"
            className="text-3xl font-medium text-[#e3e1ea] w-4/5 text-center"
            onChangeText={text => setName(text)}
            value={name}
         />

         <View className="w-full bg-darkGray rounded-lg p-[6] text-center justify-center items-center -mt-3 h-12">
            <Text className="text-[#e3e1ea] font-medium text-2xl">Duration: {durationDisplay}</Text>
         </View>

         <View className="flex-row gap-3 items-center w-full">
            
            <TouchableOpacity className="py-2 bg-darkGray rounded-lg items-center justify-center flex-1 h-12" onPress={() => setShow1(true)}>
               <Text className="text-[#e3e1ea] text-xl font-medium">{formatTime(time1)}</Text>
            </TouchableOpacity>
            <TimePicker1/>

            <FontAwesome6 name="arrow-right" size={30} color="#6A1FCC" />
         
            <TouchableOpacity className="py-2  bg-darkGray rounded-lg items-center justify-center flex-1 h-12" onPress={() => setShow2(true)}>
               <Text className="text-[#e3e1ea] text-xl font-medium">{formatTime(time2)}</Text>
            </TouchableOpacity>
            <TimePicker2/>
         </View>

         <TouchableOpacity className="py-2 px-5 bg-darkGray rounded-lg items-center justify-center w-full flex-row gap-3 h-12"
            onPress={() => setShowDatePicker(true)}
         >
            <Feather name="calendar" size={24} color="#6A1FCC" />
            <Text className="text-[#e3e1ea] text-xl font-medium">{date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}</Text>
         </TouchableOpacity>
         {showDatePicker && <DateTimePicker onChange={onChangeDate} value={date} mode="date"/>}

         <View className="flex-row gap-5 items-center -mb-5 -mt-2">
            <Text className="text-lg font-medium text-[#e3e1ea] flex-1 text-center">Color</Text>
            <Text className="text-lg font-medium text-[#e3e1ea] flex-1 text-center">Emoji</Text>
         </View>

         <View className="flex-row gap-5 items-center">
            <TouchableOpacity
               onPress={() => setShowColorPicker(true)}
               className=" h-12 rounded-lg shadow-md flex-1"
               style={{ backgroundColor: color }}
            />


            <Modal visible={showColorPicker} animationType="slide" transparent={true}>
               <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-5">
                  <View className="bg-darkGray rounded-xl p-6 w-full max-w-md">
                     <ColorPicker value={color} style={{ gap: 20 }} onChangeJS={({hex}) => setColor(hex)}>
                        <Panel1 style={{ height: 150, borderRadius: 12 }}/>
                        <HueSlider style={{ height: 20, borderRadius: 10 }} />
                        <OpacitySlider style={{ height: 20, borderRadius: 10 }} />
                     </ColorPicker>

                     <TouchableOpacity
                     onPress={() => setShowColorPicker(false)}
                     className="bg-purple-700 rounded-lg py-3 mt-5 items-center"
                     >
                     <Text className="text-white font-semibold text-lg">Close</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </Modal>


            <TextInput
               placeholder="Emoji"
               className="flex-1 bg-darkGray rounded-lg font-medium text-lg h-12"
               onChangeText={text => setEmoji(text)}
               value={emoji}
            />
         </View>

         <TouchableOpacity className="w-full bg-primary rounded-xl h-14 justify-center items-center mt-2"
            onPress={() => {
               if (checkErrors()) {
                  onSave({name, color, emoji, startDate: startDateTime, duration: getDurationInMinutes(startDateTime, endDateTime)})
                  onClose()
               }   
            }}
         >
            <Text className="text-2xl text-[#e3e1ea] font-semibold">Save</Text>
         </TouchableOpacity>

         {error && 
            <View className="h-12 w-full rounded-xl bg-red-600/40 justify-center items-center">
               <Text className="text-red-500 text-lg ">{error}</Text>
            </View>
         }
         
      </SafeAreaView>
   )
}