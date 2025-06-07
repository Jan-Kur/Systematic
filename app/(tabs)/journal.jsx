import firestore from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/DatePicker";
import ImprovementList from "../../components/ImprovementList";

export default function Journal() {
  const userId = "CeFWuhSTQRIpQTMq8cQ6";

  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('sv-SE'))
  const [journalEntries, setJournalEntries] = useState({})

  const lastSavedContent = useRef('')
  const debounceTimer = useRef(null)

  useEffect(() => {
    const fetchJournalEntries = async () => {
      const snapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('journalEntries')
        .get();

      const data = snapshot.docs.reduce((acc, doc) => {
        acc[doc.id] = {
          content: doc.data().content,
        };
        return acc;
      }, {});
      setJournalEntries(data);

      lastSavedContent.current = data[selectedDate]?.content || '';
    };
    fetchJournalEntries();
  }, []);

  useEffect(() => {
    lastSavedContent.current = journalEntries[selectedDate]?.content || '';
  }, [selectedDate, journalEntries])

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

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (content !== lastSavedContent.current) {
        try {
          if (content === "") {
            await firestore()
              .collection('users')
              .doc(userId)
              .collection('journalEntries')
              .doc(selectedDate)
              .delete();
            console.log("Deleted entry for", selectedDate);
          } else {
            await firestore()
              .collection('users')
              .doc(userId)
              .collection('journalEntries')
              .doc(selectedDate)
              .set({ content }, { merge: true });
            console.log("Saved entry for", selectedDate, ":", content.substring(0, 50) + "...");
          }
          lastSavedContent.current = content;
        } catch (error) {
          console.error("Failed to save journal entry:", error);
        }
      }
    }, 1200);
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


  
