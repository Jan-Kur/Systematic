import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import Color from "color";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../contexts/AuthContext";
import CustomCheckbox from "./CustomCheckbox";

export default function Task({id, name, color, emoji, duration, status, onEdit, onDelete}) {

   const [currentTaskState, setCurrentTaskState] = useState(0)                                                                                                                                                 

   const getInitialState = (status) => {
    switch(status) {
      case "Done": return 1;
      case "Kinda done": return 2;
      case "Not done": 
      default: return 0;
      }
   }

   const initialState = getInitialState(status)

   const db = getFirestore()

   const {user} = useSession()
   const userId = user.uid

   const darkerColor = Color(color).darken(0.5).hex()
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
         className="w-full justify-between p-2 items-center flex-row rounded-xl"
         onPress={() => onEdit(id)}
      >
         <View className="justify-between items-center flex-row flex-1 gap-4">
            <View 
               style={{ backgroundColor: color }}
               className="p-1 rounded-lg"
            >
               <Text className="text-xl">{emoji}</Text>
            </View>

            <Text className="text-lightMain font-medium text-xl flex-1" numberOfLines={1} ellipsizeMode="tail">{name}</Text>
         </View> 

         <View className="flex-row items-center w-fit gap-7 ml-2">
            <TouchableOpacity
               onPress={() => onDelete(id)}   
            >
               <FontAwesome6 name="trash-can" size={24} color={color} />
            </TouchableOpacity>

            <CustomCheckbox
               initialState={initialState}
               onStateChange={handleCheckboxPress}
               borderColor={color}
            />
         </View>

         
      </TouchableOpacity>
   )
}