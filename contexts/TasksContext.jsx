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
               status: doc.data().status
            }))
            data.sort((a,b) => a.startDate - b.startDate)
            setTasks(data)
         }
         fetchTasks()
      }
   }, [user])

   useEffect(() => {
      const findActiveTask = () => {
         const activeTask = tasks.find(task => {
            const now = new Date().getTime()
            const startTime = task.startDate.getTime()
            const endTime = startTime + (task.duration * 60 * 1000)
            return now >= startTime && now < endTime
         })
         setCurrentTask(activeTask || null)
      };

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