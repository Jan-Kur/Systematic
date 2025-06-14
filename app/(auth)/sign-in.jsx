import { useState } from "react";
import { Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from '../../contexts/AuthContext';

export default function SignIn() {
   const {signIn} = useSession()

   const ContainerComponent = Platform.OS === 'web' ? View : SafeAreaView

   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [showPassword, setShowPassword] = useState(false)
   
   return (
      <ContainerComponent className="bg-lightMain dark:bg-darkMain flex-1 flex-col justify-start gap-3 items-center pl-4 pr-4 pt-2 pb-2">
         <View className="flex-row gap-2">
            <View className="flex-1 h-[2] rounded-full bg-lightGray"/>
            <Text className="text-base color-lightGray font-medium">or</Text>
            <View className="flex-1 h-[2] rounded-full bg-lightGray"/>
         </View>
         <View className="flex-col gap-2 w-full">
            <Text className="text-base font-semibold color-darkMain dark:color-lightMain">Email</Text>
            <TextInput
               className="bg-transparent rounded-xl border-2 text-lg font-medium color-darkMain dark:color-lightMain border-gray-200 dark:border-gray-950 p-2 w-full"
               value={email}
               onChangeText={setEmail}
               placeholder="Enter your email"
               keyboardType="email-address"
               autoCapitalize="none"
               autoCorrect={false}
            />
         </View>
         <View className="flex-col gap-2 w-full">
            <Text className="text-base font-semibold color-darkMain dark:color-lightMain">Password</Text>
            <View className="relative">
               <TextInput
                  className="bg-transparent rounded-xl border-2 text-lg font-medium color-darkMain dark:color-lightMain border-gray-200 dark:border-gray-950 p-2 pr-10 w-full"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  passwordRules="minlength: 8;"
                  autoComplete="password"
               />
               <TouchableOpacity 
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onPress={() => setShowPassword(!showPassword)}
               >
                  <Text className="text-lg">{showPassword ? '👀' : '🙈'}</Text>
               </TouchableOpacity>
            </View>
         </View>
         <TouchableOpacity 
            className="w-full bg-primary rounded-xl p-2"
            onPress={async () => {
               await signIn()
            }}
         >
            <Text className="text-2xl color-darkMain dark:color-lightMain font-semibold">Sign in</Text>
         </TouchableOpacity>
      </ContainerComponent>
   );
}