import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from '../contexts/AuthContext';

export default function Settings() {
   const {signOut} = useSession()

   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-5 items-center pl-4 pr-4 pt-2 pb-2">
         <TouchableOpacity className ="w-full bg-transparent h-fit justify-end flex-row items-center" onPress={() => useRouter().back()}>
            <AntDesign name="close" size={28} color="#6A1FCC" />
         </TouchableOpacity>
         <TouchableOpacity className="bg-primary w-fit h-fit p-2" 
         onPress={async () => {
            await signOut()
         }}>
            <Text className="text-xl">Sign out</Text>
         </TouchableOpacity>
      </ContainerComponent>
      
   );
}