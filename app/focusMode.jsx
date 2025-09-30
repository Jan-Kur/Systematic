import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTasks } from "../contexts/TasksContext";

export default function FocusMode() {
   const {currentTask} = useTasks()

   const [timeLeft, setTimeLeft] = useState(0)

   const [progress, setProgress] = useState(0)

   useEffect(() => {
      if (!currentTask) {
         setTimeLeft(0)
         setProgress(0)
         return
      }
      
      const totalDuration = currentTask.duration * 60 * 1000;
      const endTime = currentTask.startDate.getTime() + totalDuration;

      const updateTimer = () => {
         const remaining = endTime - new Date().getTime();
         if (remaining <= 0) {
            setTimeLeft(0);
            setProgress(1);
            clearInterval(interval);
         } else {
            const elapsed = totalDuration - remaining;
            setTimeLeft(remaining);
            setProgress(elapsed / totalDuration);
         }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
   }, [currentTask])

   function formatTimer(timeLeft) {
      if (timeLeft <= 0) return "00:00:00"
      const secondsLeft = Math.floor(timeLeft / 1000)
      const hours = Math.floor(secondsLeft / (60 * 60))
      const minutes = Math.floor((secondsLeft / 60) % 60)
      const seconds = Math.floor(secondsLeft % 60)

      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
   }

   return (
      <SafeAreaView className="bg-lightMain dark:bg-darkMain flex-1 ">
         <ImageBackground className="w-full h-full flex-col justify-start gap-5 items-center px-2 pt-2 pb-2">
            <TouchableOpacity className ="w-fit bg-transparent h-fit self-end" onPress={() => useRouter().back()}>
               <AntDesign name="close" size={28} color="#6A1FCC" />
            </TouchableOpacity>
            {currentTask ? (
               <>
                  <Text className="text-4xl font-bold text-darkMain dark:text-lightMain text-center">{currentTask.name}</Text>
                  
                  <View className="w-4/5 h-2 bg-darkMain dark:bg-lightMain rounded-full overflow-hidden">
                     <View 
                        className="h-2 bg-primary" 
                        style={{ width: `${progress * 100}%` }} 
                     />
                  </View>
                  
                  <Text className="text-7xl text-primary">{formatTimer(timeLeft)}</Text>
               </>
            ) : (
               <Text className="text-xl text-darkMain dark:text-lightMain">No active task</Text>
            )}
         </ImageBackground>
      </SafeAreaView>
   )
}