import { useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/DatePicker";
import ImprovementList from "../../components/ImprovementList";

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

  const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

  return (
    <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
      <DatePicker selectedDate={selectedDate} updateSelectedDate={setSelectedDate} journalEntries={journalEntries}/>
      <JournalEntry content={ journalEntries[selectedDate] ? journalEntries[selectedDate].content : ""} onChangeText={onChangeText}/>
      <ImprovementList/>
    </ContainerComponent>
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


  
