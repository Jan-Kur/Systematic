import { LinearGradient } from "expo-linear-gradient"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FlatList, Text, View } from "react-native"

export default function Timer() {

   const hours = Array.from({length: 120}, (_, i) => i)
   const minutes = Array.from({length: 300}, (_, i) => i)
   const seconds = Array.from({length: 300}, (_, i) => i)

   const [selectedHour, setSelectedHour] = useState(0)
   const [selectedMinute, setSelectedMinute] = useState(0)
   const [selectedSecond, setSelectedSecond] = useState(0)

   const hourRef = useRef(null)
   const minuteRef = useRef(null)
   const secondRef = useRef(null)

   useEffect(() => {
      hourRef.current?.scrollToOffset({ offset: (2* 24 * 75) + (selectedHour * 75), animated: false })
      minuteRef.current?.scrollToOffset({ offset: (2* 60* 75) + (selectedMinute * 75), animated: false })
      secondRef.current?.scrollToOffset({ offset: (2* 60 * 75) + (selectedSecond * 75), animated: false })
   }, [])

   function onScrollEnd(e, setSelected, ref) {
      const offsetY = e.nativeEvent.contentOffset.y
      const index = Math.round(offsetY / 75)
      const newOffset = index * 75
      ref.current?.scrollToOffset({ offset: newOffset, animated: true })
      setSelected(index)
   }

   const TimePickerItem = React.memo(({ value }) => (
      <View className="h-[75] justify-center items-center px-3 box-border">
         <Text className="text-lightMain text-5xl font-medium">
            {String(value).padStart(2, "0")}
         </Text>
      </View>
   ))


   const renderItem1 = useCallback(({ item }) => (
      <TimePickerItem value={item % 24} />
   ), [])

   const renderItem2 = useCallback(({ item }) => (
      <TimePickerItem value={item % 60} />
   ), [])

   return (
      <View className="flex-row w-4/5 justify-between overflow-hidden items-center relative">
         <View className="h-[225]">
            <FlatList
               initialNumToRender={5}
               maxToRenderPerBatch={10}
               windowSize={5}
               removeClippedSubviews={true}
               ref={hourRef}
               data={hours}
               keyExtractor={item => item.toString()}
               showsVerticalScrollIndicator={false}
               decelerationRate="fast"
               onMomentumScrollEnd={e => onScrollEnd(e, setSelectedHour, hourRef)}
               getItemLayout={(_, index) => ({ length: 75, offset: 75 * index, index })}
               renderItem={({ item }) => renderItem1({ item })}
            />
         </View>
         
         <Text className="text-lightMain text-5xl font-medium">:</Text>
         
         <View className="h-[225]">
            <FlatList
               initialNumToRender={5}
               maxToRenderPerBatch={10}
               windowSize={5}
               removeClippedSubviews={true}
               ref={minuteRef}
               data={minutes}
               keyExtractor={item => item.toString()}
               showsVerticalScrollIndicator={false}
               decelerationRate="fast"
               onMomentumScrollEnd={e => onScrollEnd(e, setSelectedMinute, minuteRef)}
               getItemLayout={(_, index) => ({ length: 75, offset: 75 * index, index })}
               renderItem={({ item }) => renderItem2({ item })}
            />
         </View>
         
         <Text className="text-lightMain text-5xl font-medium">:</Text>
         
         <View className="h-[225]">
            <FlatList
               initialNumToRender={5}
               maxToRenderPerBatch={10}
               windowSize={5}
               removeClippedSubviews={true}
               ref={secondRef}
               data={seconds}
               keyExtractor={item => item.toString()}
               showsVerticalScrollIndicator={false}
               decelerationRate="fast"
               onMomentumScrollEnd={e => onScrollEnd(e, setSelectedSecond, secondRef)}
               getItemLayout={(_, index) => ({ length: 75, offset: 75 * index, index })}
               renderItem={({ item }) => renderItem2({ item })}
            />
         </View>

         <LinearGradient className="absolute top-0 w-full h-[75] pointer-events-none" colors={['rgba(0,0,0,1)', 'transparent']}/>
         <LinearGradient className="absolute bottom-0 w-full h-[75] pointer-events-none" colors={['transparent', 'rgba(0,0,0,1)']}/>
      </View>
   )
}