import firestore from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Platform, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DatePicker from "../../components/DatePicker";
import ImprovementList from "../../components/ImprovementList";

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
  }, [selectedDate])
   
   function onChangeText(content) {
    const currentDate = selectedDate;

    setJournalEntries(prev => {
        const newEntries = { ...prev };
        if (content === "") {
            delete newEntries[currentDate];
        } else {
            newEntries[currentDate] = { content };
        }
        return newEntries;
    });

    if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
        const lastContent = lastSavedContent.current;
        const latestContent = content; 

        if (latestContent !== lastContent) {
            try {
                const entryRef = firestore()
                    .collection('users')
                    .doc(userId)
                    .collection('journalEntries')
                    .doc(currentDate);

                if (latestContent === "") {
                    await entryRef.delete();
                    console.log("Deleted entry for", currentDate);
                } else {
                    await entryRef.set({ content: latestContent }, { merge: true });
                    console.log("Saved entry for", currentDate, ":", latestContent.substring(0, 50) + "...");
                }
                lastSavedContent.current = latestContent;
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


  
