import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from "@react-native-firebase/firestore";
import { FlashList } from "@shopify/flash-list";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import { Modal, PixelRatio, Platform, Text, TouchableOpacity, View } from "react-native";
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

   const [displayTasks, setDisplayTasks] = useState([])

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

            const finalTasks = addSections(updatedTasks)
            setDisplayTasks(finalTasks)

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

         const finalTasks = addSections(newTasks)
         setDisplayTasks(finalTasks)
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

      setDisplayTasks(addSections(newTasks))

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
         
         const finalData = addSections(data)
         setDisplayTasks(finalData)
      }
      fetchTasks()
   }, [])

   function Separator({leadingItem, trailingItem}) {

      if (typeof leadingItem !== "string" && typeof trailingItem !== "string") {
         const gap = trailingItem.startDate.getTime() - (leadingItem.startDate.getTime() + (leadingItem.duration * 60 * 1000))
         if (gap === 0) {
            return (
               <View className="w-full flex-row justify-start items-center">
                  {new Date() >= trailingItem.startDate && 
                     <LinearGradient className="absolute w-1 left-[71]" colors={[leadingItem.color, trailingItem.color]} style={{height: 12.3}}/>
                  }
                  {new Date() < trailingItem.startDate && 
                     <View className="absolute w-1 left-[71] bg-darkGray" style={{height: 12.3}}/>
                  }
                  <Text style={{fontSize: 12, lineHeight: 12}} className="font-semibold text-lightMain/80">{trailingItem.startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
               </View>
            )
         } else {
            const [progress, setProgress] = useState()

            const height = 44.5 

            const gapMins = Math.floor((gap / 1000) / 60)
            const hours = Math.floor(gapMins / 60)
            const mins = gapMins % 60

            useEffect(() => {
               let animationFrameId;
               function updateProgress() {
                  const elapsedTime = new Date().getTime() - (leadingItem.startDate.getTime() + (leadingItem.duration * 60 * 1000))
                  setProgress(Math.max(Math.min(elapsedTime/gap, 1), 0))
                  animationFrameId = requestAnimationFrame(updateProgress)
               } 
               animationFrameId = requestAnimationFrame(updateProgress)

               return () => cancelAnimationFrame(animationFrameId)
            }, [leadingItem, gap])

            return (
               <View className="flex-row flex-between w-full relative">
                  <View className="absolute z-40 left-[71] h-full ">
                     <LinearGradient className="w-1 " colors={[leadingItem.color, trailingItem.color]} style={{height: 39.5}}/>
                  </View>
                  <View className="absolute h-full z-50 flex-col-reverse left-[71]">
                     <View className="w-1 bg-darkGray absolute left-0 right-0 bottom-0" style={{top: PixelRatio.roundToNearestPixel(height * progress)}}/>
                  </View>
                  
                  <View className="w-12"/>
                  <View className="rounded-lg flex-1 py-2">
                     <Text className="text-xl font-medium text-lightMain/80 text-center">{`${hours > 0 ? `${hours}h ` : ''}${mins}min`}</Text>
                  </View>
               </View>
            )
         }
      }  
   }

   function addSections (tasksArray) {
      const result = []
      let lastDate = null

      for (const task of tasksArray) {
         if (lastDate === null) {
            result.push(`${task.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}`)
            lastDate = task.startDate
         } else {
            const previousDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate()).getTime()
            const currentDate = new Date(task.startDate.getFullYear(), task.startDate.getMonth(), task.startDate.getDate()).getTime()
            if (previousDate < currentDate) {
               result.push(`${task.startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric'})}`)
               lastDate = task.startDate
            }
         }
         result.push(task)
      }
      return result
   }

   function Section({title, index, tasks}) {
      const previousTask = tasks.slice(index - 1).find(item => typeof item !== "string")
      const nextTask = tasks.slice(index + 1).find(item => typeof item !== "string")



      return (
         <View className="relative ">
            {new Date() >= nextTask.startDate && 
               <LinearGradient className="absolute w-1 left-[71] h-full" colors={[previousTask.color, nextTask.color]}/>
            }
            {new Date() < nextTask.startDate && 
               <View className="absolute w-1 left-[71] h-full bg-darkGray"/>
            }
            <View className="mt-3 mb-1">
               <Text className="text-lg text-lightMain/80 font-medium text-center w-full">{title}</Text>
            </View>
         </View>     
      )
   }

   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
         <TimelineHeader/>
         <View className="w-full flex-1">
            <FlashList 
               data={displayTasks}
               renderItem={({item, index}) => {
                  if (typeof item === "string") {
                     return <Section title={item} index={index} tasks={displayTasks}/>
                  } else {
                     const previousItem = displayTasks[index - 1]
                     const nextItem = displayTasks[index + 1]

                     const isPreviousConsecutive = index > 1 && previousItem && typeof previousItem !== "string" &&
                        (item.startDate.getTime() - (previousItem.startDate.getTime() + previousItem.duration * 60 * 1000)) === 0

                     const isNextConsecutive = nextItem && typeof nextItem !== "string" &&
                        (nextItem.startDate.getTime() - (item.startDate.getTime() + item.duration * 60 * 1000)) === 0

                     let showStartTime = !isPreviousConsecutive
                     let showEndTime = !isNextConsecutive

                     return <Task id={item.id} name={item.name} color={item.color} emoji={item.emoji} startDate={item.startDate} duration={item.duration} status={item.status} onEdit={handleOpenSettings} onDelete={handleDelete} showStartTime={showStartTime} showEndTime={showEndTime}/>
                  }   
               }}
               scrollEnabled={true}
               ItemSeparatorComponent={Separator}
               showsVerticalScrollIndicator={false}
               ListEmptyComponent={
                  <Text className="text-gray-400 text-center py-4">
                     No tasks yet
                  </Text>
               }
               estimatedItemSize={80}
               keyExtractor={(item) => {
                  if (typeof item === "string") {
                     return item
                  } else {
                     return item.id
                  }
               }}
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
            <TaskSettings onClose={handleCloseSettings} onSave={saveTask} task={tasks.find(t => t.id === selectedTask) || null} tasksArray={tasks}/>
         </Modal>
      </ContainerComponent>
      
   );
}