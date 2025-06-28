import { collection, getDocs, getFirestore } from "@react-native-firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Task from "../../components/Task";
import TimelineHeader from "../../components/TimelineHeader";
import { useSession } from '../../contexts/AuthContext';

export default function Index() {

   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

   const db = getFirestore()

   const {user} = useSession()
   const userId = user.uid

   const [tasks, setTasks] = useState()

   useEffect(() => {
      const fetchImprovements = async () => {
         const snapshot = await getDocs(collection(db, `users/${userId}/tasks`))

         const data = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            color: doc.data().color,
            startDate: doc.data().startDate,
            duration: doc.data().duration
         }))
         setTasks(data)
      }
      fetchImprovements()
   }, [])

   function addTask(task) { //task must be a firebase task document
      setTasks(prev => {
         const updated = [
            ...prev,
            {
               id: task.id,
               name: task.data().name,
               color: task.data().color,
               startDate: task.data().startDate,
               duration: task.data().duration
            }
         ]

         return updated
      })
   }



   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
         <TimelineHeader/>
         <FlashList 
            data={tasks}
            renderItem={({item}) => <Task name={item.name} color={item.color} emoji={item.emoji} duration={item.duration}/>}
            className=""
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
               <Text className="text-gray-400 text-center py-4">
                  No tasks yet
               </Text>
            }
         >
            
         </FlashList>
      </ContainerComponent>
      
   );
}