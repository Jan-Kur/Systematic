import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";

export default function JournalCalendar() {
    const today = new Date();
    const [date, setDate] = useState(today);

    function arrowLeft() {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);
        setDate(newDate);
    }

    function arrowRight() {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);
        setDate(newDate);
    }

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return(
    <View className="w-fit rounded-3xl bg-darkGray p-1 border-2 border-lightGray flex-col justify-start items-center">
        <View className="flex-row justify-center gap-5 w-fit items-center mb-6 px-2">
            <TouchableOpacity onPress={arrowLeft}>
                <MaterialIcons name="keyboard-arrow-left" size={36} color="#6A1FCC" />
            </TouchableOpacity>
            
            <Text className="text-lightMain text-2xl font-bold">
                {date.toLocaleDateString("en-US", {month: "long", year: "numeric"})}
            </Text>
            
            <TouchableOpacity onPress={arrowRight}>
                <MaterialIcons name="keyboard-arrow-right" size={36} color="#6A1FCC" />
            </TouchableOpacity>
        </View>

        <View className="flex-row justify-start w-fit">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <View key={day} className="w-11 ml-[5px] mr-[5px] justify-center items-center flex-row" >
                    <Text className="text-lightMain text-lg font-medium w-fit h-fit">
                    {day}
                    </Text>
                </View>
            ))}
        </View>
        
        <View className="flex-row flex-wrap justify-start w-[340px]">
            {days.map(day => {
                return (
                    <TouchableOpacity key={day} className='bg-lightGray rounded-xl justify-center items-center w-11 h-11 m-[5px]'>
                        <Text className="text-lightMain text-xl font-medium">{day}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
    ) 
}