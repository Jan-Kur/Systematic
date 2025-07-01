import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { addDoc, collection, deleteDoc, getDocs, getFirestore } from "@react-native-firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Task from "../../components/Task";
import TaskSettings from '../../components/TaskSettings';
import TimelineHeader from "../../components/TimelineHeader";
import { useSession } from '../../contexts/AuthContext';

export default function Index() {

   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

   const db = getFirestore()

   const {user} = useSession()
   const userId = user.uid

   const [tasks, setTasks] = useState([])

   const [selectedTask, setSelectedTask] = useState(null)

   function handleOpenSettings(taskId) {
      setSelectedTask(taskId);
   };

   function handleCloseSettings() {
      setSelectedTask(null)
   }

   async function handleDelete(id) {
      const newTasks = tasks.filter(item => item.id !== id)
      setTasks(newTasks)

      await deleteDoc(doc(db, `users/${userId}/tasks/${id}`))
   }

   useEffect(() => {
      const fetchImprovements = async () => {
         const snapshot = await getDocs(collection(db, `users/${userId}/tasks`))

         const data = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            color: doc.data().color,
            emoji: doc.data().emoji,
            startDate: doc.data().startDate,
            duration: doc.data().duration,
            status: doc.data().status
         }))
         setTasks(data)
      }
      fetchImprovements()
   }, [])

   function Separator() {
      return (
         <View className="h-3 bg-transparent w-full"/>
      )
   }

   async function addTask() {
      const taskProps = {
         name: "randomName",
         color: "#6A1FCC",
         emoji: "🗿",
         startDate: "randomDate",
         duration: 25
      }

      const docRef = await addDoc(collection(db, `users/${userId}/tasks`), taskProps)

      setTasks(prev => {
         const updated = [
            ...prev,
            {
               id: docRef.id,
               ...taskProps,
               status: "Not done"
            }
         ]

         return updated
      })
   }

   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
         <TimelineHeader/>
         <View className="w-full flex-1">
            <FlashList 
               data={tasks}
               renderItem={({item}) => <Task id={item.id} name={item.name} color={item.color} emoji={item.emoji} duration={item.duration} status={item.status} onEdit={handleOpenSettings} onDelete={handleDelete}/>}
               scrollEnabled={true}
               ItemSeparatorComponent={Separator}
               showsVerticalScrollIndicator={false}
               ListEmptyComponent={
                  <Text className="text-gray-400 text-center py-4">
                     No tasks yet
                  </Text>
               }
               estimatedItemSize={100}
               keyExtractor={(item) => item.id}
            />
         </View>
         
         <TouchableOpacity
            onPress={addTask}
            className="bg-primary rounded-full shadow-md justify-center items-center w-[50] h-[50]"
         >
            <FontAwesome6 name="plus" size={24} color="#08060A"/>
         </TouchableOpacity>

         <Modal
            animationType="slide"
            transparent={true}
            visible={selectedTask !== null}
            onRequestClose={handleCloseSettings}
         >
            <TaskSettings onClose={handleCloseSettings}/>
         </Modal>
      </ContainerComponent>
      
   );
}