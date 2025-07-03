import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "@react-native-firebase/firestore";
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

   const [isModalVisible, setIsModalVisible] = useState(false)

   async function saveTask(updatedData) {
      if (selectedTask) {

         const currentTask = tasks.find(item => item.id === selectedTask)

         const hasChanged = Object.keys(updatedData).some(key => {
            if (key === 'startDate') {
               return currentTask[key].getTime() !== updatedData[key].getTime()
            }
            return currentTask[key] !== updatedData[key]
         })


         if (hasChanged) {
            let updatedTasks = tasks.map(item => {
               if (item.id === selectedTask) {
                  return {
                     ...item, ...updatedData 
                  }
               }
               return item
            })
            updatedTasks.sort((a, b) => a.startDate - b.startDate)
            setTasks(updatedTasks)

            await updateDoc(doc(db, `users/${userId}/tasks/${selectedTask}`), {
               ...updatedData
            })
         }
      } else {
         const docRef = await addDoc(collection(db, `users/${userId}/tasks`), {
            status: "Not done",
            ...updatedData
         })

         const newTask = {
            id: docRef.id,
            status: "Not done",
            ...updatedData
         }
         let newTasks = [...tasks, newTask]
         newTasks.sort((a, b) => a.startDate - b.startDate)
         setTasks(newTasks)
      }
   }

   function handleOpenSettings(taskId) {
      setSelectedTask(taskId);
      setIsModalVisible(true)
   };

   function handleCloseSettings() {
      setSelectedTask(null)
      setIsModalVisible(false)
   }

   async function handleDelete(id) {
      const newTasks = tasks.filter(item => item.id !== id)
      setTasks(newTasks)

      await deleteDoc(doc(db, `users/${userId}/tasks/${id}`))
   }

   useEffect(() => {
      const fetchTasks = async () => {
         const snapshot = await getDocs(collection(db, `users/${userId}/tasks`))

         const data = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            color: doc.data().color,
            emoji: doc.data().emoji,
            startDate: doc.data().startDate.toDate(),
            duration: doc.data().duration,
            status: doc.data().status
         }))
         data.sort((a, b) => a.startDate - b.startDate)

         setTasks(data)    
      }
      fetchTasks()
   }, [])

   function Separator() {
      return (
         <View className="h-3 bg-transparent w-full"/>
      )
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
            onPress={() => handleOpenSettings(null)}
            className="bg-primary rounded-full shadow-md justify-center items-center w-[50] h-[50]"
         >
            <FontAwesome6 name="plus" size={24} color="#08060A"/>
         </TouchableOpacity>

         <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={handleCloseSettings}
         >
            <TaskSettings onClose={handleCloseSettings} onSave={saveTask} task={tasks.find(t => t.id === selectedTask) || null}/>
         </Modal>
      </ContainerComponent>
      
   );
}