import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { doc, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import Color from "color";
import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelRatio, Text, TouchableOpacity, View } from "react-native";
import { useSession } from "../contexts/AuthContext";
import CustomCheckbox from "./CustomCheckbox";

export default function Task({id, name, color, emoji, startDate, duration, status, onEdit, onDelete, showStartTime, showEndTime}) {

   const [currentTaskState, setCurrentTaskState] = useState(0)
   const [progress, setProgress] = useState(0)

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

   const darkerColor = Color(color).darken(0.45).hex()
   const evenDarkerColor = Color(color).darken(0.75).hex()
   
   const height = duration <= 15 ? 60 : duration >= 300 ? 300 : 60 + (duration - 15) * (240 / 285);

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
             clearTimeout(debounceTimerRef.current)
           }
       };
   }, []);

   const getBackgroundColor = () => {
       return currentTaskState === 0 ? darkerColor : evenDarkerColor;
   };

   const endDate = new Date(startDate.getTime() + duration * 60 * 1000)

   const hours = Math.floor(duration / 60)
   const mins = duration % 60

   useEffect(() => {
      let animationFrameId
       function updateProgress() {
         const elapsedTime = new Date().getTime() - startDate.getTime()
         const calculatedProgress = Math.max(Math.min(elapsedTime / (duration * 60000), 1), 0)
         setProgress(calculatedProgress)
         animationFrameId = requestAnimationFrame(updateProgress)
       }
       animationFrameId = requestAnimationFrame(updateProgress)

       return () => cancelAnimationFrame(animationFrameId)
   }, [startDate, duration])

   const greyOverlayTop = height * progress

   return (
     <View className="flex-row justify-between">
         <View className="flex-col justify-between w-12">
            <View>  
               {showStartTime && 
                   <Text style={{fontSize: 12, lineHeight: 12}} className="font-semibold text-lightMain/80">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
               }
            </View>
            
            <View>
               {showEndTime &&
                   <Text style={{fontSize: 12, lineHeight: 12}} className="font-semibold text-lightMain/80">{endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
               }
            </View>
         </View>
         
         <View className="flex-1 relative rounded-xl overflow-hidden">
            <TouchableOpacity 
               style={{
                  height: height,
                  backgroundColor: getBackgroundColor()
               }}
               className="flex-1 justify-between px-3 items-center flex-row rounded-xl relative overflow-hidden"
               onPress={() => onEdit(id)}
               activeOpacity={1}
            > 
                <View 
                    style={{top: PixelRatio.roundToNearestPixel(greyOverlayTop)}}
                    className="z-20 absolute left-0 bottom-0 right-0 bg-darkGray overflow-hidden"
                />
                <View className="absolute z-10 left-[29] h-full "> 
                   <View className="w-1 bg-transparent h-full" style={{backgroundColor: color}}/>
                </View>

                <View className="justify-between items-center flex-row flex-1 gap-4 h-fit z-30">
                    <View 
                    style={{ backgroundColor: color, width: 40, height: 40 }}
                    className="rounded-lg justify-center items-center"
                    >
                    <Text style={{fontSize: 28, lineHeight: 40}} className="text-center">{emoji}</Text>
                    </View>
                    <View className="flex-col flex-1">
                    <Text className="text-lightMain font-medium text-xl" numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                    <Text className="text-base text-lightMain/80 font-normal">{`${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${hours > 0 ? `${hours}h ` : ''}${mins}min)`}</Text>
                    </View>
                </View> 

                <View className="flex-row items-center w-fit gap-7 ml-2 z-30">
                    <TouchableOpacity
                    onPress={() => onDelete(id)}  
                    >
                    <FontAwesome6 name="trash-can" size={28} color={color} />
                    </TouchableOpacity>

                    <CustomCheckbox
                    initialState={initialState}
                    onStateChange={handleCheckboxPress}
                    borderColor={color}
                    />
                </View>

            </TouchableOpacity>
         </View>
     </View>
   )
}