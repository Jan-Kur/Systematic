import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from "react-native";

export default function JournalCalendar({onDateSelect, journalEntries}) {
    const [date, setDate] = useState(new Date());

    function arrowLeft() {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() - 1);
        setDate(newDate);
    }
    
    function arrowRight() {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + 1);
        setDate(newDate);
    }

    const todayStr = new Date().toLocaleDateString('sv-SE');

    const daysInThisMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const firstWeekday = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const days = [];

    for (let i = 1; i <= daysInThisMonth; i++) {
    const currentDate = new Date(date.getFullYear(), date.getMonth(), i);
    const dateStr = currentDate.toLocaleDateString('sv-SE');

    days.push({
        dayNumber: i,
        date: dateStr,
        isToday: dateStr === todayStr,
        hasEntry: !!journalEntries[dateStr],
    });
    }

    return(
    <View className="w-fit rounded-3xl bg-darkGray p-1 border-2 border-lightGray flex-col justify-start items-center">
        <View className="flex-row justify-center gap-5 w-fit items-center mb-3 px-2">
            <TouchableOpacity onPress={arrowLeft}>
                <MaterialIcons name="keyboard-arrow-left" size={34} color="#6A1FCC" />
            </TouchableOpacity>
            
            <Text className="text-lightMain text-xl font-bold">
                {date.toLocaleDateString("en-US", {month: "long", year: "numeric"})}
            </Text>
            
            <TouchableOpacity onPress={arrowRight}>
                <MaterialIcons name="keyboard-arrow-right" size={34} color="#6A1FCC" />
            </TouchableOpacity>
        </View>

        <View className="flex-row justify-start w-fit">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <View key={day} className="w-11 ml-[5px] mr-[5px] justify-center items-center flex-row" >
                    <Text className="text-lightMain text-lg font-semibold w-fit h-fit">
                    {day}
                    </Text>
                </View>
            ))}
        </View>
        
        <View className="flex-row flex-wrap justify-start w-[340px]">
        {Array.from({ length: (firstWeekday + 6) % 7}).map((_, index) => (
            <View key={`spacer-${index}`} className="w-11 h-11 m-[5px] opacity-0"/>))}
            {days.map(day => {
                return (
                    <TouchableOpacity onPress={() => {
                        onDateSelect(day.date)
                    }} key={day.dayNumber} className={`${day.hasEntry ? "bg-primary" : "bg-lightGray"} rounded-xl ${day.isToday ? "border-2 border-[#AC40FF]" : ""} justify-center items-center w-11 h-11 m-[5px]`}>
                        <Text className="text-lightMain text-xl font-semibold">{day.dayNumber}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    </View>
    ) 
}