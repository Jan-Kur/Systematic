import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import Color from "color";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../contexts/AuthContext";
import ThreeStateCheckbox from "./ThreeStateCheckbox";

export default function Task({id, name, color, emoji, duration}) {

   const [currentTaskState, setCurrentTaskState] = useState(0)

   const db = getFirestore()

   const {user} = useSession()
   const userId = user.uid

   const darkerColor = Color(color).darken(0.45).hex()
   const evenDarkerColor = Color(color).darken(0.8).hex()
   
   const height = duration <= 15 ? 40 : duration >= 300 ? 200 : 40 + (duration - 15) * (160 / 285);

   const debounceTimerRef = useRef(null);

   const handleCheckboxPress = useCallback((stateNumber) => {
      setCurrentTaskState(stateNumber)

      const status = stateNumber === 0 ? "Not done" : stateNumber === 1 ? "Done" : "Kinda done"

      
      if (debounceTimerRef.current) {
         clearTimeout(debounceTimerRef.current)
      }

      debounceTimerRef.current = setTimeout(() => {
         updateDoc(doc(db, `users/${userId}/tasks/${id}`), {
            status: status
         })
      }, 750)
   }, [userId, id])

   useEffect(() => {
      return () => {
         if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
         }
      };
   }, []);

   const getBackgroundColor = () => {
      return currentTaskState === 0 ? darkerColor : evenDarkerColor;
   };

   return (
      <TouchableOpacity 
         style={{
            height: height,
            backgroundColor: getBackgroundColor()
         }}
         className="w-full justify-between p-2 items-center flex-row rounded-lg"
      >
         <View className="w-2/5 justify-between items-center flex-row">
            <View 
               style={{ backgroundColor: color }}
               className="p-1 rounded-lg"
            >
               <Text className="text-xl">{emoji}</Text>
            </View>

            <Text className="text-lightMain font-semibold text-xl">{name}</Text>
         </View> 

         <ThreeStateCheckbox
            onStateChange={handleCheckboxPress}
            borderColor={color}
         />
      </TouchableOpacity>
   )
}