import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore } from '@react-native-firebase/firestore';
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useSession } from '../contexts/AuthContext';

export default function ImprovementList() {
   const db = getFirestore();

   const {user} = useSession()
   const userId = user.uid

   const [improvements, setImprovements] = useState([])

   useEffect(() => {
      const fetchImprovements = async () => {

         const snapshot = await getDocs(collection(db, `users/${userId}/improvements`))

         const data = snapshot.docs.map(doc => ({
               id: doc.id,
               content: doc.data().content,
               editing: false
         }));
         setImprovements(data);
      };

      fetchImprovements();
   }, []);

   function addImprovement() {
      setImprovements(prev => {
         const updated = [
               ...prev,
               {
                  id: Math.random().toString(36).slice(2, 11),
                  content: "",
                  editing: true
               }
         ];

         setTimeout(() => {
               flatListRef.current?.scrollToEnd({ animated: true });
         }, 0);

         return updated;
      });
   }

   async function updateImprovementContent(tempId, newContent) {

      const docRef = await addDoc(collection(db, `users/${userId}/improvements`), {content: newContent})

      const newItem = {
         id: docRef.id,
         content: newContent,
         editing: false
      };

      setImprovements(prev =>
         prev.map(item =>
         item.id === tempId ? newItem : item
         )
      );
   }


   function renderItem({item}) {
      if (item.editing) {
         return (
               <EditableItem id={item.id} onSubmit={updateImprovementContent}/>
         )
      } else {
         return (
               <UneditableItem content={item.content} id={item.id}/>
         )
      }
   }

   function SeparatorItem() {
      return (
         <>
               <View className="w-full bg-transparent h-[5] self-center"/>
               <View className="w-full bg-transparent h-[5] self-center"/>
         </>
         
      )
   }
   function EditableItem({ id, onSubmit }) {
      const [value, setValue] = useState("");

      function handleSubmitEditing() {
         if (value.trim()) {
               onSubmit(id, value.trim());
               Keyboard.dismiss();
         }
      }

      return (
         <View className="bg-transparent rounded-xl px-2 py-3 shadow-sm border-2 border-primary w-full h-fit flex justify-center items-center">

               <TextInput
                  value={value}
                  onChangeText={setValue}
                  onSubmitEditing={handleSubmitEditing}
                  placeholder="Enter improvement..."
                  placeholderTextColor="#A0A0A0"
                  autoFocus
                  className="text-base font-medium text-darkMain dark:text-lightMain w-full"
                  returnKeyType="done"
               />
         </View>
      );
   }

   function UneditableItem({ content, id }) {
      
      const fadeAnim = useRef(new Animated.Value(1)).current;
      
      function handleDelete() {
         Animated.timing(fadeAnim, {
         toValue: 0,
         duration: 300,
         useNativeDriver: true,
         }).start(() => {
               setImprovements(prev => prev.filter(item => item.id !== id));
               deleteDoc(doc(db, `users/${userId}/improvements/${id}`))

         });
         
      }
   
      return (
         <Animated.View
         style={{ opacity: fadeAnim }}
         className="bg-darkGray rounded-xl px-4 py-3 flex-row items-center shadow-sm w-full min-h-[50] h-fit"
         >
               <BouncyCheckbox
                  size={24}
                  fillColor="#6A1FCC"
                  unfillColor="#FFFFFF"
                  iconStyle={{ borderColor: '#6A1FCC' }}
                  innerIconStyle={{ borderWidth: 2 }}
                  onPress={checked => {
                     if (checked) {
                           handleDelete()
                     } 
                  }}
                  textComponent={<Text numberOfLines={0} className="text-lg font-medium text-darkMain dark:text-lightMain px-3">{content}</Text>}
               />
         </Animated.View>
         
      );
   }

   const flatListRef = useRef(null);

   return (
      <View className="flex-col flex-1 items-center pt-2 w-full bg-transparent">
         <FlatList
               data={improvements}
               renderItem={renderItem}
               keyExtractor={(item) => item.id}
               ref={flatListRef}
               className="w-full"
               scrollEnabled={true}
               showsVerticalScrollIndicator={false}
               ItemSeparatorComponent={SeparatorItem}
               ListEmptyComponent={
                  <Text className="text-gray-400 text-center py-4">
                     No improvements yet
                  </Text>
               }
         />

         <TouchableOpacity
               onPress={addImprovement}
               className="bg-darkGray px-4 py-1 mt-3 rounded-lg shadow-md"
         >
               <FontAwesome6 name="plus" size={24} color="#6A1FCC" />
         </TouchableOpacity>
      </View>       
   )
}