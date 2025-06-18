import { Platform, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from '../../contexts/AuthContext';

export default function Index() {
   const {signOut} = useSession()

   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView;

   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-center gap-5 items-center">
         <Text className="text-darkMain dark:text-lightMain text-4xl text-center">This is where it begins</Text>
         <Text className="text-primary text-4xl text-center">This is where it begins</Text>
         <View className="w-8 h-8 p-3 bg-darkGray">
            <View className="w-full h-full bg-lightGray"></View>
         </View>
         <TouchableOpacity className="color-primary" 
         onPress={async () => {
            await signOut()
         }}>
            <Text>Sign out</Text>
         </TouchableOpacity>
      </ContainerComponent>
      
   );
   }