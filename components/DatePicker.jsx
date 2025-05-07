import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import JournalCalendar from './JournalCalendar';

export default function DatePicker({selectedDate, updateSelectedDate, journalEntries}) {
    const [calendarVisible, setCalendarVisible] = useState(false);
    
    function openCalendar() {
        setCalendarVisible(true);
    }

    function closeCalendar() {
        setCalendarVisible(false);
    }

    function handleDateSelect(date) {
        updateSelectedDate(date);
        closeCalendar();
    }

    return (
        <View className="relative">
          <TouchableOpacity
            onPress={openCalendar}
            className="flex-row justify-between px-2 items-center bg-darkGray rounded-lg w-[150px] h-10"
          >
            <Text className="text-primary text-xl font-medium">{selectedDate}</Text>
            <Feather name="calendar" size={24} color="#6A1FCC" />
          </TouchableOpacity>
          
          <Modal
            animationType="fade"
            visible={calendarVisible}
            transparent={true}
            onRequestClose={closeCalendar}
          >
            <Pressable
              className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"
              onPress={closeCalendar}
            />
            <View className="absolute top-[45px] left-1/2 transform -translate-x-1/2 z-50 p-4">
                <JournalCalendar
                  onDateSelect={handleDateSelect}
                  journalEntries={journalEntries}
                />
            </View>
          </Modal>
        </View>
      );
      
}