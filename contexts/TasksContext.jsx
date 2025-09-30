import { collection, getDocs, getFirestore } from "@react-native-firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from './AuthContext';

const TasksContext = createContext()

export function useTasks() {
   return useContext(TasksContext)
}

export function TasksProvider({children}) {
   const {user} = useSession()
   const [tasks, setTasks] = useState([])
   const [currentTask, setCurrentTask] = useState(null)

   useEffect(() => {
      if (user) {
         const db = getFirestore()
         async function fetchTasks() {
            const snapshot = await getDocs(collection(db, `users/${user.uid}/tasks`))
            const data = snapshot.docs.map(doc => ({
               id: doc.id,
               name: doc.data().name,
               color: doc.data().color,
               emoji: doc.data().emoji,
               startDate: doc.data().startDate.toDate(),
               duration: doc.data().duration,
               status: doc.data().status,
            }))
            data.sort((a,b) => a.startDate - b.startDate)
            setTasks(data)
         }
         fetchTasks()
      }
   }, [user])

   function shallowEqual(obj1, obj2) {
      if (obj1 === obj2) return true
      if (!obj1 || !obj2) return false
      const keys1 = Object.keys(obj1)
      const keys2 = Object.keys(obj2)
      if (keys1.length !== keys2.length) return false
      return keys1.every(key => obj1[key] === obj2[key])
   }


   useEffect(() => {
      const findActiveTask = () => {
         const now = new Date().getTime()
         const found = tasks.find(task => {
            const start = task.startDate.getTime()
            const end = start + task.duration * 60 * 1000
            return now >= start && now < end
         })

         setCurrentTask(prev => {
            if (prev?.id === found?.id) return prev
            return found || null
         })
      }


      findActiveTask()

      const interval = setInterval(findActiveTask, 1000)

      return () => clearInterval(interval)
   }, [tasks])

   const value = {
      tasks,
      setTasks,
      currentTask,
   }

   return (
      <TasksContext.Provider value={value}>
         {children}
      </TasksContext.Provider>
   )
}