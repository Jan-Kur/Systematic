import { useState } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/DatePicker";

export default function Journal() {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('sv-SE'))
  const [journalEntries, setJournalEntries] = useState({})

  function onChangeText(content) {
  
    if (content === "") {
      setJournalEntries(prev => {
        const newEntries = { ...prev };
        delete newEntries[selectedDate];
        return newEntries;
      });
    } else {
      setJournalEntries(prev => ({
        ...prev,
        [selectedDate]: {
          content,
        }
      }));
    }
  }
  

  return (
    <SafeAreaView className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center px-4 py-3">
      <DatePicker selectedDate={selectedDate} updateSelectedDate={setSelectedDate} journalEntries={journalEntries}/>
      <JournalEntry content={ journalEntries[selectedDate] ? journalEntries[selectedDate].content : ""} onChangeText={onChangeText}/>
    </SafeAreaView>
  );
}

function JournalEntry({content, onChangeText}) {
  return(
    <TextInput 
      multiline
      value={content}
      onChangeText={onChangeText} 
      numberOfLines={10}  
      style={{ textAlignVertical: 'top' }}
      cursorColor="#6A1FCC"
      className="border-2 border-lightGray bg-darkGray color-lightMain text-lg font-medium rounded-2xl w-full h-2/5"
    />
  )
};

  
